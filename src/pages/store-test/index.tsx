import styled from '@emotion/styled';
import { Counter1 } from '@/components/Counter1';
import { TextEditor } from '@/components/TextEditor';
import { createStore } from '@/utils/createStore';

const Container = styled.div``;
export const counterStore = createStore({ count: 0 });
export const selectorStore = createStore({ count: 0, text: 'hi' });

const IndexPage = () => (
    <Container>
        <Counter1 />
        <TextEditor />
    </Container>
);

export default IndexPage;
