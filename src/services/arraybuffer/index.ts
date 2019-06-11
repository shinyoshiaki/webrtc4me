import WebRTC from "../../core";

export default class ArrayBufferService {
  label = "w4me_file";
  private origin = "datachannel";

  private memory: ArrayBuffer[] = [];

  listen(peer: WebRTC) {
    peer.onData.subscribe(msg => {
      if (msg.label === this.label) {
        const data = msg.data;
        if (typeof data === "string") {
          const ab = mergeArraybuffer(this.memory);
          this.memory = [];
          peer.onData.execute({
            label: this.origin,
            data: ab,
            nodeId: peer.nodeId
          });
        } else {
          this.memory.push(data);
        }
      }
    });
  }

  async send(ab: ArrayBuffer, origin: string, rtc: RTCDataChannel) {
    this.origin = origin;
    const chunks = sliceArraybuffer(ab, 16000);
    for (let chunk of chunks) {
      await new Promise(r => setTimeout(r));
      rtc.send(chunk);
    }
    rtc.send("finish");
  }
}
