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
    this.init(stream);
  }

  async init(stream?: MediaStream) {
    if (!stream) stream = await getLocalStream();
    console.log("w4me stream", { stream });
    let p: Peer.Instance;
    if (this.peer.isOffer) {
      console.log("w4me stream isoffer");
      p = new Peer({ initiator: true, stream });
      p.on("signal", data => {
        console.log("w4me stream offer signal", { data });
        this.peer.send(JSON.stringify(data), "stream_offer");
      });
    } else {
      console.log("w4me stream isAnswer");
      p = new Peer({ stream });
      p.on("signal", data => {
        console.log("w4me stream answer signal", { data });
        this.peer.send(JSON.stringify(data), "stream_answer");
      });
    }
    this.peer.addOnData(data => {
      console.log("w4me stream ondata", { data });
      const sdp = JSON.parse(data.data);
      if (data.label === "stream_answer" || data.label === "stream_offer") {
        console.log("w4me stream signal", { sdp });
        p.signal(sdp);
      }
    }, "stream");
    p.on("error", err => {
      console.log({ err });
    });
    p.on("stream", stream => {
      console.log("w4me stream stream", { stream });
      this.stream(stream);
    });
    p.on("connect", () => {
      console.log("w4me connected");
    });
  }
}
