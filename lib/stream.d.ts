import WebRTC from "./index";
export declare enum MediaType {
    video = 0,
    audio = 1
}
interface Option {
    stream?: MediaStream;
    type?: MediaType;
}
export default class Stream {
    onStream: (stream: MediaStream) => void;
    opt: Option;
    constructor(peer: WebRTC, opt?: Partial<Option>);
    private init;
}
export {};
