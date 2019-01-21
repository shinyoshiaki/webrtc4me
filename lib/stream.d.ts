import WebRTC from "./index";
export declare function getLocalVideo(opt?: {
    width: number;
    height: number;
}): Promise<MediaStream>;
export declare function getLocalAudio(opt?: {
    width: number;
    height: number;
}): Promise<MediaStream>;
export declare enum MediaType {
    video = 0,
    audio = 1
}
export default class Stream {
    onStream: (stream: MediaStream) => void;
    constructor(peer: WebRTC, opt?: {
        stream?: MediaStream;
        type?: MediaType;
    });
    private init;
}
