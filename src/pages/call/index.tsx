import styled from '@emotion/styled';
import CallComponent from '@/components/CallComponent';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const CallPage = () => (
    <Container>
        <CallComponent />
    </Container>
);
export default CallPage;
