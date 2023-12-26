import { useCallback, useEffect } from 'react';
import { useStoreSelector } from '@/hooks/useStoreSelector';
import { selectorStore } from '@/pages/store-test';

export const Counter1 = () => {
    const counter = useStoreSelector(
        selectorStore,
        useCallback((state) => state.count, []),
    );

    const handleClick = () => {
        selectorStore.set((prev) => ({ ...prev, count: prev.count + 1 }));
    };

    useEffect(() => {
        console.log('Counter Rendered');
    });

    return (
        <>
            <h3>{counter}</h3>
            <button type="button" onClick={handleClick}>
                +
            </button>
        </>
    );
};
