import WebRTC from "../core";
import Event from "rx.mini";
declare const Downloading: (now: number, size: number) => {
    type: "downloading";
    payload: {
        now: number;
        size: number;
    };
};
declare const Downloaded: (chunks: ArrayBuffer[], name: string) => {
    type: "downloaded";
    payload: {
        chunks: ArrayBuffer[];
        name: string;
    };
};
declare type Actions = ReturnType<typeof Downloading> | ReturnType<typeof Downloaded>;
export declare function getSliceArrayBuffer(blob: Blob): Event<ArrayBuffer>;
export default class FileShare {
    private peer;
    private label?;
    private chunks;
    private name;
    private size;
    event: Event<Actions>;
    constructor(peer: WebRTC, label?: string | undefined);
    private sendStart;
    private sendChunk;
    private sendEnd;
    send(blob: File): void;
}
export {};