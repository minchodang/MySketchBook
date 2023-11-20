import useSocket from '@/hooks/useSocket';
import { NextRouter, useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        },
    ],
};
interface Stream {
    getTracks: () => MediaStreamTrack[];
}

const Room = () => {
    useSocket();
    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter() as NextRouter;
    const userVideoRef = useRef<any>(null);
    const peerVideoRef = useRef<any>(null);
    const rtcConnectionRef = useRef<any>(null);
    const socketRef = useRef<any>();
    const userStreamRef = useRef<any>();
    const hostRef = useRef<boolean>(false);

    const { id: roomName } = router.query;

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
                    userVideoRef.current && userVideoRef.current.play();
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
                    userVideoRef.current && userVideoRef.current.play();
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

    const onPeerLeave = () => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        if (!peerVideoRef.current) {
            return;
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track: { stop: () => any }) => track.stop()); // Stops receiving all track of Peer.
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    };

    const handleAnswer = (answer: any) => {
        rtcConnectionRef.current.setRemoteDescription(answer).catch((err: any) => console.log(err));
    };

    const handleICECandidateEvent = useCallback(
        (event: { candidate: any }) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', event.candidate, roomName);
            }
        },
        [roomName],
    );

    const createPeerConnection = useCallback(() => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent as any;
        return connection;
    }, [handleICECandidateEvent]);

    const initiateCall = useCallback(() => {
        if (!userStreamRef.current) {
            return;
        }
        rtcConnectionRef.current = createPeerConnection();

        const tracks = userStreamRef.current.getTracks();
        tracks.forEach((track: any) => {
            if (!rtcConnectionRef.current) {
                return;
            }
            userStreamRef.current &&
                rtcConnectionRef.current.addTrack(track, userStreamRef.current);
        });

        createAndSendOffer();
    }, [createAndSendOffer, createPeerConnection]);

    const handleReceivedOffer = useCallback(
        (offer: any) => {
            if (!hostRef.current) {
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
                    .then((answer: any) => {
                        rtcConnectionRef.current.setLocalDescription(answer);
                        socketRef.current.emit('answer', answer, roomName);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            }
        },
        [createPeerConnection, roomName],
    );
    const handlerNewIceCandidateMsg = (incoming: RTCIceCandidateInit | undefined) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current.addIceCandidate(candidate).catch((e: any) => console.log(e));
    };

    const handleTrackEvent = (event: { streams: any[] }) => {
        // eslint-disable-next-line prefer-destructuring
        peerVideoRef.current.srcObject = event.streams[0];
    };

    const toggleMediaStream = (type: string, state: boolean) => {
        userStreamRef.current.getTracks().forEach((track: { kind: string; enabled: boolean }) => {
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
        socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject
                .getTracks()
                .forEach((track: { stop: () => any }) => track.stop()); // Stops receiving all track of User.
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track: { stop: () => any }) => track.stop()); // Stops receiving audio track of Peer.
        }

        // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
        }
        // router.push('/');
    };
    useEffect(() => {
        socketRef.current = io();
        // First we join a room
        socketRef.current.emit('join', roomName);

        socketRef.current.on('joined', handleRoomJoined);
        // If the room didn't exist, the server would emit the room was 'created'
        socketRef.current.on('created', handleRoomCreated);
        // Whenever the next person joins, the server emits 'ready'
        socketRef.current.on('ready', initiateCall);

        // Emitted when a peer leaves the room
        socketRef.current.on('leave', onPeerLeave);

        // If the room is full, we show an alert
        socketRef.current.on('full', () => {
            window.location.href = '/';
        });

        // Event called when a remote user initiating the connection and
        socketRef.current.on('offer', handleReceivedOffer);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

        // clear up after
        return () => socketRef.current.disconnect();
    }, [handleReceivedOffer, handleRoomJoined, initiateCall, roomName]);
    return (
        <div>
            {isLoading ? <div>로딩 중 ....</div> : null}
            <video autoPlay ref={userVideoRef} muted playsInline />
            <video autoPlay ref={peerVideoRef} playsInline />
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
