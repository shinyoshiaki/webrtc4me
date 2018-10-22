import { message } from "./interface";
export default class WebRTC {
    rtc: RTCPeerConnection;
    signal: (sdp: any) => void;
    connect: () => void;
    disconnect: () => void;
    private data;
    events: {
        data: {
            [key: string]: (raw: message) => void;
        };
    };
    dataChannels: any;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    onicecandidate: boolean;
    constructor(nodeId?: string);
    private prepareNewConnection;
    makeOffer(opt?: {
        disable_stun?: boolean;
        nodeId?: string;
    }): void;
    private createDatachannel;
    private dataChannelEvents;
    setAnswer(sdp: any, nodeId?: string): void;
    makeAnswer(sdp: any, opt?: {
        disable_stun?: boolean;
        nodeId?: string;
    }): Promise<void>;
    send(data: any, label?: string): void;
    connecting(nodeId: string): void;
}
