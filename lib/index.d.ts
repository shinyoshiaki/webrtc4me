export interface message {
    label: string;
    data: any;
    nodeId: string;
}
interface option {
    disable_stun?: boolean;
    nodeId?: string;
}
export interface OnData {
    [key: string]: (raw: message) => void;
}
interface OnAddTrack {
    [key: string]: (stream: MediaStream) => void;
}
declare type Event = OnData | OnAddTrack;
export declare function excuteEvent(ev: Event, v?: any): void;
export declare function addEvent<T extends Event>(event: T, func: T[keyof T], _tag?: string): void;
export default class WebRTC {
    rtc: RTCPeerConnection;
    signal: (sdp: any) => void;
    connect: () => void;
    disconnect: () => void;
    private onData;
    addOnData: (func: (raw: message) => void, tag?: string | undefined) => void;
    private onAddTrack;
    addOnAddTrack: (func: (stream: MediaStream) => void, tag?: string | undefined) => void;
    private dataChannels;
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
    negotiating: boolean;
    makeOffer(opt?: option): void;
    private createDatachannel;
    private dataChannelEvents;
    setAnswer(sdp: any, nodeId?: string): void;
    makeAnswer(sdp: any, opt?: option): Promise<void>;
    send(data: any, label?: string): void;
    connecting(nodeId: string): void;
}
export {};
