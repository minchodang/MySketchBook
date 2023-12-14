import styled from '@emotion/styled';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '@/utils/stackflow';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px;
`;

const MyFirstStack: ActivityComponentType = () => {
    const { push } = useFlow();

    const onClick = () => {
        push('SecondStack', {
            title: 'hello',
        });
    };

    return (
        <AppScreen>
            <Container>
                <div onClick={onClick}>첫 번째 페이지입니다.</div>
            </Container>
        </AppScreen>
    );
};

export default MyFirstStack;
