"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("../index"));
var testtools_1 = require("../utill/testtools");
var peerOffer = new index_1.default({ nodeId: "offer", trickle: true });
var peerAnswer = new index_1.default({ nodeId: "answer", trickle: true });
test("trickle", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var test;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                test = function () {
                    return new Promise(function (resolve) {
                        var count = testtools_1.Count(2, resolve);
                        peerOffer.makeOffer();
                        peerOffer.onSignal.subscribe(function (sdp) {
                            peerAnswer.setSdp(sdp);
                        });
                        peerAnswer.onSignal.subscribe(function (sdp) {
                            peerOffer.setSdp(sdp);
                        });
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
                    });
                };
                return [4 /*yield*/, test()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=trickle.test.js.map