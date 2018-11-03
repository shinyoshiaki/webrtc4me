require("babel-polyfill");
import WebRTC from "./index";
import Peer from "simple-peer";

export function getLocalStream(opt?: { width: number; height: number }) {
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

export default class Stream {
  peer: WebRTC;
  stream: (stream: MediaStream) => void;

  constructor(_peer: WebRTC, stream?: MediaStream) {
    this.peer = _peer;
    this.stream = (stream: MediaStream) => {};
    (async () => {
      if (!stream) stream = await getLocalStream();
    })();

    let p: Peer.Instance;
    if (this.peer.isOffer) {
      p = new Peer({ initiator: true, stream, trickle: false });
      p.on("signal", data => {
        this.peer.send(data, "stream_offer");
      });
    } else {
      p = new Peer({ stream, trickle: false });
      p.on("signal", data => {
        this.peer.send(data, "stream_answer");
      });
    }
    this.peer.events.data["stream.ts"] = data => {
      if (data.label === "stream_answer") {
        p.signal(data.data);
      } else if (data.label === "stream_offer") {
        p.signal(data.data);
      }
    };

    p.on("stream", stream => {
      this.stream(stream);
    });
  }
}
