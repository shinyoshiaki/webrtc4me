export interface message {
    label: string;
    data: any;
    nodeId: string;
}
interface option {
    disable_stun: boolean;
    stream: MediaStream;
    nodeId: string;
    trickle: boolean;
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
    signal: (sdp: object) => void;
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
    isOffer: boolean;
    isMadeAnswer: boolean;
    negotiating: boolean;
    opt: Partial<option>;
    constructor(opt?: Partial<option>);
    private prepareNewConnection;
    private hangUp;
    makeOffer(): void;
    private createDatachannel;
    private dataChannelEvents;
    private addStream;
    private setAnswer;
    private makeAnswer;
    setSdp(sdp: any): void;
    send(data: any, label?: string): void;
    connecting(nodeId: string): void;
}
export {};
