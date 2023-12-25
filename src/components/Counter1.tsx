import { useStore } from '@/hooks/useStore';
import { counterStore } from '@/pages/store-test';

export const Counter1 = () => {
    const [state, setState] = useStore(counterStore);

    const handleClick = () => {
        setState((prev) => ({ count: prev.count + 1 }));
    };

    return (
        <>
            <h3>Counter1: {state.count}</h3>
            <button type="button" onClick={handleClick}>
                +
            </button>
        </>
    );
};
