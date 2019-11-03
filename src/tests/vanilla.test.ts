import * as wrtc from "wrtc";

import WebRTC from "..";

test("vanilla", async () => {
  const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer", wrtc });
  const peerAnswer = new WebRTC({
    disable_stun: true,
    nodeId: "answer",
    wrtc
  });

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
    peerOffer.send("offer");
    peerAnswer.send("answer");
  });

  await Promise.all([
    new Promise(r => {
      peerOffer.onData.subscribe(raw => {
        expect(raw.data).toBe("answer");
        r();
      });
    }),
    new Promise(r => {
      peerAnswer.onData.subscribe(raw => {
        expect(raw.data).toBe("offer");
        r();
      });
    })
  ]);

  peerAnswer.hangUp();
  peerOffer.hangUp();
}, 60_000);
