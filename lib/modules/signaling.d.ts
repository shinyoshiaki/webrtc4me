import WebRTC from "../core";
import { Signal } from "..";
export default class Signaling extends WebRTC {
    offer(): {
        subscribe: (execute: (data: Signal) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => {
            unSubscribe: () => void;
        };
        once: (execute: (data: Signal) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => void;
        asPromise: (timelimit?: number | undefined) => Promise<Signal>;
    };
    answer(signal: Signal): {
        subscribe: (execute: (data: Signal) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => {
            unSubscribe: () => void;
        };
        once: (execute: (data: Signal) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => void;
        asPromise: (timelimit?: number | undefined) => Promise<Signal>;
    };
}
