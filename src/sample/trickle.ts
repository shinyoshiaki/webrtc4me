require("babel-polyfill");
import WebRTC from "../index";
const peerOffer = new WebRTC({ nodeId: "offer", trickle: true });
const peerAnswer = new WebRTC({ nodeId: "answer", trickle: true });

peerOffer.makeOffer();
peerOffer.signal = (sdp: any) => {
  peerAnswer.setSdp(sdp);
};
peerAnswer.signal = (sdp: any) => {
  peerOffer.setSdp(sdp);
};

peerOffer.connect = () => {
  console.log("offer connect");
  peerOffer.onData.subscribe(raw => {
    console.log("ondata offer", raw);
  });
  peerOffer.send("one", "offer1");
  peerOffer.send("two", "offer2");
};

peerAnswer.connect = () => {
  console.log("answer connect");
  peerAnswer.onData.subscribe(raw => {
    console.log("ondata answer", raw);
  });
  peerAnswer.send("one", "answer1");
  peerAnswer.send("two", "answer2");
};
