import WebRTC from "../core";
import { getLocalAudio, getLocalDesktop, getLocalVideo } from "../utill/media";
import Event from "rx.mini";

type Get =
  | ReturnType<typeof getLocalAudio>
  | ReturnType<typeof getLocalDesktop>
  | ReturnType<typeof getLocalVideo>
  | undefined;

type Option = {
  immidiate: boolean;
  get: Get;
  stream: MediaStream;
  track: MediaStreamTrack;
  label: string;
};

export default class Stream {
  onStream = new Event<MediaStream>();
  onLocalStream = new Event<MediaStream>();

  label: string;
  initDone = false;

  constructor(private peer: WebRTC, private opt: Partial<Option> = {}) {
    this.label = opt.label || "stream";
    this.listen();
  }

  private async listen() {
    const label = "init_" + this.label;

    const { get, stream, immidiate, track } = this.opt;
    let localStream = stream;

    if (immidiate) {
      this.init({ stream: localStream, track });
    } else {
      if (get) {
        localStream = (await get.catch(console.log)) as MediaStream;
        this.onLocalStream.execute(localStream);
      }

      this.peer.onData.once(raw => {
        if (raw.label === label && raw.data === "done") {
          if (!get) {
            this.init({ stream: localStream, track });
          }
        }
      });

      this.peer.send("done", label);
    }
  }

  private async init(media: {
    stream?: MediaStream;
    track?: MediaStreamTrack;
  }) {
    const { stream, track } = media;

    if (this.initDone) return;
    this.initDone = true;

    const peer = this.peer;
    const newPeer = new WebRTC({ stream, track });
    if (peer.isOffer) {
      newPeer.makeOffer();
      newPeer.onSignal.once(sdp => {
        peer.send(JSON.stringify(sdp), this.label + "_offer");
      });
      peer.onData.once(raw => {
        const { label, data } = raw;
        if (label === this.label + "_answer" && typeof data === "string") {
          newPeer.setSdp(JSON.parse(data));
        }
      });
    } else {
      peer.onData.once(raw => {
        const { label, data } = raw;
        if (label === this.label + "_offer" && typeof data === "string") {
          newPeer.setSdp(JSON.parse(data));
          newPeer.onSignal.once(sdp => {
            peer.send(JSON.stringify(sdp), this.label + "_answer");
          });
        }
      });
    }
    newPeer.onAddTrack.once(stream => {
      this.onStream.execute(stream);
    });
  }
}
