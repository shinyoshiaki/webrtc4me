/// <reference types="node" />
declare type Option = {
    disable_stun: boolean;
    stream: MediaStream;
    track: MediaStreamTrack;
    nodeId: string;
    trickle: boolean;
    wrtc: any;
};
export default class WebRTC {
    opt: Partial<Option>;
    rtc: RTCPeerConnection;
    private pack;
    private event;
    onSignal: import("rx.mini").default<Signal>;
    onConnect: import("rx.mini").default<unknown>;
    onDisconnect: import("rx.mini").default<unknown>;
    onData: import("rx.mini").default<Message>;
    onAddTrack: import("rx.mini").default<MediaStream>;
    onOpenDC: import("rx.mini").default<RTCDataChannel>;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    isOffer: boolean;
    isNegotiating: boolean;
    remoteStream?: MediaStream;
    private timeoutPing?;
    private arrayBufferService;
    private dataChannelService;
    constructor(opt?: Partial<Option>);
    private prepareNewConnection;
    makeOffer(): void;
    private updateNegotiation;
    private setAnswer;
    private makeAnswer;
    setSdp(sdp: Signal): Promise<void>;
    onMessage: (data: any, channel: RTCDataChannel) => Promise<void>;
    send(data: string | ArrayBuffer | Buffer, label?: string): Promise<void>;
    sendJson(payload: object, label?: string): Promise<void>;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    addStream(stream: MediaStream): void;
    hangUp(): Promise<void>;
}
declare type DataType = "string" | "ArrayBuffer" | "object";
export declare type Message = {
    label: string | "datachannel";
    data: string | ArrayBuffer | object;
    dataType: DataType;
    nodeId: string;
};
export declare type Signal = {
    type: "candidate" | "offer" | "answer" | "pranswer" | "rollback";
    ice?: RTCIceCandidateInit;
    sdp?: string;
};
export {};
