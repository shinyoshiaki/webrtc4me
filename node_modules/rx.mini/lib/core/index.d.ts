declare type EventExecute<T> = (data: T) => void;
declare type EventComplete = () => void;
declare type EventError = (e: any) => void;
export default class Event<T = null> {
    private event;
    execute: (data: T) => void;
    complete: () => void;
    error: (e: any) => void;
    allUnsubscribe: () => void;
    subscribe: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => {
        unSubscribe: () => void;
    };
    once: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => void;
    asPromise: (timelimit?: number | undefined) => Promise<T>;
    readonly returnTrigger: {
        execute: (data: T) => void;
        error: (e: any) => void;
        complete: () => void;
    };
    readonly returnListener: {
        subscribe: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => {
            unSubscribe: () => void;
        };
        once: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => void;
        asPromise: (timelimit?: number | undefined) => Promise<T>;
    };
    readonly length: number;
}
export {};
