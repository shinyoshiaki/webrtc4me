import WebRTC from "../index";
import { Count } from "../utill/testtools";
const peerOffer = new WebRTC({ nodeId: "offer", trickle: true });
const peerAnswer = new WebRTC({ nodeId: "answer", trickle: true });

test("trickle", async () => {
  const test = () =>
    new Promise(resolve => {
      const count = Count(2, resolve);

      peerOffer.makeOffer();
      peerOffer.onSignal.subscribe((sdp: any) => {
        peerAnswer.setSdp(sdp);
      });
      peerAnswer.onSignal.subscribe((sdp: any) => {
        peerOffer.setSdp(sdp);
      });

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
});
