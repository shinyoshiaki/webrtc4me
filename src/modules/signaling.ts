import WebRTC from "../core";
import Event from "rx.mini";
import { Signal } from "..";

export default class Signaling extends WebRTC {
  offer() {
    const event = new Event<Signal>();

    const { unSubscribe } = this.onSignal.subscribe(event.execute);
    this.onConnect.once(unSubscribe);

    this.makeOffer();

    return event.returnListener;
  }

  answer(signal: Signal) {
    const event = new Event<Signal>();

    const { unSubscribe } = this.onSignal.subscribe(event.execute);
    this.onConnect.once(unSubscribe);

    this.setSdp(signal);

    return event.returnListener;
  }
}
