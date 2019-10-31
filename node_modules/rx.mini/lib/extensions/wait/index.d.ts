import Event from "../../";
export default class Wait<T> {
    private candidates;
    constructor();
    private exist;
    delete(kid: string): void;
    create(id: string, job: () => Promise<T>): Promise<{
        exist: Event<T>;
        result?: undefined;
    } | {
        result: T;
        exist?: undefined;
    }>;
}
