import WebRTC from "./index";
export declare function getLocalStream(opt?: {
    width: number;
    height: number;
}): Promise<MediaStream>;
export default class Stream {
    peer: WebRTC;
    constructor(_peer: WebRTC);
    addStream(stream?: MediaStream): Promise<void>;
}
