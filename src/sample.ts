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

  peerOffer.events.data["sample.ts"] = raw => {
    console.log("ondata offer", raw);
  };

  peerOffer.send("hello", "test");
  peerOffer.send("test", "second");
};

peerAnswer.connect = () => {
  console.log("answer connect");
  peerAnswer.events.data["sample.ts"] = raw => {
    console.log("ondata offer", raw);
  };
  peerAnswer.send("hi", "test");
  peerAnswer.send("test!!", "third");
};
