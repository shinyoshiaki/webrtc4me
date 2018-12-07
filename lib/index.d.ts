import { message } from "./interface";
interface option {
    disable_stun?: boolean;
    nodeId?: string;
}
export default class WebRTC {
    rtc: RTCPeerConnection;
    signal: (sdp: any) => void;
    connect: () => void;
    disconnect: () => void;
    private onData;
    private onAddTrack;
    events: {
        data: {
            [key: string]: (raw: message) => void;
        };
        track: {
            [key: string]: (stream: MediaStream) => void;
        };
    };
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
