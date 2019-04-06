declare type EventFunc<T> = (data: T, id: number) => void;
interface IEvent<T> {
    stack: {
        func: EventFunc<T>;
        id: number;
    }[];
    index: number;
}
export default class Event<T> {
    event: IEvent<T>;
    constructor();
    excute(data: T): void;
    subscribe(func: EventFunc<T>): {
        unSubscribe: () => void;
    };
}
export {};
