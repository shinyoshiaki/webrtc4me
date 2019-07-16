"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var wrtc = tslib_1.__importStar(require("wrtc"));
var index_1 = tslib_1.__importDefault(require("../index"));
var testtools_1 = require("../utill/testtools");
var peerOffer = new index_1.default({ disable_stun: true, nodeId: "offer", wrtc: wrtc });
var peerAnswer = new index_1.default({ disable_stun: true, nodeId: "answer", wrtc: wrtc });
test("vanilla", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var test;
    var _this = this;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                test = function () {
                    return new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var count, offer, answer;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    count = testtools_1.Count(2, resolve);
                                    peerOffer.makeOffer();
                                    return [4 /*yield*/, peerOffer.onSignal.asPromise()];
                                case 1:
                                    offer = _a.sent();
                                    peerAnswer.setSdp(offer);
                                    return [4 /*yield*/, peerAnswer.onSignal.asPromise()];
                                case 2:
                                    answer = _a.sent();
                                    peerOffer.setSdp(answer);
                                    peerOffer.onConnect.once(function () {
                                        peerOffer.onData.subscribe(function (raw) {
                                            expect(raw.data).toBe("answer");
                                            count();
                                        });
                                        peerOffer.send("offer");
                                    });
                                    peerAnswer.onConnect.once(function () {
                                        peerAnswer.onData.subscribe(function (raw) {
                                            expect(raw.data).toBe("offer");
                                            count();
                                        });
                                        peerAnswer.send("answer");
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                return [4 /*yield*/, test()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=vanilla.test.js.map