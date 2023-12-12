import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Button = styled.button``;

const SendBirdPage = () => {
    const router = useRouter();
    return (
        <Container>
            <Button
                onClick={() => {
                    router.push(`/sendbird/1`);
                }}
            >
                센드 버드 입장
            </Button>
        </Container>
    );
};

export default SendBirdPage;
