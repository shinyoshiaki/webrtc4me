"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("../index"));
var peerOffer = new index_1.default({ disable_stun: true, nodeId: "offer" });
var peerAnswer = new index_1.default({ disable_stun: true, nodeId: "answer" });
test("vanilla", function () {
    peerOffer.makeOffer();
    peerOffer.onSignal.once(function (sdp) {
        peerAnswer.setSdp(sdp);
    });
    peerAnswer.onSignal.once(function (sdp) {
        peerOffer.setSdp(sdp);
    });
    peerOffer.onConnect.once(function () {
        peerOffer.onData.subscribe(function (raw) {
            expect(raw.data).toBe("answer");
        });
        peerOffer.send("offer");
    });
    peerAnswer.onConnect.once(function () {
        peerAnswer.onData.subscribe(function (raw) {
            expect(raw.data).toBe("offer");
        });
        peerAnswer.send("answer");
    });
});
//# sourceMappingURL=vanilla.test.js.map