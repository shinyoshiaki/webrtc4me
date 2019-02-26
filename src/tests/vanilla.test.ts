import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer" });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer" });

test("vanilla", () => {
  peerOffer.makeOffer();
  peerOffer.signal = (sdp: any) => {
    peerAnswer.setSdp(sdp);
  };
  peerAnswer.signal = (sdp: any) => {
    peerOffer.setSdp(sdp);
  };

  peerOffer.connect = () => {
    peerOffer.onData.subscribe(raw => {
      expect(raw.data).toBe("answer");
    });
    peerOffer.send("offer");
  };

  peerAnswer.connect = () => {
    peerAnswer.onData.subscribe(raw => {
      expect(raw.data).toBe("offer");
    });
    peerAnswer.send("answer");
  };
});
