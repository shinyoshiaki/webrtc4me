"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("../core"));
var rx_mini_1 = tslib_1.__importDefault(require("rx.mini"));
var Stream = /** @class */ (function () {
    function Stream(peer, opt) {
        if (opt === void 0) { opt = {}; }
        this.peer = peer;
        this.opt = opt;
        this.onStream = new rx_mini_1.default();
        this.onLocalStream = new rx_mini_1.default();
        this.initDone = false;
        this.label = opt.label || "stream";
        this.listen();
    }
    Stream.prototype.listen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var label, _a, get, stream, immidiate, track, localStream;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        label = "init_" + this.label;
                        _a = this.opt, get = _a.get, stream = _a.stream, immidiate = _a.immidiate, track = _a.track;
                        localStream = stream;
                        if (!immidiate) return [3 /*break*/, 1];
                        this.init({ stream: localStream, track: track });
                        return [3 /*break*/, 4];
                    case 1:
                        if (!get) return [3 /*break*/, 3];
                        return [4 /*yield*/, get.catch(console.log)];
                    case 2:
                        localStream = (_b.sent());
                        this.onLocalStream.execute(localStream);
                        _b.label = 3;
                    case 3:
                        this.peer.onData.once(function (raw) {
                            if (raw.label === label && raw.data === "done") {
                                if (!get) {
                                    _this.init({ stream: localStream, track: track });
                                }
                            }
                        });
                        this.peer.send("done", label);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Stream.prototype.init = function (media) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var stream, track, peer, newPeer;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                stream = media.stream, track = media.track;
                if (this.initDone)
                    return [2 /*return*/];
                this.initDone = true;
                peer = this.peer;
                newPeer = new core_1.default({ stream: stream, track: track });
                if (peer.isOffer) {
                    newPeer.makeOffer();
                    newPeer.onSignal.once(function (sdp) {
                        peer.send(JSON.stringify(sdp), _this.label + "_offer");
                    });
                    peer.onData.once(function (raw) {
                        var label = raw.label, data = raw.data;
                        if (label === _this.label + "_answer" && typeof data === "string") {
                            newPeer.setSdp(JSON.parse(data));
                        }
                    });
                }
                else {
                    peer.onData.once(function (raw) {
                        var label = raw.label, data = raw.data;
                        if (label === _this.label + "_offer" && typeof data === "string") {
                            newPeer.setSdp(JSON.parse(data));
                            newPeer.onSignal.once(function (sdp) {
                                peer.send(JSON.stringify(sdp), _this.label + "_answer");
                            });
                        }
                    });
                }
                newPeer.onAddTrack.once(function (stream) {
                    _this.onStream.execute(stream);
                });
                return [2 /*return*/];
            });
        });
    };
    return Stream;
}());
exports.default = Stream;
//# sourceMappingURL=stream.js.map