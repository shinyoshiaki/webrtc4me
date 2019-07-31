import WebRTC from "../../core";
import { mergeArraybuffer, sliceArraybuffer } from "../../utill/arraybuffer";

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
          console.log("finish", this.memory, msg.data);
          peer.onData.execute({
            label: data,
            data: ab,
            nodeId: peer.nodeId
          });
          this.memory = [];
        } else {
          this.memory.push(data);
        }
      }
    });
  }

  // TODO test on kad
  send = async (
    ab: ArrayBuffer,
    origin: string,
    dc: RTCDataChannel,
    pc: RTCPeerConnection
  ) => {
    this.origin = origin;
    const chunks = sliceArraybuffer(ab, 16 * 1000);
    for (let i = 0; i < chunks.length; ) {
      if (dc.readyState === "open") {
        try {
          const chunk = chunks[i];
          dc.send(chunk);
          i++;
        } catch (error) {
          await new Promise(r => setTimeout(r, 0));
        }
      } else if (dc.readyState === "closed") {
        const make = pc.createDataChannel(this.label);
        await new Promise(resolve => {
          make.onopen = () => {
            resolve();
          };
        });
        dc = make;
      }
    }
    dc.send(origin);
  };
}
