import WebRTC from "../core";
import { blob2Arraybuffer } from "../utill/arraybuffer";

export default class SendFile {
  private label = "file_quick";
  private blob?: Blob;

  constructor(private peer: WebRTC) {
    const { unSubscribe } = peer.onData.subscribe(({ label, data }) => {
      if (label === this.label) {
        if (typeof data === "string") {
          if (this.blob) {
            const url = window.URL.createObjectURL(this.blob);
            const anchor = document.createElement("a");
            anchor.download = data;
            anchor.href = url;
            anchor.click();
          }
        } else {
          this.blob = new Blob([data]);
          peer.send("ready", this.label);
        }
      }
    });
    peer.onDisconnect.once(unSubscribe);
  }

  async send(file: File) {
    const ab = await blob2Arraybuffer(file);
    this.peer.send(ab, this.label);
    await new Promise(r => {
      const { unSubscribe } = this.peer.onData.subscribe(({ data, label }) => {
        if (label === this.label) {
          if (data === "ready") {
            unSubscribe();
            r();
          }
        }
      });
    });
    this.peer.send(file.name, this.label);
  }
}
