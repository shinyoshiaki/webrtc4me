require("babel-polyfill");
import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer" });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer" });

peerOffer.makeOffer();
peerOffer.signal = (sdp: any) => {
  peerAnswer.setSdp(sdp);
  peerAnswer.signal = (sdp: any) => {
    peerOffer.setSdp(sdp);
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
