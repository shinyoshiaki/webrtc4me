/// <reference types="node" />
export declare type Message = {
    label: string | "datachannel";
    data: string | ArrayBuffer;
    nodeId: string;
};
export declare type Signal = {
    type: "candidate" | "offer" | "answer" | "pranswer" | "rollback";
    ice?: RTCIceCandidateInit;
    sdp?: string;
};
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
    onConnect: import("rx.mini").default<undefined>;
    onDisconnect: import("rx.mini").default<undefined>;
    onData: import("rx.mini").default<Message>;
    onAddTrack: import("rx.mini").default<MediaStream>;
    onOpenDC: import("rx.mini").default<RTCDataChannel>;
    private wait4DC;
    private dataChannels;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    isOffer: boolean;
    isNegotiating: boolean;
    remoteStream: MediaStream | undefined;
    private timeoutPing;
    private arrayBufferService;
    constructor(opt?: Partial<Option>);
    private prepareNewConnection;
    hangUp(): void;
    makeOffer(): void;
    private updateNegotiation;
    private setAnswer;
    private makeAnswer;
    setSdp(sdp: Signal): Promise<void>;
    private isDCOpend;
    private createDatachannel;
    private dataChannelEvents;
    send(data: string | ArrayBuffer | Buffer, label?: string): Promise<void>;
    sendJson(payload: object, label?: string): Promise<string | undefined>;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    private disconnect;
}
export {};
