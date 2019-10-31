"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = tslib_1.__importDefault(require("./services/arraybuffer"));
var datachannel_1 = require("./services/datachannel");
var rx_mini_1 = require("rx.mini");
var _a = (function () {
    try {
        return window;
    }
    catch (error) {
        return {};
    }
})(), RTCPeerConnection = _a.RTCPeerConnection, RTCSessionDescription = _a.RTCSessionDescription, RTCIceCandidate = _a.RTCIceCandidate;
var WebRTC = /** @class */ (function () {
    function WebRTC(opt) {
        var _this = this;
        if (opt === void 0) { opt = {}; }
        this.opt = opt;
        this.pack = rx_mini_1.Pack();
        this.event = this.pack.event;
        this.onSignal = this.event();
        this.onConnect = this.event();
        this.onDisconnect = this.event();
        this.onData = this.event();
        this.onAddTrack = this.event();
        this.onOpenDC = this.event();
        this.isConnected = false;
        this.isDisconnected = false;
        this.isOffer = false;
        this.isNegotiating = false;
        this.arrayBufferService = new arraybuffer_1.default(this);
        this.onMessage = function (data, channel) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sdp, dataType, check;
            return tslib_1.__generator(this, function (_a) {
                try {
                    switch (channel.label) {
                        case "update":
                            {
                                sdp = JSON.parse(data);
                                this.setSdp(sdp);
                            }
                            break;
                        case "live":
                            {
                                if (data === "ping")
                                    this.send("pong", "live");
                                else if (this.timeoutPing)
                                    clearTimeout(this.timeoutPing);
                            }
                            break;
                        case "close":
                            {
                                this.hangUp();
                            }
                            break;
                        default: {
                            dataType = "string";
                            if (typeof data === "string") {
                                try {
                                    check = JSON.parse(data);
                                    if (check.it87nc247 === "json") {
                                        dataType = "object";
                                        data = check.payload;
                                    }
                                }
                                catch (error) { }
                            }
                            else {
                                dataType = "ArrayBuffer";
                            }
                            this.onData.execute({
                                label: channel.label,
                                data: data,
                                nodeId: this.nodeId,
                                dataType: dataType
                            });
                        }
                    }
                }
                catch (error) {
                    console.warn(error);
                }
                return [2 /*return*/];
            });
        }); };
        var nodeId = opt.nodeId, stream = opt.stream, track = opt.track, wrtc = opt.wrtc;
        if (wrtc) {
            RTCPeerConnection = wrtc.RTCPeerConnection;
            RTCSessionDescription = wrtc.RTCSessionDescription;
            RTCIceCandidate = wrtc.RTCIceCandidate;
        }
        this.nodeId = nodeId || "peer";
        this.rtc = this.prepareNewConnection();
        this.dataChannelService = new datachannel_1.DataChannelService(this.rtc);
        this.dataChannelService.onMessage.subscribe(function (_a) {
            var data = _a.data, channel = _a.channel;
            _this.onMessage(data, channel);
        });
        this.dataChannelService.onOpenDC.once(function () {
            _this.isConnected = true;
            _this.onConnect.execute(null);
            _this.dataChannelService.onOpenDC.subscribe(function (dc) {
                _this.onOpenDC.execute(dc);
            });
        });
        if (stream) {
            stream.getTracks().forEach(function (track) { return _this.rtc.addTrack(track, stream); });
        }
        else if (track) {
            this.rtc.addTrack(track);
        }
    }
    WebRTC.prototype.prepareNewConnection = function () {
        var _this = this;
        var _a = this.opt, disable_stun = _a.disable_stun, trickle = _a.trickle;
        var peer = new RTCPeerConnection({
            iceServers: disable_stun
                ? []
                : [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
        });
        peer.ontrack = function (evt) {
            var stream = evt.streams[0];
            _this.onAddTrack.execute(stream);
            _this.remoteStream = stream;
        };
        peer.oniceconnectionstatechange = function () {
            switch (peer.iceConnectionState) {
                case "failed":
                    break;
                case "disconnected":
                    if (_this.rtc) {
                        _this.timeoutPing = setTimeout(function () {
                            _this.hangUp();
                        }, 1000);
                        try {
                            _this.send("ping", "live");
                        }
                        catch (error) {
                            console.warn("disconnected", { error: error });
                        }
                    }
                    break;
                case "connected":
                    if (_this.timeoutPing)
                        clearTimeout(_this.timeoutPing);
                    break;
                case "closed":
                    _this.hangUp();
                    break;
                case "completed":
                    break;
            }
        };
        peer.onicecandidate = function (_a) {
            var candidate = _a.candidate;
            if (!_this.isConnected) {
                if (candidate) {
                    if (trickle) {
                        _this.onSignal.execute({
                            type: "candidate",
                            ice: JSON.parse(JSON.stringify(candidate))
                        });
                    }
                }
                else {
                    if (!trickle && peer.localDescription) {
                        _this.onSignal.execute(peer.localDescription);
                    }
                }
            }
        };
        peer.onsignalingstatechange = function () {
            _this.isNegotiating = peer.signalingState != "stable";
        };
        return peer;
    };
    WebRTC.prototype.makeOffer = function () {
        var _this = this;
        this.isOffer = true;
        var trickle = this.opt.trickle;
        this.dataChannelService.create("datachannel");
        this.rtc.onnegotiationneeded = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sdp, err, local;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isNegotiating || this.rtc.signalingState != "stable") {
                            console.warn("already negotiating");
                            return [2 /*return*/];
                        }
                        this.isNegotiating = true;
                        return [4 /*yield*/, this.rtc.createOffer().catch(console.warn)];
                    case 1:
                        sdp = _a.sent();
                        if (!sdp)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.rtc.setLocalDescription(sdp).catch(function () { return "err"; })];
                    case 2:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/];
                        local = this.rtc.localDescription;
                        if (trickle && local) {
                            this.onSignal.execute(local);
                        }
                        this.updateNegotiation();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    WebRTC.prototype.updateNegotiation = function () {
        var _this = this;
        this.rtc.onnegotiationneeded = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sdp, err, local;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            return [2 /*return*/];
                        if (this.isNegotiating || this.rtc.signalingState != "stable") {
                            console.warn("already negotiating");
                            return [2 /*return*/];
                        }
                        this.isNegotiating = true;
                        return [4 /*yield*/, this.rtc.createOffer().catch(console.warn)];
                    case 1:
                        sdp = _a.sent();
                        if (!sdp)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.rtc.setLocalDescription(sdp).catch(function () { return "err"; })];
                    case 2:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/];
                        local = this.rtc.localDescription;
                        if (local) {
                            this.send(JSON.stringify(local), "update");
                        }
                        this.isNegotiating = false;
                        return [2 /*return*/];
                }
            });
        }); };
    };
    WebRTC.prototype.setAnswer = function (sdp) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rtc
                            .setRemoteDescription(new RTCSessionDescription(sdp))
                            .catch(console.warn)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.makeAnswer = function (offer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var trickle, err, answer, err, local;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        trickle = this.opt.trickle;
                        return [4 /*yield*/, this.rtc
                                .setRemoteDescription(new RTCSessionDescription(offer))
                                .catch(function () { return "err"; })];
                    case 1:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/, err];
                        return [4 /*yield*/, this.rtc.createAnswer().catch(console.warn)];
                    case 2:
                        answer = _a.sent();
                        if (!answer)
                            return [2 /*return*/, "err"];
                        return [4 /*yield*/, this.rtc.setLocalDescription(answer).catch(function () { return "err"; })];
                    case 3:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/, err];
                        local = this.rtc.localDescription;
                        if (!local)
                            return [2 /*return*/, "err"];
                        if (this.isConnected)
                            this.send(JSON.stringify(local), "update");
                        else if (trickle)
                            this.onSignal.execute(local);
                        this.updateNegotiation();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.setSdp = function (sdp) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, err;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sdp.type;
                        switch (_a) {
                            case "offer": return [3 /*break*/, 1];
                            case "answer": return [3 /*break*/, 3];
                            case "candidate": return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, this.makeAnswer(sdp)];
                    case 2:
                        err = _b.sent();
                        err && console.warn(err);
                        return [3 /*break*/, 6];
                    case 3:
                        this.setAnswer(sdp);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.rtc
                            .addIceCandidate(new RTCIceCandidate(sdp.ice))
                            .catch(console.warn)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.send = function (data, label) {
        if (label === void 0) { label = "datachannel"; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var arrayBufferService, success, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.rtc)
                            return [2 /*return*/];
                        arrayBufferService = this.arrayBufferService;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!(typeof data !== "string" && data.byteLength > 16000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, arrayBufferService.send(data, label)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.dataChannelService
                            .create(label)
                            .catch(console.warn)];
                    case 4:
                        success = _a.sent();
                        if (!success)
                            throw new Error("dataChannel.create");
                        this.dataChannelService.send(data, label);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        throw new Error("unhandle datachannel error");
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.sendJson = function (payload, label) {
        if (label === void 0) { label = "datachannel"; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var success;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.rtc)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.dataChannelService
                                .create(label)
                                .catch(console.warn)];
                    case 1:
                        success = _a.sent();
                        if (!success)
                            throw new Error("dataChannel.create");
                        this.dataChannelService.send(
                        // random string key
                        JSON.stringify({ it87nc247: "json", payload: payload }), label);
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.addTrack = function (track, stream) {
        this.rtc.addTrack(track, stream);
    };
    WebRTC.prototype.addStream = function (stream) {
        try {
            this.rtc.addTrack(stream.getVideoTracks()[0], stream);
        }
        catch (error) {
            console.warn(error);
        }
    };
    WebRTC.prototype.hangUp = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rtc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rtc = this.rtc;
                        if (!rtc)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.send("close", "close").catch(function () { })];
                    case 1:
                        _a.sent();
                        this.dataChannelService.dispose();
                        rtc.oniceconnectionstatechange = null;
                        rtc.onicegatheringstatechange = null;
                        rtc.onsignalingstatechange = null;
                        rtc.onicecandidate = null;
                        rtc.ontrack = null;
                        rtc.ondatachannel = null;
                        rtc.close();
                        this.rtc = null;
                        this.isDisconnected = true;
                        this.isConnected = false;
                        this.onDisconnect.execute(null);
                        this.pack.finishAll();
                        return [2 /*return*/];
                }
            });
        });
    };
    return WebRTC;
}());
exports.default = WebRTC;
//# sourceMappingURL=core.js.map