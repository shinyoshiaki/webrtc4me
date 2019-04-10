require("babel-polyfill");
import WebRTC from "../index";
const peerOffer = new WebRTC({ disable_stun: true, nodeId: "offer" });
const peerAnswer = new WebRTC({ disable_stun: true, nodeId: "answer" });

peerOffer.makeOffer();
peerOffer.onSignal.once((sdp: any) => {
  peerAnswer.setSdp(sdp);
});
peerAnswer.onSignal.once((sdp: any) => {
  peerOffer.setSdp(sdp);
});

peerOffer.onConnect.once(() => {
  console.log("offer connect");
  peerOffer.onData.subscribe(raw => {
    console.log("ondata offer", raw);
  });
  peerOffer.send("one", "offer1");
  peerOffer.send("two", "offer2");
});

peerAnswer.onConnect.once(() => {
  console.log("answer connect");
  peerAnswer.onData.subscribe(raw => {
    console.log("ondata answer", raw);
  });
  peerAnswer.send("one", "answer1");
  peerAnswer.send("two", "answer2");
});
