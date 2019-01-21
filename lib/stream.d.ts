import WebRTC from "./index";
export declare function getLocalStream(opt?: {
    width: number;
    height: number;
}): Promise<MediaStream>;
export default class Stream {
    peer: WebRTC;
    onStream: (stream: MediaStream) => void;
    constructor(_peer: WebRTC, stream?: MediaStream);
    private init;
}
