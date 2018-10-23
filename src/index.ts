require("babel-polyfill");
import { RTCPeerConnection, RTCSessionDescription } from "wrtc";
import { message } from "./interface";
import Stream from "./stream";

function excuteEvent(ev: any, v?: any) {
  console.log("excuteEvent", ev);
  Object.keys(ev).forEach(key => {
    ev[key](v);
  });
}

export default class WebRTC {
  rtc: RTCPeerConnection;

  signal: (sdp: any) => void;
  connect: () => void;
  disconnect: () => void;
  private onData: { [key: string]: (raw: message) => void } = {};
  private onAddTrack: { [key: string]: (stream: MediaStream) => void } = {};
  events = {
    data: this.onData,
    track: this.onAddTrack
  };

  dataChannels: any;
  nodeId: string;
  isConnected: boolean;
  isDisconnected: boolean;
  onicecandidate: boolean;
  stream?: MediaStream;
  streamManager: Stream;
  constructor(opt?: { nodeId?: string; stream?: MediaStream }) {
    opt = opt || {};
    this.streamManager = new Stream(this);
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

  private prepareNewConnection(opt?: any) {
    if (opt) if (opt.nodeId) this.nodeId = opt.nodeId;
    let peer: RTCPeerConnection;
    if (opt === undefined) opt = {};
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
          this.disconnect();
          this.isDisconnected = true;
          this.isConnected = false;
          break;
        case "failed":
          break;
        case "connected":
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

    peer.ontrack = evt => {
      const stream = evt.streams[0];
      excuteEvent(this.onAddTrack, stream);
    };

    return peer;
  }

  makeOffer(opt?: { disable_stun?: boolean; nodeId?: string }) {
    this.rtc = this.prepareNewConnection(opt);
    this.rtc.onnegotiationneeded = async () => {
      let offer = await this.rtc.createOffer().catch(console.log);
      if (offer) await this.rtc.setLocalDescription(offer).catch(console.log);
    };
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
      if (this.stream) {
        this.streamManager.addStream(this.stream);
      }
      this.isConnected = true;
      this.onicecandidate = false;
      this.connect();
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

  async makeAnswer(
    sdp: any,
    opt?: { disable_stun?: boolean; nodeId?: string }
  ) {
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
    }
  }

  connecting(nodeId: string) {
    this.nodeId = nodeId;
  }
}
