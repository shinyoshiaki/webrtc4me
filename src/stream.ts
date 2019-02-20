require("babel-polyfill");

import WebRTC from "./index";
import { getLocalVideo, getLocalAudio } from "./utill";

export enum MediaType {
  video,
  audio
}

interface Option {
  stream: MediaStream;
  type: MediaType;
  label: string;
}

export default class Stream {
  onStream: (stream: MediaStream) => void;
  opt: Partial<Option>;
  label: string;
  constructor(peer: WebRTC, opt: Partial<Option> = {}) {
    this.onStream = _ => {};
    this.opt = opt;
    this.label = opt.label || "stream";
    this.init(peer);
  }

  private async init(peer: WebRTC) {
    const stream: MediaStream =
      this.opt.stream ||
      (await (async () => {
        if (this.opt.type && (this.opt.type as MediaType) == MediaType.video) {
          return await getLocalVideo();
        } else {
          return await getLocalAudio();
        }
      })());

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
      }, this.label); //送信側受信側のdcチャネルを同期
    } else {
      peer.addOnData(raw => {
        console.log("label", this.label);
        if (raw.label === this.label + "_offer") {
          rtc.setSdp(JSON.parse(raw.data));
          rtc.signal = sdp => {
            peer.send(JSON.stringify(sdp), this.label + "_answer");
          };
        }
      }, this.label);　//送信側受信側のdcチャネルを同期
    }
    rtc.addOnAddTrack(stream => {
      console.log({ stream });
      this.onStream(stream);
    });
  }
}
