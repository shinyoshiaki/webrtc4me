import Event from "../../core";
export declare function Buffer<T>(length: number, event: Event<T>): {
    subscribe: (execute: (data: T) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => {
        unSubscribe: () => void;
    };
    asPromise: (timelimit?: number | undefined) => Promise<T>;
    once: (execute: (data: T) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => void;
};
