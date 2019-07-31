"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rx_mini_1 = require("rx.mini");
var services_1 = tslib_1.__importDefault(require("./services"));
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
        this.wait4DC = new rx_mini_1.Wait();
        this.isConnected = false;
        this.isDisconnected = false;
        this.isOffer = false;
        this.isNegotiating = false;
        this.services = services_1.default();
        this.isDCOpend = function (label) {
            var dc = _this.dataChannels[label];
            if (!dc)
                return false;
            return dc.readyState === "open";
        };
        var nodeId = opt.nodeId, stream = opt.stream, track = opt.track, wrtc = opt.wrtc;
        var arrayBufferService = this.services.arrayBufferService;
        if (wrtc) {
            RTCPeerConnection = wrtc.RTCPeerConnection;
            RTCSessionDescription = wrtc.RTCSessionDescription;
            RTCIceCandidate = wrtc.RTCIceCandidate;
        }
        this.dataChannels = {};
        this.nodeId = nodeId || "peer";
        this.rtc = this.prepareNewConnection();
        if (stream) {
            stream.getTracks().forEach(function (track) { return _this.rtc.addTrack(track, stream); });
        }
        else if (track) {
            this.rtc.addTrack(track);
        }
        arrayBufferService.listen(this);
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
        peer.onicecandidate = function (evt) {
            if (!_this.isConnected) {
                var ice = evt.candidate;
                if (ice) {
                    if (trickle) {
                        _this.onSignal.execute({
                            type: "candidate",
                            ice: JSON.parse(JSON.stringify(ice))
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
        peer.ondatachannel = function (evt) {
            var dataChannel = evt.channel;
            _this.dataChannels[dataChannel.label] = dataChannel;
            _this.dataChannelEvents(dataChannel);
        };
        peer.onsignalingstatechange = function (e) {
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
                        if (this.isNegotiating || this.rtc.signalingState != "stable")
                            return [2 /*return*/];
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
                        this.negotiationSetting();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    WebRTC.prototype.negotiationSetting = function () {
        var _this = this;
        this.rtc.onnegotiationneeded = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var offer, err, local;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected)
                            return [2 /*return*/];
                        if (this.isNegotiating || this.rtc.signalingState != "stable")
                            return [2 /*return*/];
                        this.isNegotiating = true;
                        return [4 /*yield*/, this.rtc.createOffer({}).catch(console.warn)];
                    case 1:
                        offer = _a.sent();
                        if (!offer)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.rtc.setLocalDescription(offer).catch(function () { return "err"; })];
                    case 2:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/];
                        local = this.rtc.localDescription;
                        if (local)
                            this.send(JSON.stringify(local), "update");
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
                            return [2 /*return*/];
                        return [4 /*yield*/, this.rtc.createAnswer().catch(console.warn)];
                    case 2:
                        answer = _a.sent();
                        if (!answer)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.rtc.setLocalDescription(answer).catch(function () { return "err"; })];
                    case 3:
                        err = _a.sent();
                        if (err)
                            return [2 /*return*/];
                        local = this.rtc.localDescription;
                        if (!local)
                            return [2 /*return*/];
                        if (this.isConnected)
                            this.send(JSON.stringify(local), "update");
                        else if (trickle)
                            this.onSignal.execute(local);
                        this.negotiationSetting();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.setSdp = function (sdp) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sdp.type;
                        switch (_a) {
                            case "offer": return [3 /*break*/, 1];
                            case "answer": return [3 /*break*/, 2];
                            case "candidate": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        this.makeAnswer(sdp);
                        return [3 /*break*/, 5];
                    case 2:
                        this.setAnswer(sdp);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.rtc
                            .addIceCandidate(new RTCIceCandidate(sdp.ice))
                            .catch(console.warn)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
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
    WebRTC.prototype.dataChannelEvents = function (channel) {
        var _this = this;
        return new Promise(function (resolve) {
            channel.onopen = function () {
                if (!_this.isConnected) {
                    _this.isConnected = true;
                    _this.onConnect.execute(undefined);
                }
                resolve();
            };
            channel.onmessage = function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var sdp;
                return tslib_1.__generator(this, function (_a) {
                    if (!event)
                        return [2 /*return*/];
                    try {
                        if (channel.label === "update") {
                            sdp = JSON.parse(event.data);
                            this.setSdp(sdp);
                        }
                        else if (channel.label === "live") {
                            if (event.data === "ping")
                                this.send("pong", "live");
                            else if (this.timeoutPing)
                                clearTimeout(this.timeoutPing);
                        }
                        else {
                            this.onData.execute({
                                label: channel.label,
                                data: event.data,
                                nodeId: this.nodeId
                            });
                        }
                    }
                    catch (error) {
                        console.warn(error);
                    }
                    return [2 /*return*/];
                });
            }); };
            channel.onerror = function (err) { return console.warn(err); };
            channel.onclose = function () { };
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
                        arrayBufferService = this.services.arrayBufferService;
                        sendData = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var err_1, err_2, err_3, error_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 7, , 8]);
                                        if (!(typeof data === "string")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.createDatachannel(label).catch(function () { return "error"; })];
                                    case 1:
                                        err_1 = _a.sent();
                                        if (err_1)
                                            return [2 /*return*/, err_1];
                                        this.dataChannels[label].send(data);
                                        return [3 /*break*/, 6];
                                    case 2:
                                        if (!(data.byteLength > 16000)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.createDatachannel(arrayBufferService.label).catch(function () { return "error"; })];
                                    case 3:
                                        err_2 = _a.sent();
                                        if (err_2)
                                            return [2 /*return*/, err_2];
                                        arrayBufferService.send(data, label, this.dataChannels[arrayBufferService.label], this.rtc);
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, this.createDatachannel(label).catch(function () { return "error"; })];
                                    case 5:
                                        err_3 = _a.sent();
                                        if (err_3)
                                            return [2 /*return*/, err_3];
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
                        console.warn("fail", error, data.length);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebRTC.prototype.addTrack = function (track, stream) {
        this.rtc.addTrack(track, stream);
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