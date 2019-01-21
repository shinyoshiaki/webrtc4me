require("babel-polyfill");
import WebRTC from "./index";
const peerOffer = new WebRTC();
const peerAnswer = new WebRTC();

peerOffer.makeOffer({ disable_stun: true, nodeId: "offer" });
peerOffer.signal = sdp => {
  peerAnswer.makeAnswer(sdp, { disable_stun: true, nodeId: "answer" });
  peerAnswer.signal = sdp => {
    peerOffer.setAnswer(sdp);
  };
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
