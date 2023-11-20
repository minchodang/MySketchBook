import CallComponent from '@/components/CallComponent';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const CallPage = () => {
    return (
        <Container>
            <CallComponent />
        </Container>
    );
};
export default CallPage;
