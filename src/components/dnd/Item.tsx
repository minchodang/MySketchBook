import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';

const Container = styled.div`
    width: 320px;
    height: 120px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid gray;
    text-align: center;
`;

interface Props {
    name: string;
}

const Item = ({ name }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: name,
    });

    return (
        <Container
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                zIndex: isDragging ? '100' : undefined,
            }}
        >
            {name}
        </Container>
    );
};

export default Item;
