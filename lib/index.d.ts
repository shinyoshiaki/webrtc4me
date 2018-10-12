export default class WebRTC {
    rtc: RTCPeerConnection;
    signal: (sdp: any) => void;
    connect: () => void;
    data: (raw: any) => void;
    disconnect: () => void;
    dataChannels: any;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    onicecandidate: boolean;
    constructor(_nodeId: string);
    private prepareNewConnection;
    makeOffer(opt?: any): void;
    private createDatachannel;
    private dataChannelEvents;
    setAnswer(sdp: any): void;
    makeAnswer(sdp: any, opt?: {
        disable_stun: boolean;
    }): Promise<void>;
    send(data: any, label: string): void;
}
