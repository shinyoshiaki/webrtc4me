import WebRTC from "./index";
export declare function getLocalStream(opt?: {
    width: number;
    height: number;
}): Promise<MediaStream>;
export default class Stream {
    peer: WebRTC;
    stream: (stream: MediaStream) => void;
    constructor(_peer: WebRTC, stream?: MediaStream);
    init(stream?: MediaStream): Promise<void>;
}
