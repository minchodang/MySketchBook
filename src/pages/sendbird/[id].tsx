import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import SendBirdCall from 'sendbird-calls';
const DynamicSendbirdComponent = dynamic(() => import('@/components/SendBirdComponent'), {
    ssr: false,
    loading: () => <p>loading...</p>,
});

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const SendBirdChattingPage = () => {
    return (
        <Container>
            <DynamicSendbirdComponent />
        </Container>
    );
};

export default SendBirdChattingPage;
