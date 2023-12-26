import styled from '@emotion/styled';
import { Counter1 } from '@/components/Counter1';
import { Counter2 } from '@/components/Counter2';
import { createStore } from '@/utils/createStore';

const Container = styled.div``;
export const counterStore = createStore({ count: 0 });

const IndexPage = () => (
    <Container>
        <Counter1 />
        <Counter2 />
    </Container>
);

export default IndexPage;
