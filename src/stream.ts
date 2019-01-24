require("babel-polyfill");
import WebRTC from "./index";
import Peer from "simple-peer";

export function getLocalVideo(opt?: { width: number; height: number }) {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (!opt) opt = { width: 1280, height: 720 };
    navigator.mediaDevices
      .getUserMedia({ video: { width: opt.width, height: opt.height } })
      .then(stream => {
        resolve(stream);
      });
  });
}
export function getLocalAudio(opt?: { width: number; height: number }) {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (!opt) opt = { width: 1280, height: 720 };
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        resolve(stream);
      });
  });
}

export enum MediaType {
  video,
  audio
}

enum Label {
  offer = "stream_offer",
  answer = "stream_answer"
}

export default class Stream {
  onStream: (stream: MediaStream) => void;

  constructor(peer: WebRTC, opt?: { stream?: MediaStream; type?: MediaType }) {
    opt = opt || {};
    this.onStream = _ => {};
    this.init(peer, opt.stream, opt.type);
  }

  private async init(peer: WebRTC, _stream?: MediaStream, type?: MediaType) {
    const stream: MediaStream =
      _stream ||
      (await (async () => {
        if (type && (type as MediaType) == MediaType.video) {
          return await getLocalVideo();
        } else {
          return await getLocalAudio();
        }
      })());

    let p: Peer.Instance;
    if (peer.isOffer) {
      p = new Peer({ initiator: true, stream });
      p.on("signal", sdp => {
        peer.send(JSON.stringify(sdp), Label.offer);
      });
    } else {
      p = new Peer({ stream });
      p.on("signal", sdp => {
        peer.send(JSON.stringify(sdp), Label.answer);
      });
    }
    peer.addOnData(raw => {
      const sdp = JSON.parse(raw.data);
      if (raw.label === Label.answer || raw.label === Label.offer) {
        console.log("signal", { sdp });
        p.signal(sdp);
      }
    }, "stream");
    p.on("error", err => {
      console.log({ err });
    });
    p.on("stream", stream => {
      this.onStream(stream);
    });
    p.on("connect", () => {
      console.log("simple-peer");
    });
  }
}
