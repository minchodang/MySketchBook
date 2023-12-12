import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { NextRouter, useRouter } from 'next/router';
import { Socket } from 'socket.io';

const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        },
    ],
};
const Video = styled.video``;

const Room = () => {
    const [micActive, setMicActive] = useState<boolean>(true);
    const [cameraActive, setCameraActive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter() as NextRouter;
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const peerVideoRef = useRef<HTMLVideoElement>(null);
    const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const userStreamRef = useRef<MediaStream | null>(null);
    const hostRef = useRef<boolean>(false);

    const { id: roomName } = router.query as { id: string };

    const handleRoomJoined = useCallback(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: {
                    autoGainControl: true,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                if (!userVideoRef.current || !socketRef.current) {
                    return;
                }

                userStreamRef.current = stream;
                const videoTracks = stream.getVideoTracks();
                userVideoRef.current.srcObject = new MediaStream(videoTracks);
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current?.play();
                };
                socketRef.current.emit('ready', roomName);
            })
            .catch((err) => {
                console.log('error', err);
            });
    }, [roomName]);

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                if (!userVideoRef.current) {
                    return;
                }
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current?.play();
                    setIsLoading(false);
                };
            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
            });
    };

    const createAndSendOffer = useCallback(async () => {
        try {
            if (!rtcConnectionRef.current || !socketRef.current) {
                return;
            }
            const offer = await rtcConnectionRef.current.createOffer();
            await rtcConnectionRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', offer, roomName);
        } catch (error) {
            console.error('Error creating and sending offer:', error);
        }
    }, [roomName]);

    const onPeerLeave = useCallback(() => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        if (!peerVideoRef.current) {
            return;
        }
        if (peerVideoRef.current.srcObject) {
            const peerVideoStream = peerVideoRef.current.srcObject as MediaStream;
            peerVideoStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    }, []);
    const handleAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
        if (rtcConnectionRef.current)
            rtcConnectionRef.current
                .setRemoteDescription(answer)
                .catch((err: Error) => console.log(err));
    }, []);

    const handleICECandidateEvent = useCallback(
        (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', event.candidate, roomName);
            }
        },
        [roomName],
    );

    const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
        if (!peerVideoRef.current) {
            return;
        }
        const [stream] = event.streams;
        peerVideoRef.current.srcObject = stream;
    }, []);

    const createPeerConnection = useCallback(() => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        return connection;
    }, [handleICECandidateEvent, handleTrackEvent]);

    const initiateCall = useCallback(() => {
        if (!userStreamRef.current) {
            return;
        }
        rtcConnectionRef.current = createPeerConnection();

        const tracks = userStreamRef.current.getTracks();
        tracks.forEach((track: MediaStreamTrack) => {
            if (!rtcConnectionRef.current) {
                return;
            }

            if (!userStreamRef.current) {
                return;
            }
            rtcConnectionRef.current.addTrack(track, userStreamRef.current);
        });

        createAndSendOffer();
    }, [createAndSendOffer, createPeerConnection]);

    const handleReceivedOffer = useCallback(
        (offer: RTCSessionDescriptionInit) => {
            if (!hostRef.current && userStreamRef.current) {
                rtcConnectionRef.current = createPeerConnection();
                rtcConnectionRef.current.addTrack(
                    userStreamRef.current.getTracks()[0],
                    userStreamRef.current,
                );
                rtcConnectionRef.current.addTrack(
                    userStreamRef.current.getTracks()[1],
                    userStreamRef.current,
                );
                rtcConnectionRef.current.setRemoteDescription(offer);

                rtcConnectionRef.current
                    .createAnswer()
                    .then((answer: RTCSessionDescriptionInit) => {
                        rtcConnectionRef.current?.setLocalDescription(answer);
                        socketRef.current?.emit('answer', answer, roomName);
                    })
                    .catch((error: Error) => {
                        console.log(error);
                    });
            }
        },
        [createPeerConnection, roomName],
    );

    const handlerNewIceCandidateMsg = useCallback((incoming: RTCIceCandidateInit) => {
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current?.addIceCandidate(candidate).catch((e: Error) => console.log(e));
    }, []);

    const toggleMediaStream = (type: 'audio' | 'video', state: boolean) => {
        userStreamRef.current?.getTracks().forEach((track: MediaStreamTrack) => {
            if (track.kind === type) {
                // eslint-disable-next-line no-param-reassign
                track.enabled = !state;
            }
        });
    };

    const toggleMic = () => {
        toggleMediaStream('audio', micActive);
        setMicActive((prev) => !prev);
    };

    const toggleCamera = () => {
        toggleMediaStream('video', cameraActive);
        setCameraActive((prev) => !prev);
    };

    const leaveRoom = () => {
        socketRef.current?.emit('leave', roomName);

        if (userVideoRef.current?.srcObject) {
            const userStream = userVideoRef.current.srcObject as MediaStream;
            userStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
        if (peerVideoRef.current?.srcObject) {
            const peerStream = peerVideoRef.current.srcObject as MediaStream;
            peerStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }

        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
        }
    };

    useEffect(() => {
        socketRef.current?.on('leave', onPeerLeave);
        socketRef.current?.on('offer', handleReceivedOffer);
        socketRef.current?.on('answer', handleAnswer);
        socketRef.current?.on('ice-candidate', handlerNewIceCandidateMsg);

        return () => {
            if (!socketRef.current) {
                return;
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            socketRef.current.disconnect();
        };
    }, [
        handleReceivedOffer,
        handleRoomJoined,
        initiateCall,
        roomName,
        onPeerLeave,
        handleAnswer,
        handlerNewIceCandidateMsg,
    ]);

    return (
        <div>
            {isLoading ? <div>로딩 중 ....</div> : null}
            <Video autoPlay ref={userVideoRef} muted playsInline />
            <Video autoPlay ref={peerVideoRef} playsInline />
            <button onClick={toggleMic} type="button">
                {micActive ? 'Mute Mic' : 'UnMute Mic'}
            </button>
            <button onClick={leaveRoom} type="button">
                Leave
            </button>
            <button onClick={toggleCamera} type="button">
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
        </div>
    );
};

export default Room;
