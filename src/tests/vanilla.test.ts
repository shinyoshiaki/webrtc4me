import * as wrtc from "wrtc";
import WebRTC from "../index";
import { Count } from "../utill/testtools";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer", wrtc });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer", wrtc });

test("vanilla", async () => {
  const test = () =>
    new Promise(async resolve => {
      const count = Count(2, resolve);

      peerOffer.makeOffer();
      const offer = await peerOffer.onSignal.asPromise();
      peerAnswer.setSdp(offer);
      const answer = await peerAnswer.onSignal.asPromise();
      peerOffer.setSdp(answer);

      peerOffer.onConnect.once(() => {
        peerOffer.onData.subscribe(raw => {
          expect(raw.data).toBe("answer");
          count();
        });
        peerOffer.send("offer");
      });

      peerAnswer.onConnect.once(() => {
        peerAnswer.onData.subscribe(raw => {
          expect(raw.data).toBe("offer");
          count();
        });
        peerAnswer.send("answer");
      });
    });
  await test();
  peerAnswer.hangUp();
  peerOffer.hangUp();
});
