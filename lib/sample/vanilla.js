"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("../index"));
var peerOffer = new index_1.default({ disable_stun: true, nodeId: "offer" });
var peerAnswer = new index_1.default({ disable_stun: true, nodeId: "answer" });
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var offer, answer;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                peerOffer.makeOffer();
                return [4 /*yield*/, peerOffer.onSignal.asPromise().catch(console.log)];
            case 1:
                offer = _a.sent();
                peerAnswer.setSdp(offer);
                return [4 /*yield*/, peerAnswer.onSignal.asPromise().catch(console.log)];
            case 2:
                answer = _a.sent();
                peerOffer.setSdp(answer);
                peerOffer.onConnect.once(function () {
                    console.log("offer connect");
                    peerOffer.onData.subscribe(function (raw) {
                        console.log("ondata offer", raw);
                    });
                    peerOffer.send("one", "offer1");
                    peerOffer.send("two", "offer2");
                });
                peerAnswer.onConnect.once(function () {
                    console.log("answer connect");
                    peerAnswer.onData.subscribe(function (raw) {
                        console.log("ondata answer", raw);
                    });
                    peerAnswer.send("one", "answer1");
                    peerAnswer.send("two", "answer2");
                });
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=vanilla.js.map