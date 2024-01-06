import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styled from '@emotion/styled';
import SortableItem from './SortableItem';

interface ISortableContainer {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any;
}

const SortableContainerWrapper = styled.div`
    background: '#dadada';
    padding: 10;
    margin: 10;
    flex: 1;
`;

const SortableContainer = ({ id, items }: ISortableContainer) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
            <SortableContainerWrapper ref={setNodeRef}>
                {items.map((v: string) => (
                    <SortableItem key={v} id={v} />
                ))}
            </SortableContainerWrapper>
        </SortableContext>
    );
};

export default SortableContainer;
