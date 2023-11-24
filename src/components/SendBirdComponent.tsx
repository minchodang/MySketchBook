import styled from '@emotion/styled';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import SendBirdCall, { DialParams } from 'sendbird-calls';

const VideoContainer = styled.div`
    display: flex;
    gap: 15px;
`;

const authOption = {
    userId: 'mstest',
    accessToken: 'a34ff4d124b630432bb67fc86f008048eee2d9cf',
};

const dialParams: DialParams = {
    userId: 'mstest2',
    isVideoCall: true,
    callOption: {
        localMediaView: document.getElementById('local_video_element_id') as HTMLMediaElement,
        remoteMediaView: document.getElementById('remote_video_element_id') as HTMLMediaElement,
        audioEnabled: true,
        videoEnabled: true,
    },
};

const SendbirdComponent = () => {
    const [isAuth, setIsAuth] = useState(false);
    const originVideoRef = useRef<MutableRefObject<HTMLMediaElement>>();
    const remoteVideoRef = useRef<HTMLMediaElement>();

    SendBirdCall.init('B5713152-D2E1-4CE1-8646-395C4F9922DB');
    SendBirdCall.useMedia({
        audio: true,
        video: true,
    });
    SendBirdCall.authenticate(authOption, (result, error) => {
        if (result) {
            setIsAuth(true);
        }
    });
    SendBirdCall.addListener('ai-for-pet-test', {
        onRinging: (call) => {
            //...
            console.log(call, 'test');
        },
    });
    const call = useCallback(() => {
        SendBirdCall.dial(dialParams, (call, error) => {
            if (error) {
                console.log(error, '에러!');
            }
            call?.setLocalMediaView(
                document.getElementById('local_video_element_id') as HTMLMediaElement,
            );
            call?.setRemoteMediaView(
                document.getElementById('remote_video_element_id') as HTMLMediaElement,
            );
        });
    }, []);

    useEffect(() => {
        if (isAuth) {
            SendBirdCall.connectWebSocket()
                .then((a) => {
                    console.log('응답 성공!');
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [isAuth]);

    return (
        <div>
            <button onClick={call}>통화걸기</button>
            <VideoContainer>
                <video id="local_video_element_id" autoPlay playsInline muted />
                <video id="remote_video_element_id" autoPlay playsInline />
            </VideoContainer>
        </div>
    );
};

export default SendbirdComponent;
