require("babel-polyfill");
import { RTCPeerConnection, RTCSessionDescription } from "wrtc";
import { message } from "./interface";

interface option {
  disable_stun?: boolean;
  nodeId?: string;
}

interface OnData {
  [key: string]: (raw: message) => void;
}
interface OnAddTrack {
  [key: string]: (stream: MediaStream) => void;
}

type Event = OnData | OnAddTrack;

export function excuteEvent(ev: Event, v?: any) {
  console.log("excuteEvent", { ev });
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
  tag?: string
) {
  tag =
    tag ||
    (() => {
      let gen = Math.random().toString();
      while (Object.keys({}).includes(gen)) {
        gen = Math.random().toString();
      }
      return gen;
    })();
  if (Object.keys(event).includes(tag)) {
    console.error("include tag");
  } else {
    event[tag] = func;
  }
}

export default class WebRTC {
  rtc: RTCPeerConnection;

  signal: (sdp: any) => void;
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

  dataChannels: { [key: string]: RTCDataChannel };
  nodeId: string;
  isConnected: boolean;
  isDisconnected: boolean;
  onicecandidate: boolean;
  stream?: MediaStream;

  isOffer = false;
  constructor(opt?: { nodeId?: string; stream?: MediaStream }) {
    opt = opt || {};
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;
    this.nodeId = opt.nodeId || "peer";
    this.stream = opt.stream;
    this.connect = () => {};
    this.disconnect = () => {};
    this.signal = sdp => {};
  }

  private prepareNewConnection(opt?: option) {
    let peer: RTCPeerConnection;
    if (!opt) opt = {};
    if (opt.nodeId) this.nodeId = opt.nodeId;
    if (opt.disable_stun) {
      console.log("disable stun");
      peer = new RTCPeerConnection({
        iceServers: []
      });
    } else {
      peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.webrtc.ecl.ntt.com:3478" }]
      });
    }

    peer.onicecandidate = evt => {
      if (!evt.candidate) {
        if (!this.onicecandidate) {
          this.signal(peer.localDescription);
          this.onicecandidate = true;
        }
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log(
        this.nodeId,
        "ICE connection Status has changed to " + peer.iceConnectionState
      );
      switch (peer.iceConnectionState) {
        case "closed":
          break;
        case "failed":
          break;
        case "connected":
          break;
        case "completed":
          break;
        case "disconnected":
          console.log("webrtc4me disconnected");
          this.isDisconnected = true;
          this.isConnected = false;
          this.disconnect();
          break;
      }
    };

    peer.ondatachannel = evt => {
      const dataChannel = evt.channel;
      this.dataChannels[dataChannel.label] = dataChannel;
      this.dataChannelEvents(dataChannel);
    };

    peer.ontrack = evt => {
      const stream = evt.streams[0];
      excuteEvent(this.onAddTrack, stream);
      stream.onaddtrack = track => {
        excuteEvent(this.onAddTrack, track);
      };
    };

    return peer;
  }

  makeOffer(opt?: option) {
    this.rtc = this.prepareNewConnection(opt);
    this.rtc.onnegotiationneeded = async () => {
      const offer = await this.rtc.createOffer().catch(console.log);
      if (offer) await this.rtc.setLocalDescription(offer).catch(console.log);
    };
    this.isOffer = true;
    this.createDatachannel("datachannel");
  }

  private createDatachannel(label: string) {
    try {
      const dc = this.rtc.createDataChannel(label);
      this.dataChannelEvents(dc);
      this.dataChannels[label] = dc;
    } catch (dce) {
      console.log("dc established error: " + dce.message);
    }
  }

  private dataChannelEvents(channel: RTCDataChannel) {
    channel.onopen = () => {
      if (!this.isConnected) this.connect();
      this.isConnected = true;
      this.onicecandidate = false;
    };
    channel.onmessage = event => {
      excuteEvent(this.onData, {
        label: channel.label,
        data: event.data,
        nodeId: this.nodeId
      });
    };
    channel.onerror = err => {
      console.log("Datachannel Error: " + err);
    };
    channel.onclose = () => {
      console.log("DataChannel is closed");
      this.isDisconnected = true;
      this.disconnect();
    };
  }

  setAnswer(sdp: any, nodeId?: string) {
    this.rtc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch(console.log);
    this.nodeId = nodeId || this.nodeId;
  }

  async makeAnswer(sdp: any, opt?: option) {
    this.rtc = this.prepareNewConnection(opt);
    await this.rtc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch(console.log);
    const answer = await this.rtc.createAnswer().catch(console.log);
    if (answer) await this.rtc.setLocalDescription(answer).catch(console.log);
  }

  send(data: any, label?: string) {
    label = label || "datachannel";
    if (!Object.keys(this.dataChannels).includes(label)) {
      this.createDatachannel(label);
    }
    try {
      this.dataChannels[label].send(data);
    } catch (error) {
      console.log("dc send error", error);
      this.isDisconnected = true;
      this.disconnect();
    }
  }

  connecting(nodeId: string) {
    this.nodeId = nodeId;
  }
}
