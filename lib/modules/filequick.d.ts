import WebRTC from "../core";
export default class SendFile {
    private peer;
    private label;
    private blob?;
    constructor(peer: WebRTC);
    send(file: File): Promise<void>;
}
