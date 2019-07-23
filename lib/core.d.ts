/// <reference types="node" />
export declare type Message = {
    label: string | "datachannel";
    data: string | ArrayBuffer;
    nodeId: string;
};
export declare type Signal = RTCSessionDescription | {
    type: "candidate";
    ice: RTCIceCandidateInit;
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
    onConnect: import("rx.mini").default<unknown>;
    onDisconnect: import("rx.mini").default<unknown>;
    onData: import("rx.mini").default<Message>;
    onAddTrack: import("rx.mini").default<MediaStream>;
    private wait4DC;
    private dataChannels;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    isOffer: boolean;
    isNegotiating: boolean;
    remoteStream: MediaStream | undefined;
    timeoutPing: any | undefined;
    services: import("./services").Services;
    constructor(opt?: Partial<Option>);
    private prepareNewConnection;
    hangUp(): void;
    makeOffer(): void;
    private negotiationSetting;
    private setAnswer;
    private makeAnswer;
    setSdp(sdp: Signal): Promise<void>;
    private isDCOpend;
    private createDatachannel;
    private dataChannelEvents;
    send(data: string | ArrayBuffer | Buffer, label?: string): Promise<void>;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    private disconnect;
}
export {};
