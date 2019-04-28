import WebRTC from "../index";
const peerOffer = new WebRTC({ nodeId: "offer", trickle: true });
const peerAnswer = new WebRTC({ nodeId: "answer", trickle: true });

test("trickle", async () => {
  const test = () =>
    new Promise(resolve => {
      let count = 0;
      const end = () => {
        count++;
        if (count === 2) resolve();
      };

      peerOffer.makeOffer();
      peerOffer.onSignal.once((sdp: any) => {
        peerAnswer.setSdp(sdp);
      });
      peerAnswer.onSignal.once((sdp: any) => {
        peerOffer.setSdp(sdp);
      });

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
