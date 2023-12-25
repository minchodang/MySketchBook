import { Initializer, Store } from '@type/common/StoreType';

export const createStore = <State>(initialState: Initializer<State>): Store<State> => {
    let state = typeof initialState !== 'function' ? initialState : initialState();

    const callbacks = new Set<() => void>();
    const get = () => state;
    const set = (nextState: State | ((prev: State) => State)) => {
        state =
            typeof nextState === 'function'
                ? (nextState as (prev: State) => State)(state)
                : nextState;
        callbacks.forEach((callback) => callback());
        return state;
    };

    const subscribe = (callback: () => void) => {
        callbacks.add(callback);
        return () => {
            callbacks.delete(callback);
        };
    };

    return { get, set, subscribe };
};
