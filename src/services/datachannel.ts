import Event, { Pack } from "rx.mini";

export class DataChannelService {
  private pack = Pack();
  private event = this.pack.event;

  onMessage = this.event<{ channel: RTCDataChannel; data: any }>();
  onOpenDC = this.event<RTCDataChannel>();

  dataChannels: { [label: string]: RTCDataChannel } = {};

  private creatingChannel: { [label: string]: Event<RTCDataChannel> } = {};

  constructor(private pc: RTCPeerConnection) {
    pc.ondatachannel = async ({ channel }) => {
      await new Promise(r => (channel.onopen = () => r()));

      this.channelEvents(channel);
      this.dataChannels[channel.label] = channel;
      this.onOpenDC.execute(channel);
    };
  }

  private channelEvents = (channel: RTCDataChannel) => {
    channel.onmessage = ({ data }) => {
      this.onMessage.execute({ data, channel });
    };
    channel.onerror = err => console.warn(err);
    channel.onclose = () => delete this.dataChannels[channel.label];
  };

  async create(label: string) {
    if (this.dataChannels[label]) {
      return this.dataChannels[label];
    }

    if (this.creatingChannel[label]) {
      const channel = await this.creatingChannel[label].asPromise();
      return channel;
    }

    const event = new Event<RTCDataChannel>();
    this.creatingChannel[label] = event;

    const channel = this.pc.createDataChannel(label);

    if (Object.keys(this.dataChannels).length === 0)
      await new Promise(r => (channel.onopen = () => r()));
    else {
      await new Promise(r => setTimeout(r));
    }

    this.dataChannels[label] = channel;
    this.channelEvents(channel);
    this.onOpenDC.execute(channel);

    event.execute(channel);
    delete this.creatingChannel[label];

    return channel;
  }

  send(data: any, label: string) {
    if (!this.dataChannels[label]) throw new Error("no channel");
    this.dataChannels[label].send(data);
  }

  dispose() {
    Object.values(this.dataChannels).forEach(channel => {
      channel.onmessage = null as any;
      channel.onopen = null as any;
      channel.onclose = null as any;
      channel.onerror = null as any;
      channel.close();
    });
    this.pack.finishAll();
  }
}
