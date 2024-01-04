import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import styled from '@emotion/styled';
import Item from './Item';

const Container = styled.div`
    width: 360px;
    height: 100%;
    background-color: white;
    border-radius: 8px;
    padding: 20px;

    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Column = () => {
    const [data, setData] = useState<string[]>(['a', 'b', 'c']);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id);
    };
    const handleDragEnd = ({ over }: DragEndEvent) => {
        if (over && activeId) {
            const activeIndex = data.indexOf(activeId.toString());
            const overIndex = data.indexOf(over.id.toString());
            setData(arrayMove(data, activeIndex, overIndex));
        }
        setActiveId(null);
    };
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(touchSensor);

    return (
        <Container>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                <SortableContext items={data}>
                    {data.map((item) => (
                        <Item key={item} name={item} />
                    ))}
                </SortableContext>
            </DndContext>
        </Container>
    );
};

export default Column;
