import WebRTC from "../index";
const peerOffer = new WebRTC({ nodeId: "offer", trickle: true });
const peerAnswer = new WebRTC({ nodeId: "answer", trickle: true });

peerOffer.makeOffer();
peerOffer.onSignal.subscribe((sdp: any) => {
  peerAnswer.setSdp(sdp);
});
peerAnswer.onSignal.subscribe((sdp: any) => {
  peerOffer.setSdp(sdp);
});

peerOffer.onConnect.once(() => {
  console.log("offer connect");
  peerOffer.onData.once(raw => {
    console.log("ondata offer", raw);
  });
  peerOffer.send("one", "offer1");
  peerOffer.send("two", "offer2");
});

peerAnswer.onConnect.once(() => {
  console.log("answer connect");
  peerAnswer.onData.once(raw => {
    console.log("ondata answer", raw);
  });
  peerAnswer.send("one", "answer1");
  peerAnswer.send("two", "answer2");
});
