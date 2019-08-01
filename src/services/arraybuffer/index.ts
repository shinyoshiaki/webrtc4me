import WebRTC from "../../core";
import { mergeArraybuffer, sliceArraybuffer } from "../../utill/arraybuffer";
import { decode, encode } from "@msgpack/msgpack";

type State = {
  done: number[];
  index: number;
  length: number;
};
const initialState: State = {
  done: [],
  index: 0,
  length: 0
};

// TODO 再送制御

export default class ArrayBufferService {
  label = "w4me_file";
  private origin = "datachannel";

  private memory: { [index: number]: ArrayBuffer } = {};
  private state: State = initialState;
  private sleep = 100;

  listen(peer: WebRTC) {
    peer.onData.subscribe(({ data, label }) => {
      if (label === this.label) {
        if (typeof data === "string") {
          const { type, payload } = JSON.parse(data);
          console.log({ type, payload });
          if (type === "start") {
            this.state.length = payload;
          } else if (type === "end") {
            const missing = [...Array(this.state.length)].reduce(
              (arr, _, i) => {
                if (!this.state.done.includes(i)) arr.push(i);
                return arr;
              },
              [] as number[]
            );
            console.log({ missing });
            if (missing.length === 0) {
              const ab = mergeArraybuffer(Object.values(this.memory));
              peer.onData.execute({
                label: payload,
                data: ab,
                nodeId: peer.nodeId
              });
              peer.send(JSON.stringify({ type: "done", payload: "" }));
              this.memory = [];
            } else {
              console.error("fail", this.state, Object.values(this.memory));
              peer.send(
                JSON.stringify({
                  type: "missing",
                  payload: missing
                })
              );
            }
            this.state = initialState;
          }
        } else {
          const { i, v } = decode(data) as { i: number; v: Uint8Array };
          this.state.done.push(i);
          this.memory[i] = v;
        }
      }
    });
  }

  // TODO test on kad
  send = async (
    ab: ArrayBuffer,
    origin: string,
    dc: RTCDataChannel,
    peer: WebRTC
  ) => {
    this.origin = origin;
    const chunks = sliceArraybuffer(ab, 64 * 1000);
    console.log({ ab, chunks });

    const { unSubscribe } = peer.onData.subscribe(async ({ label, data }) => {
      console.log("reply", { label, data });
      const { type, payload } = JSON.parse(data as string) as {
        type: string;
        payload: number[];
      };
      if (type === "missing") {
        if (dc.readyState === "closed" || dc.readyState === "closing") {
          dc = await this.makeDC(peer.rtc);
        }

        const missingChunks = payload.reduce(
          (obj, index) => {
            obj[index] = chunks[index];
            return obj;
          },
          {} as {
            [index: number]: ArrayBuffer;
          }
        );

        await this.sendQuick(missingChunks, dc, peer.rtc);

        dc.send(JSON.stringify({ type: "end", payload: origin }));
      }
      if (type === "done") unSubscribe();
    });

    dc.send(JSON.stringify({ type: "start", payload: chunks.length }));
    await new Promise(r => setTimeout(r));
    await this.sendQuick({ ...chunks }, dc, peer.rtc);
    const res = await this.safeDC(dc, peer.rtc);
    if (res) dc = res;
    dc.send(JSON.stringify({ type: "end", payload: origin }));
  };

  private async sendQuick(
    chunks: { [index: number]: ArrayBuffer },
    dc: RTCDataChannel,
    pc: RTCPeerConnection
  ) {
    let i = 0;
    for (let index of Object.keys(chunks).map(v => Number(v))) {
      if (dc.readyState === "open") {
        try {
          const chunk = chunks[index];
          dc.send(encode({ i: index, v: new Uint8Array(chunk) }));
          if (i % this.sleep === 0) await new Promise(r => setTimeout(r, 150));
          i++;
        } catch (error) {
          console.log({ error });
          this.sleep = parseInt(`${this.sleep / 2}`);
          await new Promise(r => setTimeout(r, 150));
        }
      } else if (dc.readyState === "closed") {
        dc = await this.makeDC(pc);
      }
    }
  }

  private async safeDC(dc: RTCDataChannel, pc: RTCPeerConnection) {
    if (dc.readyState === "closed" || dc.readyState === "closing") {
      return await this.makeDC(pc);
    }
  }

  private async makeDC(pc: RTCPeerConnection) {
    const dc = pc.createDataChannel(this.label);
    await new Promise(resolve => {
      dc.onopen = () => {
        resolve();
      };
    });
    return dc;
  }
}
