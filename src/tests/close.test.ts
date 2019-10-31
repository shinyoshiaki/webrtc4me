import * as wrtc from "wrtc";

import WebRTC from "..";

test("close", async () => {
  const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer", wrtc });
  const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer", wrtc });

  peerOffer.makeOffer();
  const offer = await peerOffer.onSignal.asPromise();
  peerAnswer.setSdp(offer);
  const answer = await peerAnswer.onSignal.asPromise();
  peerOffer.setSdp(answer);

  await Promise.all([
    peerOffer.onConnect.asPromise(),
    peerAnswer.onConnect.asPromise()
  ]);

  setTimeout(() => {
    peerOffer.hangUp();
  });
  await peerAnswer.onDisconnect.asPromise();

  expect(true).toEqual(true);
}, 600_000);
