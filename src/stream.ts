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
  onStream: (stream: MediaStream) => void;

  constructor(_peer: WebRTC, stream?: MediaStream) {
    this.peer = _peer;
    this.onStream = (stream: MediaStream) => {};
    this.init(stream);
  }

  private async init(stream?: MediaStream) {
    if (!stream) stream = await getLocalStream();
    let p: Peer.Instance;
    if (this.peer.isOffer) {
      p = new Peer({ initiator: true, stream });
      p.on("signal", data => {
        this.peer.send(JSON.stringify(data), "stream_offer");
      });
    } else {
      p = new Peer({ stream });
      p.on("signal", data => {
        this.peer.send(JSON.stringify(data), "stream_answer");
      });
    }
    this.peer.addOnData(data => {
      const sdp = JSON.parse(data.data);
      if (data.label === "stream_answer" || data.label === "stream_offer") {
        p.signal(sdp);
      }
    }, "stream");
    p.on("error", err => {
      console.log({ err });
    });
    p.on("stream", stream => {
      this.onStream(stream);
    });
    p.on("connect", () => {});
  }
}
