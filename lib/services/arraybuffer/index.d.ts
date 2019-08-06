import WebRTC from "../../core";
export default class ArrayBufferService {
    private peer;
    private label;
    private memory;
    private onData;
    constructor(peer: WebRTC);
    listen: () => Promise<void>;
    send: (ab: ArrayBuffer, label: string) => Promise<void>;
    private job;
    private rpc;
    private createDC;
}
