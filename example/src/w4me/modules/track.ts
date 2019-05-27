require("babel-polyfill");

import WebRTC from "../core";
import Event from "../utill/event";

export enum MediaType {
  video,
  audio
}

export default class Stream {
  onStream = new Event<MediaStream>();

  constructor(
    private peer: WebRTC,
    private track: MediaStreamTrack,
    private stream: MediaStream
  ) {
    this.listen();
  }

  private async listen() {
    const label = "track";
    this.peer.onData.once(raw => {
      if (raw.label === label && raw.data === "done") {
        this.init();
      }
    });

    this.peer.send("done", label);
  }

  private async init() {
    this.peer.addTrack(this.track, this.stream);
  }
}
