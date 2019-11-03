import Event from "rx.mini";
export declare class DataChannelService {
    private pc;
    private pack;
    private event;
    onMessage: Event<{
        channel: RTCDataChannel;
        data: any;
    }>;
    onOpenDC: Event<RTCDataChannel>;
    dataChannels: {
        [label: string]: RTCDataChannel;
    };
    private creatingChannel;
    constructor(pc: RTCPeerConnection);
    private channelEvents;
    create(label: string): Promise<RTCDataChannel>;
    send(data: any, label: string): void;
    dispose(): void;
}
