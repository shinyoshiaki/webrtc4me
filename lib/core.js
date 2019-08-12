"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rx_mini_1 = require("rx.mini");
var arraybuffer_1 = tslib_1.__importDefault(require("./services/arraybuffer"));
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
        this.wait4DC = new rx_mini_1.Wait();
        this.dataChannels = {};
        this.isConnected = false;
        this.isDisconnected = false;
        this.isOffer = false;
        this.isNegotiating = false;
        this.arrayBufferService = new arraybuffer_1.default(this);
        this.isDCOpend = function (label) {
            var dc = _this.dataChannels[label];
            if (!dc)
                return false;
            return dc.readyState === "open";
        };
        this.dataChannelEvents = function (channel) {
            return new Promise(function (resolve) {
                channel.onopen = function () {
                    if (!_this.isConnected) {
                        _this.isConnected = true;
                        _this.onConnect.execute(undefined);
                    }
                    resolve();
                };
                channel.onmessage = function (_a) {
                    var data = _a.data;
                    return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var sdp, dataType, check;
                        return tslib_1.__generator(this, function (_b) {
                            try {
                                if (channel.label === "update") {
                                    sdp = JSON.parse(data);
                                    this.setSdp(sdp);
                                }
                                else if (channel.label === "live") {
                                    if (data === "ping")
                                        this.send("pong", "live");
                                    else if (this.timeoutPing)
                                        clearTimeout(this.timeoutPing);
                                }
                                else {
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
                            catch (error) {
                                console.warn(error);
                            }
                            return [2 /*return*/];
                        });
                    });
                };
                channel.onerror = function (err) { return console.warn(err); };
                channel.onclose = function () { return delete _this.dataChannels[channel.label]; };
            });
        };
        var nodeId = opt.nodeId, stream = opt.stream, track = opt.track, wrtc = opt.wrtc;
        if (wrtc) {
            RTCPeerConnection = wrtc.RTCPeerConnection;
            RTCSessionDescription = wrtc.RTCSessionDescription;
            RTCIceCandidate = wrtc.RTCIceCandidate;
        }
        this.nodeId = nodeId || "peer";
        this.rtc = this.prepareNewConnection();
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
        peer.ondatachannel = function (_a) {
            var channel = _a.channel;
            _this.dataChannels[channel.label] = channel;
            _this.dataChannelEvents(channel);
            _this.onOpenDC.execute(channel);
        };
        peer.onsignalingstatechange = function () {
            _this.isNegotiating = peer.signalingState != "stable";
        };
        return peer;
    };
    WebRTC.prototype.hangUp = function () {
        this.isDisconnected = true;
        this.isConnected = false;
        this.onDisconnect.execute(undefined);
        this.disconnect();
    };
    WebRTC.prototype.makeOffer = function () {
        var _this = this;
        this.isOffer = true;
        var trickle = this.opt.trickle;
        this.createDatachannel("datachannel");
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
                            console.log({ local: local });
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
    WebRTC.prototype.createDatachannel = function (label) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wait, _a, exist, result, res;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wait = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var dc, dce_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        dc = this.rtc.createDataChannel(label);
                                        return [4 /*yield*/, this.dataChannelEvents(dc)];
                                    case 1:
                                        _a.sent();
                                        if (dc.readyState === "open")
                                            return [2 /*return*/, dc];
                                        return [3 /*break*/, 3];
                                    case 2:
                                        dce_1 = _a.sent();
                                        console.error(dce_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!!this.isDCOpend(label)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.wait4DC.create(label, wait)];
                    case 1:
                        _a = _b.sent(), exist = _a.exist, result = _a.result;
                        if (!exist) return [3 /*break*/, 3];
                        return [4 /*yield*/, exist.asPromise().catch(function () { })];
                    case 2:
                        res = _b.sent();
                        if (res)
                            this.dataChannels[label] = res;
                        _b.label = 3;
                    case 3:
                        if (result) {
                            this.dataChannels[label] = result;
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.send = function (data, label) {
        if (label === void 0) { label = "datachannel"; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var arrayBufferService, sendData, err, error;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.rtc)
                            return [2 /*return*/];
                        arrayBufferService = this.arrayBufferService;
                        sendData = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var err_1, err_2, error_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 7, , 8]);
                                        if (!(typeof data === "string")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.createDatachannel(label).catch(function () { return "error"; })];
                                    case 1:
                                        err_1 = _a.sent();
                                        if (err_1) {
                                            console.warn({ err: err_1 });
                                            return [2 /*return*/, err_1];
                                        }
                                        this.dataChannels[label].send(data);
                                        return [3 /*break*/, 6];
                                    case 2:
                                        if (!(data.byteLength > 16000)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, arrayBufferService.send(data, label)];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, this.createDatachannel(label).catch(function () { return "error"; })];
                                    case 5:
                                        err_2 = _a.sent();
                                        if (err_2)
                                            return [2 /*return*/, err_2];
                                        this.dataChannels[label].send(data);
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, "unhandle datachannel error"];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, sendData()];
                    case 1:
                        err = _a.sent();
                        if (!err) return [3 /*break*/, 4];
                        console.warn("retry send data channel");
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, sendData()];
                    case 3:
                        error = _a.sent();
                        console.warn("fail", error);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.sendJson = function (payload, label) {
        if (label === void 0) { label = "datachannel"; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.rtc)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.createDatachannel(label).catch(function () { return "error"; })];
                    case 1:
                        err = _a.sent();
                        if (err) {
                            console.warn({ err: err });
                            return [2 /*return*/, err];
                        }
                        this.dataChannels[label].send(JSON.stringify({ it87nc247: "json", payload: payload }));
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
    WebRTC.prototype.disconnect = function () {
        var _a = this, rtc = _a.rtc, dataChannels = _a.dataChannels;
        if (!rtc)
            return;
        for (var key in dataChannels) {
            var channel = dataChannels[key];
            channel.onmessage = null;
            channel.onopen = null;
            channel.onclose = null;
            channel.onerror = null;
            channel.close();
        }
        rtc.oniceconnectionstatechange = null;
        rtc.onicegatheringstatechange = null;
        rtc.onsignalingstatechange = null;
        rtc.onicecandidate = null;
        rtc.ontrack = null;
        rtc.ondatachannel = null;
        rtc.close();
        this.rtc = null;
        this.pack.finishAll();
    };
    return WebRTC;
}());
exports.default = WebRTC;
//# sourceMappingURL=core.js.map