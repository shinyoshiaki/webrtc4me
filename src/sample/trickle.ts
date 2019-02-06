require("babel-polyfill");
import WebRTC from "../trickle";
const peerOffer = new WebRTC({ nodeId: "offer", trickle: true });
const peerAnswer = new WebRTC({ nodeId: "answer", trickle: true });

peerOffer.makeOffer();
peerOffer.signal = (sdp: any) => {
  if (!peerAnswer.isMadeAnswer) {
    peerAnswer.signal = (sdp: any) => {
      peerOffer.setSdp(sdp);
    };
  }
  peerAnswer.setSdp(sdp);
};

peerOffer.connect = () => {
  console.log("offer connect");
  peerOffer.addOnData(raw => {
    console.log("ondata offer", raw);
  }, "offer");
  peerOffer.send("one", "offer1");
  peerOffer.send("two", "offer2");
};

peerAnswer.connect = () => {
  console.log("answer connect");
  peerAnswer.addOnData(raw => {
    console.log("ondata answer", raw);
  }, "answer");
  peerAnswer.send("one", "answer1");
  peerAnswer.send("two", "answer2");
};
