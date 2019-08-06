"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var wrtc = tslib_1.__importStar(require("wrtc"));
var index_1 = tslib_1.__importDefault(require("../index"));
var peerOffer = new index_1.default({ disable_stun: true, nodeId: "offer", wrtc: wrtc });
var peerAnswer = new index_1.default({ disable_stun: true, nodeId: "answer", wrtc: wrtc });
test("send json", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var offer, answer, msg, data;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                peerOffer.makeOffer();
                return [4 /*yield*/, peerOffer.onSignal.asPromise()];
            case 1:
                offer = _a.sent();
                peerAnswer.setSdp(offer);
                return [4 /*yield*/, peerAnswer.onSignal.asPromise()];
            case 2:
                answer = _a.sent();
                peerOffer.setSdp(answer);
                peerOffer.sendJson({ msg: "hello" });
                return [4 /*yield*/, peerAnswer.onData.asPromise()];
            case 3:
                msg = _a.sent();
                data = msg.data;
                expect(data).toEqual({ msg: "hello" });
                peerAnswer.hangUp();
                peerOffer.hangUp();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=sendjson.test.js.map