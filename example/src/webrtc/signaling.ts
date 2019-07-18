import client from "socket.io-client";
import WebRTC from "../../../src";

const url =
  process.env.NODE_ENV === "production"
    ? "https://serene-anchorage-28732.herokuapp.com/"
    : "https://serene-anchorage-28732.herokuapp.com/";

const socket = client.connect(url);

// create is answer

export function create(roomId: string, trickle: boolean, stun: boolean) {
  console.log("crate is answer");

  return new Promise<WebRTC>(resolve => {
    const rtc = new WebRTC({ nodeId: "answer", trickle, disable_stun: !stun });
    socket.emit("create", { roomId });
    socket.on("sdp", (data: { sdp: string }) => {
      console.log({ data });
      rtc.setSdp(data.sdp);
    });

    const onSignal = rtc.onSignal.subscribe(sdp => {
      console.log({ sdp, roomId });
      socket.emit("sdp", { sdp, roomId });
    });
    rtc.onConnect.once(() => {
      console.log("connect");
      onSignal.unSubscribe();
      resolve(rtc);
    });
    rtc.onData.subscribe(message => {
      console.log({ message });
    });
  });
}

export function join(roomId: string, trickle: boolean, stun: boolean) {
  console.log("join is offer");

  return new Promise<WebRTC>(resolve => {
    const rtc = new WebRTC({ nodeId: "offer", trickle, disable_stun: !stun });
    socket.emit("join", { roomId });
    socket.on("join", () => {
      rtc.makeOffer();
    });
    socket.on("sdp", (data: { sdp: string }) => {
      console.log({ data });
      rtc.setSdp(data.sdp);
    });

    const onSignal = rtc.onSignal.subscribe(sdp => {
      console.log({ sdp, roomId });
      socket.emit("sdp", { sdp, roomId });
    });
    rtc.onConnect.once(() => {
      console.log("connect");
      resolve(rtc);
      onSignal.unSubscribe();
    });
    rtc.onData.subscribe(message => {
      console.log({ message });
    });
  });
}
