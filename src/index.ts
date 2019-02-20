require("babel-polyfill");
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from "wrtc";

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

export interface OnData {
  [key: string]: (raw: message) => void;
}
interface OnAddTrack {
  [key: string]: (stream: MediaStream) => void;
}

type Event = OnData | OnAddTrack;

export function excuteEvent(ev: Event, v?: any) {
  Object.keys(ev).forEach(key => {
    const func: any = ev[key];
    if (v) {
      func(v);
    } else {
      func();
    }
  });
}

export function addEvent<T extends Event>(
  event: T,
  func: T[keyof T],
  _tag?: string
) {
  const tag =
    _tag ||
    (() => {
      let gen = Math.random().toString();
      while (Object.keys(event).includes(gen)) {
        gen = Math.random().toString();
      }
      return gen;
    })();
  if (Object.keys(event).includes(tag)) {
    console.error("included tag");
  } else {
    event[tag] = func;
  }
}

export default class WebRTC {
  rtc: RTCPeerConnection;

  signal: (sdp: object) => void;
  connect: () => void;
  disconnect: () => void;
  private onData: OnData = {};
  addOnData = (func: OnData[keyof OnData], tag?: string) => {
    addEvent<OnData>(this.onData, func, tag);
  };
  private onAddTrack: OnAddTrack = {};
  addOnAddTrack = (func: OnAddTrack[keyof OnData], tag?: string) => {
    addEvent<OnAddTrack>(this.onAddTrack, func, tag);
  };

  private dataChannels: { [key: string]: RTCDataChannel };

  nodeId: string;
  isConnected = false;
  isDisconnected = false;
  isOffer = false;
  isMadeAnswer = false;
  negotiating = false;

  opt: Partial<option>;

  constructor(opt: Partial<option> = {}) {
    this.opt = opt;
    this.dataChannels = {};
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = () => {};
    this.disconnect = () => {};
    this.signal = sdp => {};

    this.rtc = this.prepareNewConnection();
    this.addStream();
  }

  private prepareNewConnection() {
    let peer: RTCPeerConnection;
    if (this.opt.nodeId) this.nodeId = this.opt.nodeId;
    if (this.opt.disable_stun) {
      peer = new RTCPeerConnection({
        iceServers: []
      });
    } else {
      peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302"
          }
        ]
      });
    }

    peer.onicecandidate = evt => {
      if (evt.candidate) {
        if (this.opt.trickle) {
          this.signal({ type: "candidate", ice: evt.candidate });
        }
      } else {
        if (!this.opt.trickle && peer.localDescription) {
          this.signal(peer.localDescription);
        }
      }
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
          this.negotiating = false;
          break;
        case "closed":
          break;
        case "completed":
          break;
      }
    };

    peer.ondatachannel = evt => {
      const dataChannel = evt.channel;
      this.dataChannels[dataChannel.label] = dataChannel;
      this.dataChannelEvents(dataChannel);
    };

    peer.onsignalingstatechange = e => {};

    peer.ontrack = evt => {
      const stream = evt.streams[0];
      excuteEvent(this.onAddTrack, stream);
    };

    return peer;
  }

  private hangUp() {
    this.isDisconnected = true;
    this.isConnected = false;
    this.disconnect();
  }

  makeOffer() {
    this.rtc.onnegotiationneeded = async () => {
      if (this.negotiating) return;
      this.negotiating = true;
      const offer = await this.rtc.createOffer().catch(console.log);
      if (!offer) return;
      await this.rtc.setLocalDescription(offer).catch(console.log);
      if (this.opt.trickle && this.rtc.localDescription) {
        this.signal(this.rtc.localDescription);
      }
    };
    this.isOffer = true;
    this.createDatachannel("datachannel");
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
        excuteEvent(this.onData, {
          label: channel.label,
          data: event.data,
          nodeId: this.nodeId
        });
        if (channel.label === "webrtc") {
        }
      };
    } catch (error) {}
    channel.onerror = err => {};
    channel.onclose = () => {
      this.hangUp();
    };
  }

  private addStream() {
    if (this.opt.stream) {
      const stream = this.opt.stream;
      stream.getTracks().forEach(track => this.rtc.addTrack(track, stream));
    }
  }

  private async setAnswer(sdp: any) {
    await this.rtc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch(console.log);
  }

  private async makeAnswer(sdp: any) {
    if (this.isMadeAnswer) return;
    this.isMadeAnswer = true;

    await this.rtc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch(console.log);

    const answer = await this.rtc.createAnswer().catch(console.log);
    if (!answer) return;
    await this.rtc.setLocalDescription(answer).catch(console.log);
    const localDescription = this.rtc.localDescription;
    if (this.opt.trickle && localDescription) {
      this.signal(localDescription);
    }
  }

  setSdp(sdp: any) {
    switch (sdp.type) {
      case "offer":
        this.makeAnswer(sdp);
        break;
      case "answer":
        this.setAnswer(sdp);
        break;
      case "candidate":
        this.rtc.addIceCandidate(new RTCIceCandidate(sdp.ice));
        break;
    }
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
