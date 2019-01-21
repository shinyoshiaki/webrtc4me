import { message } from "./interface";
interface option {
    disable_stun?: boolean;
    nodeId?: string;
}
interface OnData {
    [key: string]: (raw: message) => void;
}
interface OnAddTrack {
    [key: string]: (stream: MediaStream) => void;
}
declare type Event = OnData | OnAddTrack;
export declare function excuteEvent(ev: Event, v?: any): void;
export declare function addEvent<T extends Event>(tag: string, event: T, func: T[keyof T]): void;
export default class WebRTC {
    rtc: RTCPeerConnection;
    signal: (sdp: any) => void;
    connect: () => void;
    disconnect: () => void;
    private onData;
    addOnData: (tag: string, func: (raw: message) => void) => void;
    private onAddTrack;
    addOnAddTrack: (tag: string, func: (stream: MediaStream) => void) => void;
    dataChannels: {
        [key: string]: RTCDataChannel;
    };
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    onicecandidate: boolean;
    stream?: MediaStream;
    isOffer: boolean;
    constructor(opt?: {
        nodeId?: string;
        stream?: MediaStream;
    });
    private prepareNewConnection;
    makeOffer(opt?: option): void;
    private createDatachannel;
    private dataChannelEvents;
    setAnswer(sdp: any, nodeId?: string): void;
    makeAnswer(sdp: any, opt?: option): Promise<void>;
    send(data: any, label?: string): void;
    connecting(nodeId: string): void;
}
export {};
