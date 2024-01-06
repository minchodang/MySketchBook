import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import styled from '@emotion/styled';

interface IItem {
    id: UniqueIdentifier;
}

const ItemWrapper = styled.div`
    width: '100%';
    height: 50;
    display: 'flex';
    align-items: 'center';
    justify-content: 'center';
    border: '1px solid black';
    margin: '10px 0';
    background: 'white';
`;

const Item = ({ id }: IItem) => <ItemWrapper>{id}</ItemWrapper>;

const SortableItem = ({ id }: { id: UniqueIdentifier }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const SortableItemWrapper = styled.div`
        transform: ${transform} ${transition};
    `;

    return (
        <SortableItemWrapper ref={setNodeRef} {...attributes} {...listeners}>
            <Item id={id} />
        </SortableItemWrapper>
    );
};

export default SortableItem;
