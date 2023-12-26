export type Initializer<T> = T extends any ? T | ((prev: T) => T) : never;

export type Store<State> = {
    get: () => State;
    set: (action: Initializer<State>) => State;
    subscribe: (callback: () => void) => () => void;
};
