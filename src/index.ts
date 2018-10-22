require("babel-polyfill");
import { RTCPeerConnection, RTCSessionDescription } from "wrtc";
import { message } from "./interface";

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
  private data: { [key: string]: (raw: message) => void } = {};
  events = {
    data: this.data
  };

  dataChannels: any;
  nodeId: string;
  isConnected: boolean;
  isDisconnected: boolean;
  onicecandidate: boolean;
  constructor(nodeId?: string) {
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;
    this.nodeId = nodeId || "peer";
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
          this.isConnected = true;
          this.onicecandidate = false;
          this.connect();
          break;
        case "completed":
          if (!this.isConnected) {
            this.isConnected = true;
            this.onicecandidate = false;
            this.connect();
          }
          break;
      }
    };

    peer.ondatachannel = evt => {
      const dataChannel = evt.channel;
      this.dataChannels[dataChannel.label] = dataChannel;
      this.dataChannelEvents(dataChannel);
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
    channel.onopen = () => {};
    channel.onmessage = event => {
      excuteEvent(this.data, {
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
    try {
      this.rtc.setRemoteDescription(new RTCSessionDescription(sdp));
      if (nodeId) this.nodeId = nodeId;
    } catch (err) {
      console.error("setRemoteDescription(answer) ERROR: ", err);
    }
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
    if (!label) label = "datachannel";
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
