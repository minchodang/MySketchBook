import { useFlow } from '@/utils/stackflow';
import styled from '@emotion/styled';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

type Params = {
    title: string;
};
const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px;
`;

const SecondStack: ActivityComponentType<Params> = ({ params }) => {
    const { pop } = useFlow();
    const onClick = () => {
        pop();
    };
    return (
        <AppScreen>
            <Container>
                <h1 onClick={onClick}>{params.title}</h1>
            </Container>
        </AppScreen>
    );
};

export default SecondStack;
