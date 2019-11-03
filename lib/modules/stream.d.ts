import WebRTC from "../core";
import { getLocalAudio, getLocalDesktop, getLocalVideo } from "../utill/media";
import Event from "rx.mini";
declare type Get = ReturnType<typeof getLocalAudio> | ReturnType<typeof getLocalDesktop> | ReturnType<typeof getLocalVideo> | undefined;
declare type Option = {
    immidiate: boolean;
    get: Get;
    stream: MediaStream;
    track: MediaStreamTrack;
    label: string;
};
export default class Stream {
    private peer;
    private opt;
    onStream: Event<MediaStream>;
    onLocalStream: Event<MediaStream>;
    label: string;
    initDone: boolean;
    constructor(peer: WebRTC, opt?: Partial<Option>);
    private listen;
    private init;
}
export {};
