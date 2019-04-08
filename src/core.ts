require("babel-polyfill");
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from "wrtc";
import Event from "./utill/event";

export interface message {
  label: string;
  data: any;
  nodeId: string;
}

interface option {
  disable_stun: boolean;
  stream: MediaStream;
  nodeId: string;
  trickle: boolean;
}

export default class WebRTC {
  rtc: RTCPeerConnection;

  signal: (sdp: object) => void;
  connect: () => void;
  disconnect: () => void;
  onData = new Event<message>();
  onAddTrack = new Event<MediaStream>();

  private dataChannels: { [key: string]: RTCDataChannel };

  nodeId: string;
  isConnected = false;
  isDisconnected = false;
  isOffer = false;
  isMadeAnswer = false;

  remoteStream: MediaStream | undefined;

  constructor(public opt: Partial<option> = {}) {
    this.dataChannels = {};
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = () => {};
    this.disconnect = () => {};
    this.signal = _ => {};

    this.rtc = this.prepareNewConnection();

    if (opt.stream) {
      const stream = opt.stream;
      stream.getTracks().forEach(track => this.rtc.addTrack(track, stream));
    }
  }

  private prepareNewConnection() {
    const { disable_stun, trickle } = this.opt;

    const peer: RTCPeerConnection = disable_stun
      ? new RTCPeerConnection({
          iceServers: []
        })
      : new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302"
            }
          ]
        });

    peer.ontrack = evt => {
      const stream = evt.streams[0];
      this.onAddTrack.excute(stream);
      this.remoteStream = stream;
    };

    peer.oniceconnectionstatechange = () => {
      switch (peer.iceConnectionState) {
        case "failed":
          this.hangUp();
          break;
        case "disconnected":
          this.hangUp();
          break;
        case "connected":
          break;
        case "closed":
          break;
        case "completed":
          break;
      }
    };

    peer.onicecandidate = evt => {
      if (evt.candidate) {
        if (trickle) {
          this.signal({ type: "candidate", ice: evt.candidate });
        }
      } else {
        if (!trickle && peer.localDescription) {
          this.signal(peer.localDescription);
        }
      }
    };

    peer.ondatachannel = evt => {
      const dataChannel = evt.channel;
      this.dataChannels[dataChannel.label] = dataChannel;
      this.dataChannelEvents(dataChannel);
    };

    peer.onsignalingstatechange = e => {};

    return peer;
  }

  hangUp() {
    this.isDisconnected = true;
    this.isConnected = false;
    this.disconnect();
  }

  makeOffer() {
    this.isOffer = true;
    const { trickle } = this.opt;
    this.createDatachannel("datachannel");

    this.rtc.onnegotiationneeded = async () => {
      const sdp = await this.rtc.createOffer().catch(console.log);

      if (!sdp) return;

      const result = await this.rtc
        .setLocalDescription(sdp)
        .catch(err => JSON.stringify(err) + "err");
      if (typeof result === "string") {
        return;
      }

      const local = this.rtc.localDescription;

      if (trickle && local) {
        this.signal(local);
      }
    };
  }

  private async setAnswer(sdp: any) {
    if (this.isOffer) {
      await this.rtc
        .setRemoteDescription(new RTCSessionDescription(sdp))
        .catch(console.log);
    }
  }

  private async makeAnswer(offer: any) {
    const { trickle } = this.opt;

    if (this.isMadeAnswer) return;
    this.isMadeAnswer = true;

    let result: void | string;

    result = await this.rtc
      .setRemoteDescription(new RTCSessionDescription(offer))
      .catch(err => JSON.stringify(err) + "err");
    if (typeof result === "string") return;

    const answer = await this.rtc.createAnswer().catch(console.log);
    if (!answer) return;

    result = await this.rtc
      .setLocalDescription(answer)
      .catch(err => JSON.stringify(err) + "err");
    if (typeof result === "string") return;

    const local = this.rtc.localDescription;
    if (trickle && local) {
      this.signal(local);
    }
  }

  async setSdp(sdp: any) {
    switch (sdp.type) {
      case "offer":
        this.makeAnswer(sdp);
        break;
      case "answer":
        this.setAnswer(sdp);
        break;
      case "candidate":
        await this.rtc
          .addIceCandidate(new RTCIceCandidate(sdp.ice))
          .catch(console.log);
        break;
    }
  }

  private createDatachannel(label: string) {
    try {
      const dc = this.rtc.createDataChannel(label);
      this.dataChannelEvents(dc);
      this.dataChannels[label] = dc;
    } catch (dce) {}
  }

  private dataChannelEvents(channel: RTCDataChannel) {
    channel.onopen = () => {
      if (!this.isConnected) {
        this.connect();
        this.isConnected = true;
      }
    };
    try {
      channel.onmessage = async event => {
        if (!event) return;
        this.onData.excute({
          label: channel.label,
          data: event.data,
          nodeId: this.nodeId
        });
      };
    } catch (error) {}
    channel.onerror = err => {};
    channel.onclose = () => {
      this.hangUp();
    };
  }

  send(data: any, label?: string) {
    label = label || "datachannel";
    if (!Object.keys(this.dataChannels).includes(label)) {
      this.createDatachannel(label);
    }
    try {
      this.dataChannels[label].send(data);
    } catch (error) {
      this.hangUp();
    }
  }

  connecting(nodeId: string) {
    this.nodeId = nodeId;
  }
}
