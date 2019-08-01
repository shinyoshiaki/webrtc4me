import WebRTC from "../../core";
import { sliceArraybuffer, mergeArraybuffer } from "../../utill/arraybuffer";
import Event from "rx.mini";

export default class ArrayBufferService {
  private label = "wrtc4me_abservice";

  private memory: ArrayBuffer[] = [];

  private onData = new Event<MessageEvent>();

  constructor(private peer: WebRTC) {
    this.listen();
  }

  listen = async () => {
    const { peer } = this;

    await peer.onConnect.asPromise();

    peer.onOpenDC.subscribe(dc => {
      if (dc.label === this.label) {
        dc.onmessage = this.onData.execute;
      }
    });

    this.onData.subscribe(ev => {
      const { data } = ev;
      if (typeof data === "string") {
        const { type, payload } = JSON.parse(data);
        switch (type) {
          case "end": {
            const ab = mergeArraybuffer(Object.values(this.memory));
            peer.onData.execute({
              label: payload,
              data: ab,
              nodeId: peer.nodeId
            });
            this.memory = [];
          }
        }
      } else {
        this.memory.push(data);
      }
    });
  };

  send = async (ab: ArrayBuffer, label: string) => {
    const dc = await this.createDC();

    const chunks = sliceArraybuffer(ab, 16 * 1000);

    await this.job(chunks, dc);

    this.rpc({ type: "end", payload: label }, dc);
  };

  private job = async (chunks: ArrayBuffer[], dc: RTCDataChannel) => {
    for (let i = 0; i < chunks.length; ) {
      if (dc.bufferedAmount > 1024 * 1000) {
        await new Promise(r => setTimeout(r));
        continue;
      }
      const chunk = chunks[i];
      console.log({ i }, chunk);
      try {
        dc.send(chunk);
        i++;
      } catch (error) {
        console.log({ error });
      }
    }
  };

  private rpc = async (
    msg: { type: string; payload: any },
    dc: RTCDataChannel
  ) => {
    try {
      dc.send(JSON.stringify(msg));
    } catch (error) {
      console.log({ error });
    }
  };

  private createDC = async () => {
    const dc = this.peer.rtc.createDataChannel(this.label);
    await new Promise(r => (dc.onopen = () => r()));
    return dc;
  };
}
