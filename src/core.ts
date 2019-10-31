import ArrayBufferService from "./services/arraybuffer";
import { DataChannelService } from "./services/datachannel";
import { Pack } from "rx.mini";

type Option = {
  disable_stun: boolean;
  stream: MediaStream;
  track: MediaStreamTrack;
  nodeId: string;
  trickle: boolean;
  wrtc: any;
};

let { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = (() => {
  try {
    return window;
  } catch (error) {
    return {} as any;
  }
})() as {
  RTCPeerConnection: typeof globalThis.RTCPeerConnection;
  RTCSessionDescription: typeof globalThis.RTCSessionDescription;
  RTCIceCandidate: typeof globalThis.RTCIceCandidate;
};

export default class WebRTC {
  rtc: RTCPeerConnection;

  private pack = Pack();
  private event = this.pack.event;

  onSignal = this.event<Signal>();
  onConnect = this.event();
  onDisconnect = this.event();
  onData = this.event<Message>();
  onAddTrack = this.event<MediaStream>();
  onOpenDC = this.event<RTCDataChannel>();

  nodeId: string;

  isConnected = false;
  isDisconnected = false;
  isOffer = false;
  isNegotiating = false;

  remoteStream?: MediaStream;
  private timeoutPing?: any;

  private arrayBufferService = new ArrayBufferService(this);
  private dataChannelService: DataChannelService;

  constructor(public opt: Partial<Option> = {}) {
    const { nodeId, stream, track, wrtc } = opt;

    if (wrtc) {
      RTCPeerConnection = wrtc.RTCPeerConnection;
      RTCSessionDescription = wrtc.RTCSessionDescription;
      RTCIceCandidate = wrtc.RTCIceCandidate;
    }

    this.nodeId = nodeId || "peer";

    this.rtc = this.prepareNewConnection();

    this.dataChannelService = new DataChannelService(this.rtc);
    this.dataChannelService.onMessage.subscribe(({ data, channel }) => {
      this.onMessage(data, channel);
    });
    this.dataChannelService.onOpenDC.once(() => {
      this.isConnected = true;
      this.onConnect.execute(null);

      this.dataChannelService.onOpenDC.subscribe(dc => {
        this.onOpenDC.execute(dc);
      });
    });

    if (stream) {
      stream.getTracks().forEach(track => this.rtc.addTrack(track, stream));
    } else if (track) {
      this.rtc.addTrack(track);
    }
  }

  private prepareNewConnection() {
    const { disable_stun, trickle } = this.opt;
    const peer = new RTCPeerConnection({
      iceServers: disable_stun
        ? []
        : [
            {
              urls: "stun:stun.l.google.com:19302"
            }
          ]
    });

    peer.ontrack = evt => {
      const stream = evt.streams[0];
      this.onAddTrack.execute(stream);
      this.remoteStream = stream;
    };

    peer.oniceconnectionstatechange = () => {
      switch (peer.iceConnectionState) {
        case "failed":
          break;
        case "disconnected":
          if (this.rtc) {
            this.timeoutPing = setTimeout(() => {
              this.hangUp();
            }, 1000);
            try {
              this.send("ping", "live");
            } catch (error) {
              console.warn("disconnected", { error });
            }
          }
          break;
        case "connected":
          if (this.timeoutPing) clearTimeout(this.timeoutPing);
          break;
        case "closed":
          this.hangUp();
          break;
        case "completed":
          break;
      }
    };

    peer.onicecandidate = ({ candidate }) => {
      if (!this.isConnected) {
        if (candidate) {
          if (trickle) {
            this.onSignal.execute({
              type: "candidate",
              ice: JSON.parse(JSON.stringify(candidate))
            });
          }
        } else {
          if (!trickle && peer.localDescription) {
            this.onSignal.execute(peer.localDescription);
          }
        }
      }
    };

    peer.onsignalingstatechange = () => {
      this.isNegotiating = peer.signalingState != "stable";
    };

    return peer;
  }

  makeOffer() {
    this.isOffer = true;
    const { trickle } = this.opt;

    this.dataChannelService.create("datachannel");

    this.rtc.onnegotiationneeded = async () => {
      if (this.isNegotiating || this.rtc.signalingState != "stable") {
        console.warn("already negotiating");
        return;
      }

      this.isNegotiating = true;

      const sdp = await this.rtc.createOffer().catch(console.warn);
      if (!sdp) return;

      const err = await this.rtc.setLocalDescription(sdp).catch(() => "err");
      if (err) return;

      const local = this.rtc.localDescription;

      if (trickle && local) {
        this.onSignal.execute(local);
      }

      this.updateNegotiation();
    };
  }

  private updateNegotiation() {
    this.rtc.onnegotiationneeded = async () => {
      if (!this.isConnected) return;
      if (this.isNegotiating || this.rtc.signalingState != "stable") {
        console.warn("already negotiating");
        return;
      }

      this.isNegotiating = true;

      const sdp = await this.rtc.createOffer().catch(console.warn);
      if (!sdp) return;

      const err = await this.rtc.setLocalDescription(sdp).catch(() => "err");
      if (err) return;

      const local = this.rtc.localDescription;
      if (local) {
        this.send(JSON.stringify(local), "update");
      }

      this.isNegotiating = false;
    };
  }

  private async setAnswer(sdp: Signal) {
    await this.rtc
      .setRemoteDescription(
        new RTCSessionDescription(sdp as RTCSessionDescriptionInit)
      )
      .catch(console.warn);
  }

  private async makeAnswer(offer: Signal) {
    const { trickle } = this.opt;

    {
      const err = await this.rtc
        .setRemoteDescription(
          new RTCSessionDescription(offer as RTCSessionDescriptionInit)
        )
        .catch(() => "err");
      if (err) return err;
    }

    const answer = await this.rtc.createAnswer().catch(console.warn);
    if (!answer) return "err";

    {
      const err = await this.rtc.setLocalDescription(answer).catch(() => "err");
      if (err) return err;
    }

    const local = this.rtc.localDescription;
    if (!local) return "err";

    if (this.isConnected) this.send(JSON.stringify(local), "update");
    else if (trickle) this.onSignal.execute(local);

    this.updateNegotiation();
  }

  async setSdp(sdp: Signal) {
    switch (sdp.type) {
      case "offer":
        const err = await this.makeAnswer(sdp);
        err && console.warn(err);
        break;
      case "answer":
        this.setAnswer(sdp);
        break;
      case "candidate":
        await this.rtc
          .addIceCandidate(new RTCIceCandidate(sdp.ice))
          .catch(console.warn);
        break;
    }
  }

  onMessage = async (data: any, channel: RTCDataChannel) => {
    try {
      switch (channel.label) {
        case "update":
          {
            const sdp = JSON.parse(data);
            this.setSdp(sdp);
          }
          break;
        case "live":
          {
            if (data === "ping") this.send("pong", "live");
            else if (this.timeoutPing) clearTimeout(this.timeoutPing);
          }
          break;
        case "close":
          {
            this.hangUp();
          }
          break;
        default: {
          let dataType: DataType = "string";

          if (typeof data === "string") {
            try {
              const check = JSON.parse(data);
              if (check.it87nc247 === "json") {
                dataType = "object";
                data = check.payload;
              }
            } catch (error) {}
          } else {
            dataType = "ArrayBuffer";
          }

          this.onData.execute({
            label: channel.label as string | "datachannel",
            data,
            nodeId: this.nodeId,
            dataType
          });
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  async send(data: string | ArrayBuffer | Buffer, label = "datachannel") {
    if (!this.rtc) return;
    const { arrayBufferService } = this;

    try {
      if (typeof data !== "string" && data.byteLength > 16000) {
        await arrayBufferService.send(data, label);
      } else {
        const success = await this.dataChannelService
          .create(label)
          .catch(console.warn);
        if (!success) throw new Error("dataChannel.create");

        this.dataChannelService.send(data, label);
      }
    } catch (error) {
      throw new Error("unhandle datachannel error");
    }
  }

  async sendJson(payload: object, label = "datachannel") {
    if (!this.rtc) return;

    const success = await this.dataChannelService
      .create(label)
      .catch(console.warn);
    if (!success) throw new Error("dataChannel.create");

    this.dataChannelService.send(
      // random string key
      JSON.stringify({ it87nc247: "json", payload }),
      label
    );
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.rtc.addTrack(track, stream);
  }

  addStream(stream: MediaStream) {
    try {
      this.rtc.addTrack(stream.getVideoTracks()[0], stream);
    } catch (error) {
      console.warn(error);
    }
  }

  async hangUp() {
    const { rtc } = this;

    if (!rtc) return;

    await this.send("close", "close").catch(() => {});

    this.dataChannelService.dispose();

    rtc.oniceconnectionstatechange = null as any;
    rtc.onicegatheringstatechange = null as any;
    rtc.onsignalingstatechange = null as any;
    rtc.onicecandidate = null as any;
    rtc.ontrack = null as any;
    rtc.ondatachannel = null as any;
    rtc.close();
    this.rtc = null as any;

    this.isDisconnected = true;
    this.isConnected = false;
    this.onDisconnect.execute(null);

    this.pack.finishAll();
  }
}

type DataType = "string" | "ArrayBuffer" | "object";

export type Message = {
  label: string | "datachannel";
  data: string | ArrayBuffer | object;
  dataType: DataType;
  nodeId: string;
};

export type Signal = {
  type: "candidate" | "offer" | "answer" | "pranswer" | "rollback";
  ice?: RTCIceCandidateInit;
  sdp?: string;
};
