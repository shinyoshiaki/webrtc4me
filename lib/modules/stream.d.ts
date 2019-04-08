import WebRTC from "../core";
import { getLocalAudio, getLocalDesktop, getLocalVideo } from "../utill/media";
declare type Get = ReturnType<typeof getLocalAudio> | ReturnType<typeof getLocalDesktop> | ReturnType<typeof getLocalVideo> | undefined;
export declare enum MediaType {
    video = 0,
    audio = 1
}
interface Option {
    get: Get;
    stream: MediaStream;
    label: string;
}
export default class Stream {
    private peer;
    private opt;
    onStream: (stream: MediaStream) => void;
    onLocalStream: (stream: MediaStream) => void;
    label: string;
    initDone: boolean;
    constructor(peer: WebRTC, opt?: Partial<Option>);
    private listen;
    private init;
}
export {};
