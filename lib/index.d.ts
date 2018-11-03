import { message } from "./interface";
import Stream from "./stream";
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
    dataChannels: any;
    nodeId: string;
    isConnected: boolean;
    isDisconnected: boolean;
    onicecandidate: boolean;
    stream?: MediaStream;
    streamManager: Stream;
    isOffer: boolean;
    constructor(opt?: {
        nodeId?: string;
        stream?: MediaStream;
    });
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
