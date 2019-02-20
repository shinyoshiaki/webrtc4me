require("babel-polyfill");

import WebRTC from "./";
import { getLocalAudio, getLocalDesktop, getLocalVideo } from "./utill";

type Get =
  | ReturnType<typeof getLocalAudio>
  | ReturnType<typeof getLocalDesktop>
  | ReturnType<typeof getLocalVideo>
  | undefined;

export enum MediaType {
  video,
  audio
}

interface Option {
  get: Get;
  label: string;
}

export default class Stream {
  onStream: (stream: MediaStream) => void;
  label: string;

  constructor(private peer: WebRTC, private opt: Partial<Option> = {}) {
    this.onStream = _ => {};
    this.label = opt.label || "stream";
    this.listen();
  }

  private async listen() {
    const label = "init_" + this.label;
    let stream: MediaStream | undefined;
    let done = false;
    this.peer.addOnData(raw => {
      if (raw.label === label && raw.data === "done") {
        done = true;
        if (stream) {
          console.log("start streaming");
          this.init(stream);
        }
      }
    }, label);
    if (this.opt.get) {
      stream = (await this.opt.get.catch(console.log)) as any;
    }
    if (done) {
      this.init(stream);
    }
    if (stream) {
      console.log("send done");
      this.peer.send("done", label);
    }
  }

  private async init(stream: MediaStream | undefined) {
    const peer = this.peer;
    const rtc = new WebRTC({ stream });
    if (peer.isOffer) {
      rtc.makeOffer();
      rtc.signal = sdp => {
        peer.send(JSON.stringify(sdp), this.label + "_offer");
      };
      peer.addOnData(raw => {
        if (raw.label === this.label + "_answer") {
          rtc.setSdp(JSON.parse(raw.data));
        }
      }, this.label);
    } else {
      peer.addOnData(raw => {
        console.log("label", this.label);
        if (raw.label === this.label + "_offer") {
          rtc.setSdp(JSON.parse(raw.data));
          rtc.signal = sdp => {
            peer.send(JSON.stringify(sdp), this.label + "_answer");
          };
        }
      }, this.label);
    }
    rtc.addOnAddTrack(stream => {
      console.log({ stream });
      this.onStream(stream);
    });
  }
}
