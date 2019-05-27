import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer" });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer" });

test("vanilla", () => {
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
    });
    peerOffer.send("offer");
  });

  peerAnswer.onConnect.once(() => {
    peerAnswer.onData.subscribe(raw => {
      expect(raw.data).toBe("offer");
    });
    peerAnswer.send("answer");
  });
});
