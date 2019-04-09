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

  remoteStream: MediaStream | undefined;
  timeoutPing: NodeJS.Timeout | undefined;

  constructor(public opt: Partial<option> = {}) {
    const { nodeId, stream } = opt;

    this.dataChannels = {};
    this.nodeId = nodeId || "peer";

    this.connect = () => {};
    this.disconnect = () => {};
    this.signal = _ => {};

    this.rtc = this.prepareNewConnection();

    if (stream) {
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
          break;
        case "disconnected":
          try {
            this.timeoutPing = setTimeout(() => {
              this.hangUp();
            }, 2000);
            console.log("ping");
            this.send("ping", "live");
          } catch (error) {
            console.log({ error });
          }
          break;
        case "connected":
          if (this.timeoutPing) clearTimeout(this.timeoutPing);
          break;
        case "closed":
          console.log("closed");
          break;
        case "completed":
          break;
      }
    };

    peer.onicecandidate = evt => {
      if (!this.isConnected) {
        if (evt.candidate) {
          if (trickle) {
            this.signal({ type: "candidate", ice: evt.candidate });
          }
        } else {
          if (!trickle && peer.localDescription) {
            this.signal(peer.localDescription);
          }
        }
      }
    };

    peer.ondatachannel = evt => {
      const dataChannel = evt.channel;
      this.dataChannels[dataChannel.label] = dataChannel;
      this.dataChannelEvents(dataChannel);
    };

    peer.onsignalingstatechange = e => {
      this.negotiating = peer.signalingState != "stable";
    };

    return peer;
  }

  hangUp() {
    console.log("hangup");
    this.isDisconnected = true;
    this.isConnected = false;
    this.disconnect();
  }

  makeOffer() {
    this.isOffer = true;
    const { trickle } = this.opt;
    this.createDatachannel("datachannel");

    this.rtc.onnegotiationneeded = async () => {
      if (this.negotiating || this.rtc.signalingState != "stable") return;
      this.negotiating = true;

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

      this.negotiation();
    };
  }

  negotiating = false;
  private negotiation() {
    this.rtc.onnegotiationneeded = async () => {
      if (!this.isConnected) return;

      try {
        if (this.negotiating || this.rtc.signalingState != "stable") return;
        this.negotiating = true;
        const options = {};
        const sessionDescription = await this.rtc.createOffer(options).catch();
        await this.rtc.setLocalDescription(sessionDescription).catch();
        const local = this.rtc.localDescription;
        if (local) {
          this.send(JSON.stringify(local), "update");
        }
      } finally {
        this.negotiating = false;
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

    await this.rtc
      .setRemoteDescription(new RTCSessionDescription(offer))
      .catch(console.log);

    const answer = await this.rtc.createAnswer().catch(console.log);
    if (!answer) {
      console.log("no answer");
      return;
    }

    await this.rtc.setLocalDescription(answer).catch(console.log);

    const local = this.rtc.localDescription;

    if (this.isConnected) {
      this.send(JSON.stringify(local), "update");
    } else if (trickle && local) {
      this.signal(local);
    }

    this.negotiation();
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
    if (!Object.keys(this.dataChannels).includes(label)) {
      try {
        const dc = this.rtc.createDataChannel(label);
        this.dataChannelEvents(dc);
        this.dataChannels[label] = dc;
      } catch (dce) {}
    }
  }

  private dataChannelEvents(channel: RTCDataChannel) {
    channel.onopen = () => {
      if (!this.isConnected) {
        console.log("connected", this.nodeId);
        this.isConnected = true;
        this.connect();
      }
    };
    try {
      channel.onmessage = async event => {
        if (!event) return;

        if (channel.label === "update") {
          const sdp = JSON.parse(event.data);
          this.setSdp(sdp);
        } else if (channel.label === "live") {
          if (event.data === "ping") this.send("pong", "live");
          else if (this.timeoutPing) clearTimeout(this.timeoutPing);
        } else {
          this.onData.excute({
            label: channel.label,
            data: event.data,
            nodeId: this.nodeId
          });
        }
      };
    } catch (error) {}
    channel.onerror = err => {};
    channel.onclose = () => {};
  }

  send(data: any, label?: string) {
    label = label || "datachannel";
    if (!Object.keys(this.dataChannels).includes(label)) {
      this.createDatachannel(label);
    }
    try {
      this.dataChannels[label].send(data);
    } catch (error) {}
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.rtc.addTrack(track, stream);
  }
}
