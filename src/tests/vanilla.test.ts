import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer" });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer" });

test("vanilla", async () => {
  const test = () =>
    new Promise(async resolve => {
      let count = 0;
      const end = () => {
        count++;
        if (count === 2) resolve();
      };

      peerOffer.makeOffer();
      const offer = await peerOffer.onSignal.asPromise();
      peerAnswer.setSdp(offer);
      const answer = await peerAnswer.onSignal.asPromise();
      peerOffer.setSdp(answer);

      peerOffer.onConnect.once(() => {
        peerOffer.onData.subscribe(raw => {
          expect(raw.data).toBe("answer");
          end();
        });
        peerOffer.send("offer");
      });

      peerAnswer.onConnect.once(() => {
        peerAnswer.onData.subscribe(raw => {
          expect(raw.data).toBe("offer");
          end();
        });
        peerAnswer.send("answer");
      });
    });
  await test();
});
