require("babel-polyfill");

import WebRTC from "./index";
import { getLocalVideo, getLocalAudio } from "./utill";

export enum MediaType {
  video,
  audio
}

interface Option {
  stream?: MediaStream;
  type?: MediaType;
}

export default class Stream {
  onStream: (stream: MediaStream) => void;
  opt: Option;
  constructor(peer: WebRTC, opt: Partial<Option> = {}) {
    this.onStream = _ => {};
    this.opt = opt;
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
      setTimeout(() => {
        rtc.makeOffer();
        rtc.signal = sdp => {
          peer.send(JSON.stringify(sdp), "test_offer");
        };
        peer.addOnData(raw => {
          if (raw.label === "test_answer") {
            rtc.setAnswer(JSON.parse(raw.data));
          }
        });
      }, 500);
    } else {
      peer.addOnData(raw => {
        if (raw.label === "test_offer") {
          rtc.makeAnswer(JSON.parse(raw.data));
          rtc.signal = sdp => {
            peer.send(JSON.stringify(sdp), "test_answer");
          };
        }
      });
    }
    rtc.addOnAddTrack(stream => {
      console.log({ stream });
      this.onStream(stream);
    });
  }
}
