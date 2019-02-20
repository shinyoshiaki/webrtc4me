import WebRTC from "./index";
export declare enum MediaType {
    video = 0,
    audio = 1
}
interface Option {
    stream: MediaStream;
    type: MediaType;
    label: string;
}
export default class Stream {
    onStream: (stream: MediaStream) => void;
    opt: Partial<Option>;
    label: string;
    constructor(peer: WebRTC, opt?: Partial<Option>);
    private init;
}
export {};
