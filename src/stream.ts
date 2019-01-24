require("babel-polyfill");
import WebRTC from "./index";

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

    const track = stream.getVideoTracks()[0];
    peer.rtc.addTrack(track, stream);
    peer.rtc.ontrack = event => {
      const stream = event.streams[0];
      this.onStream(stream);
    };
  }
}
