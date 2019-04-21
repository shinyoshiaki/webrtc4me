"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("../index"));
var peerOffer = new index_1.default({ nodeId: "offer", trickle: true });
var peerAnswer = new index_1.default({ nodeId: "answer", trickle: true });
peerOffer.makeOffer();
peerOffer.onSignal.subscribe(function (sdp) {
    peerAnswer.setSdp(sdp);
});
peerAnswer.onSignal.subscribe(function (sdp) {
    peerOffer.setSdp(sdp);
});
peerOffer.onConnect.once(function () {
    console.log("offer connect");
    peerOffer.onData.once(function (raw) {
        console.log("ondata offer", raw);
    });
    peerOffer.send("one", "offer1");
    peerOffer.send("two", "offer2");
});
peerAnswer.onConnect.once(function () {
    console.log("answer connect");
    peerAnswer.onData.once(function (raw) {
        console.log("ondata answer", raw);
    });
    peerAnswer.send("one", "answer1");
    peerAnswer.send("two", "answer2");
});
//# sourceMappingURL=trickle.js.map