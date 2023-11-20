import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import SendBirdCall from 'sendbird-calls';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const SendBirdPage = () => {
    const router = useRouter();
    return (
        <Container>
            <button
                onClick={() => {
                    router.push(`/sendbird/1`);
                }}
            >
                센드 버드 입장
            </button>
        </Container>
    );
};

export default SendBirdPage;
