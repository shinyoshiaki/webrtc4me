import Event from "./utill/event";
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
export default class WebRTC {
    opt: Partial<option>;
    rtc: RTCPeerConnection;
    signal: (sdp: object) => void;
    connect: () => void;
    disconnect: () => void;
    onData: Event<message>;
    onAddTrack: Event<MediaStream>;
    private dataChannels;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    isOffer: boolean;
    isMadeAnswer: boolean;
    remoteStream: MediaStream | undefined;
    constructor(opt?: Partial<option>);
    private prepareNewConnection;
    hangUp(): void;
    makeOffer(): void;
    private setAnswer;
    private makeAnswer;
    setSdp(sdp: any): Promise<void>;
    private createDatachannel;
    private dataChannelEvents;
    send(data: any, label?: string): void;
    connecting(nodeId: string): void;
}
export {};
