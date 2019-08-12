import { Pack, Wait } from "rx.mini";
import ArrayBufferService from "./services/arraybuffer";

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
})();

export default class WebRTC {
  rtc: RTCPeerConnection;

  private pack = Pack();
  private event = this.pack.event;

  onSignal = this.event<Signal>();
  onConnect = this.event<undefined>();
  onDisconnect = this.event<undefined>();
  onData = this.event<Message>();
  onAddTrack = this.event<MediaStream>();
  onOpenDC = this.event<RTCDataChannel>();

  private wait4DC = new Wait<RTCDataChannel | undefined>();

  private dataChannels: { [key: string]: RTCDataChannel } = {};

  nodeId: string;

  isConnected = false;
  isDisconnected = false;
  isOffer = false;
  isNegotiating = false;

  remoteStream: MediaStream | undefined;
  private timeoutPing: any | undefined;

  private arrayBufferService = new ArrayBufferService(this);

  constructor(public opt: Partial<Option> = {}) {
    const { nodeId, stream, track, wrtc } = opt;

    if (wrtc) {
      RTCPeerConnection = wrtc.RTCPeerConnection;
      RTCSessionDescription = wrtc.RTCSessionDescription;
      RTCIceCandidate = wrtc.RTCIceCandidate;
    }

    this.nodeId = nodeId || "peer";

    this.rtc = this.prepareNewConnection();

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
    }) as RTCPeerConnection;

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

    peer.ondatachannel = ({ channel }) => {
      this.dataChannels[channel.label] = channel;
      this.dataChannelEvents(channel);
      this.onOpenDC.execute(channel);
    };

    peer.onsignalingstatechange = () => {
      this.isNegotiating = peer.signalingState != "stable";
    };

    return peer;
  }

  hangUp() {
    this.isDisconnected = true;
    this.isConnected = false;
    this.onDisconnect.execute(undefined);
    this.disconnect();
  }

  makeOffer() {
    this.isOffer = true;
    const { trickle } = this.opt;

    this.createDatachannel("datachannel");

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
        console.log({ local });
        this.send(JSON.stringify(local), "update");
      }

      this.isNegotiating = false;
    };
  }

  private async setAnswer(sdp: Signal) {
    await this.rtc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .catch(console.warn);
  }

  private async makeAnswer(offer: Signal) {
    const { trickle } = this.opt;

    {
      const err = await this.rtc
        .setRemoteDescription(new RTCSessionDescription(offer))
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

  private isDCOpend = (label: string) => {
    const dc = this.dataChannels[label];
    if (!dc) return false;
    return dc.readyState === "open";
  };

  private async createDatachannel(label: string) {
    const wait = async () => {
      try {
        const dc = this.rtc.createDataChannel(label);
        await this.dataChannelEvents(dc);
        if (dc.readyState === "open") return dc;
      } catch (dce) {
        console.error(dce);
      }
    };

    if (!this.isDCOpend(label)) {
      const { exist, result } = await this.wait4DC.create(label, wait);

      if (exist) {
        const res = await exist.asPromise().catch(() => {});
        if (res) this.dataChannels[label] = res;
      }
      if (result) {
        this.dataChannels[label] = result;
      }
    }
  }

  private dataChannelEvents = (channel: RTCDataChannel) =>
    new Promise(resolve => {
      channel.onopen = () => {
        if (!this.isConnected) {
          this.isConnected = true;
          this.onConnect.execute(undefined);
        }
        resolve();
      };

      channel.onmessage = async ({ data }) => {
        try {
          if (channel.label === "update") {
            const sdp = JSON.parse(data);
            this.setSdp(sdp);
          } else if (channel.label === "live") {
            if (data === "ping") this.send("pong", "live");
            else if (this.timeoutPing) clearTimeout(this.timeoutPing);
          } else {
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
        } catch (error) {
          console.warn(error);
        }
      };

      channel.onerror = err => console.warn(err);
      channel.onclose = () => delete this.dataChannels[channel.label];
    });

  async send(data: string | ArrayBuffer | Buffer, label = "datachannel") {
    if (!this.rtc) return;
    const { arrayBufferService } = this;
    const sendData = async () => {
      try {
        if (typeof data === "string") {
          const err = await this.createDatachannel(label).catch(() => "error");
          if (err) {
            console.warn({ err });
            return err;
          }
          this.dataChannels[label].send(data);
        } else {
          if (data.byteLength > 16000) {
            await arrayBufferService.send(data, label);
          } else {
            const err = await this.createDatachannel(label).catch(
              () => "error"
            );
            if (err) return err;
            this.dataChannels[label].send(data);
          }
        }
      } catch (error) {
        return "unhandle datachannel error";
      }
    };

    const err = await sendData();
    if (err) {
      console.warn("retry send data channel");
      await new Promise(r => setTimeout(r));
      const error = await sendData();
      console.warn("fail", error);
    }
  }

  async sendJson(payload: object, label = "datachannel") {
    if (!this.rtc) return;
    const err = await this.createDatachannel(label).catch(() => "error");
    if (err) {
      console.warn({ err });
      return err;
    }
    this.dataChannels[label].send(
      JSON.stringify({ it87nc247: "json", payload })
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

  private disconnect() {
    const { rtc, dataChannels } = this;

    if (!rtc) return;

    for (let key in dataChannels) {
      const channel = dataChannels[key];
      channel.onmessage = null as any;
      channel.onopen = null as any;
      channel.onclose = null as any;
      channel.onerror = null as any;
      channel.close();
    }

    rtc.oniceconnectionstatechange = null as any;
    rtc.onicegatheringstatechange = null as any;
    rtc.onsignalingstatechange = null as any;
    rtc.onicecandidate = null as any;
    rtc.ontrack = null as any;
    rtc.ondatachannel = null as any;
    rtc.close();

    this.rtc = null as any;

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
