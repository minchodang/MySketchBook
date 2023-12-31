import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import SendBirdCall from 'sendbird-calls';

interface MediaType {
    audio: boolean;
    video: boolean;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const CallComponent = () => {
    const [isClickBtn, setIsClickBtn] = useState<MediaType>({
        audio: false,
        video: false,
    });
    const [audio, setAudio] = useState<InputDeviceInfo[]>();
    const [video, setVideo] = useState<InputDeviceInfo[]>();
    const router = useRouter();

    const getConnectedDevices = async (type: 'videoinput' | 'audioinput') => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter((device) => device.kind === type);
    };

    const onClickBtn = useCallback(() => {
        router.push(`/room/1`);
    }, [router]);

    return (
        <Container>
            <div>
                <button onClick={onClickBtn} type="button">
                    화상 셋팅하기
                </button>
            </div>
        </Container>
    );
};

export default CallComponent;
