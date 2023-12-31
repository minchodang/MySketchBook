/* eslint-disable jsx-a11y/media-has-caption */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import useSocket from '../../hooks/useSocket';

const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        },
    ],
};

const Room = () => {
    useSocket();
    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const userVideoRef = useRef();
    const peerVideoRef = useRef();
    const rtcConnectionRef = useRef(null);
    const socketRef = useRef();
    const userStreamRef = useRef();
    const hostRef = useRef(false);

    const { id: roomName } = router.query;
    useEffect(() => {
        socketRef.current = io();
        socketRef.current.emit('join', roomName);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('joined', handleRoomJoined);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('created', handleRoomCreated);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('ready', initiateCall);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('leave', onPeerLeave);

        socketRef.current.on('full', () => {
            // eslint-disable-next-line no-undef
            window.location.href = '/';
        });

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('offer', handleReceivedOffer);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('answer', handleAnswer);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

        return () => socketRef.current.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomName]);

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: {
                    noiseSuppression,
                    autoGainControl,
                    echoCancellation,
                },
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                userStreamRef.current = stream;
                const videoTracks = stream.getVideoTracks();
                userVideoRef.current.srcObject = new MediaStream(videoTracks);
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                    setIsLoading(false);
                };
                socketRef.current.emit('ready', roomName);
            })
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                    setIsLoading(false);
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socketRef.current.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const onPeerLeave = () => {
        hostRef.current = true;
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stops receiving all track of Peer.
        }

        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    };

    const createPeerConnection = () => {
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        connection.onicecandidate = handleICECandidateEvent;

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        connection.ontrack = handleTrackEvent;
        return connection;
    };

    const handleReceivedOffer = (offer) => {
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
                .then((answer) => {
                    rtcConnectionRef.current.setLocalDescription(answer);
                    socketRef.current.emit('answer', answer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleAnswer = (answer) => {
        rtcConnectionRef.current.setRemoteDescription(answer).catch((err) => console.log(err));
    };

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            socketRef.current.emit('ice-candidate', event.candidate, roomName);
        }
    };

    const handlerNewIceCandidateMsg = (incoming) => {
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
    };

    const handleTrackEvent = (event) => {
        // eslint-disable-next-line prefer-destructuring
        peerVideoRef.current.srcObject = event.streams[0];
    };

    const toggleMediaStream = (type, state) => {
        userStreamRef.current.getTracks().forEach((track) => {
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
        socketRef.current.emit('leave', roomName);

        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }

        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
        router.push('/');
    };

    return (
        <div>
            {isLoading ? <div>로딩중...</div> : null}
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
