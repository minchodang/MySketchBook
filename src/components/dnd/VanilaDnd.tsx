import React, { useRef, useState } from 'react';

const VanilaDnd = () => {
    const dragItem = useRef<number | null>(null); // Specify the type for dragItem
    const dragOverItem = useRef<number | null>(null); // Specify the type for dragOverItem
    const [list, setList] = useState<string[]>([
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
    ]);

    const dragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
        console.log((e.target as HTMLDivElement).innerHTML);
    };

    const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
        console.log((e.target as HTMLDivElement).innerHTML);
    };

    const drop = (e: React.DragEvent<HTMLDivElement>) => {
        const copyListItems = [...list];
        const dragItemContent = copyListItems[dragItem.current as number];
        copyListItems.splice(dragItem.current as number, 1);
        copyListItems.splice(dragOverItem.current as number, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setList(copyListItems);
    };

    return (
        list &&
        list.map((item, index) => (
            <div
                key={item}
                draggable
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                onDragOver={(e) => e.preventDefault()}
            >
                {item}
            </div>
        ))
    );
};

export default VanilaDnd;
