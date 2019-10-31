"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var wrtc = tslib_1.__importStar(require("wrtc"));
var __1 = tslib_1.__importDefault(require(".."));
test("vanilla", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var peerOffer, peerAnswer, offer, answer;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                peerOffer = new __1.default({ disable_stun: true, nodeId: "offer", wrtc: wrtc });
                peerAnswer = new __1.default({
                    disable_stun: true,
                    nodeId: "answer",
                    wrtc: wrtc
                });
                peerOffer.makeOffer();
                return [4 /*yield*/, peerOffer.onSignal.asPromise()];
            case 1:
                offer = _a.sent();
                peerAnswer.setSdp(offer);
                return [4 /*yield*/, peerAnswer.onSignal.asPromise()];
            case 2:
                answer = _a.sent();
                peerOffer.setSdp(answer);
                return [4 /*yield*/, Promise.all([
                        peerOffer.onConnect.asPromise(),
                        peerAnswer.onConnect.asPromise()
                    ])];
            case 3:
                _a.sent();
                setTimeout(function () {
                    peerOffer.send("offer");
                    peerAnswer.send("answer");
                });
                return [4 /*yield*/, Promise.all([
                        new Promise(function (r) {
                            peerOffer.onData.subscribe(function (raw) {
                                expect(raw.data).toBe("answer");
                                r();
                            });
                        }),
                        new Promise(function (r) {
                            peerAnswer.onData.subscribe(function (raw) {
                                expect(raw.data).toBe("offer");
                                r();
                            });
                        })
                    ])];
            case 4:
                _a.sent();
                peerAnswer.hangUp();
                peerOffer.hangUp();
                return [2 /*return*/];
        }
    });
}); }, 60000);
//# sourceMappingURL=vanilla.test.js.map