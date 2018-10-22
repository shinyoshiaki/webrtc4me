import WebRTC from "./index";
import { message } from "./interface";

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

  constructor(_peer: WebRTC) {
    this.peer = _peer;

    this.peer.events.data["stream.ts"] = async (msg: message) => {
      const pc = this.peer.rtc;
      if (msg.label === "sdp") {
        const sdp: RTCSessionDescription = msg.data;
        if (sdp.type === "offer") {
          await pc.setRemoteDescription(sdp).catch(console.log);
          const answer = await pc.createAnswer();
          if (answer) {
            await pc.setLocalDescription(answer).catch(console.log);
            this.peer.send(pc.localDescription, "sdp");
          }
        } else if (sdp.type === "answer") {
          await pc.setRemoteDescription(sdp).catch(console.log);
        }
      }
    };
  }

  async addStream(stream?: MediaStream) {
    stream = stream || (await getLocalStream());
    const track = stream.getVideoTracks()[0];
    const pc = this.peer.rtc;
    const sender = pc.addTrack(track, stream);
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer().catch(console.log);
      if (offer) {
        await pc.setLocalDescription(offer).catch(console.log);
        this.peer.send(pc.localDescription, "sdp");
      }
    };
  }
}
