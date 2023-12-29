import { ChangeEvent, useEffect } from 'react';
import { useStoreSelector } from '@/hooks/useStoreSelector';
import { selectorStore } from '@/pages/store-test';

const textSelector = (state: ReturnType<typeof selectorStore.get>) => state.text;

export const TextEditor = () => {
    const text = useStoreSelector(selectorStore, textSelector);
    useEffect(() => {
        console.log('Text Rendered');
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        selectorStore.set((prev) => ({ ...prev, text: e.target.value }));
    };

    return (
        <>
            <h3>{text}</h3>
            <input value={text} onChange={handleChange} />
        </>
    );
};
