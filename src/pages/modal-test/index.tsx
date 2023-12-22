import { FC } from 'react';
import styled from '@emotion/styled';
import { ExampleModal } from '@/components/ExampleModal';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px;
`;

const CompoundComponentPage: FC = () => (
    <Container>
        <ExampleModal />
    </Container>
);
export default CompoundComponentPage;
