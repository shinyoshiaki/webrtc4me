require("babel-polyfill");
import WebRTC from "./index";
const peerOffer = new WebRTC();
const peerAnswer = new WebRTC();

peerOffer.makeOffer({ disable_stun: true, nodeId: "offer" });
peerOffer.signal = sdp => {
  console.log("offer signal");
  peerAnswer.makeAnswer(sdp, { disable_stun: true, nodeId: "answer" });
  peerAnswer.signal = sdp => {
    console.log("answer signal");
    peerOffer.setAnswer(sdp);
  };
};

peerOffer.connect = () => {
  console.log("offer connect");
  peerOffer.addOnData("offer", raw => {
    console.log("ondata offer", raw);
  });
  peerOffer.send("one", "offer1");
  peerOffer.send("two", "offer2");
};

peerAnswer.connect = () => {
  console.log("answer connect");
  peerAnswer.addOnData("answer", raw => {
    console.log("ondata answer", raw);
  });
  peerAnswer.send("one", "answer1");
  peerAnswer.send("two", "answer2");
};
