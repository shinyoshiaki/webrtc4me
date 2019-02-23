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
    rtc: RTCPeerConnection;
    signal: (sdp: object) => void;
    connect: () => void;
    disconnect: () => void;
    private subjOnData;
    onData: import("rxjs").Observable<message>;
    private subjOnAddTrack;
    onAddTrack: import("rxjs").Observable<MediaStream>;
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
