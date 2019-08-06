import * as wrtc from "wrtc";
import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer", wrtc });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer", wrtc });

test("send json", async () => {
  peerOffer.makeOffer();
  const offer = await peerOffer.onSignal.asPromise();
  peerAnswer.setSdp(offer);
  const answer = await peerAnswer.onSignal.asPromise();
  peerOffer.setSdp(answer);

  peerOffer.sendJson({ msg: "hello" });
  const msg = await peerAnswer.onData.asPromise();
  const data: { msg: string } = msg.data as any;
  expect(data).toEqual({ msg: "hello" });

  peerAnswer.hangUp();
  peerOffer.hangUp();
});
