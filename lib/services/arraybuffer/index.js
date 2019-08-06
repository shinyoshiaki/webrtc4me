"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = require("../../utill/arraybuffer");
var rx_mini_1 = tslib_1.__importDefault(require("rx.mini"));
var ArrayBufferService = /** @class */ (function () {
    function ArrayBufferService(peer) {
        var _this = this;
        this.peer = peer;
        this.label = "wrtc4me_abservice";
        this.memory = [];
        this.onData = new rx_mini_1.default();
        this.listen = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var peer, unSubscribe;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        peer = this.peer;
                        return [4 /*yield*/, peer.onConnect.asPromise()];
                    case 1:
                        _a.sent();
                        peer.onOpenDC.subscribe(function (dc) {
                            if (dc.label === _this.label) {
                                dc.onmessage = _this.onData.execute;
                            }
                        });
                        unSubscribe = this.onData.subscribe(function (_a) {
                            var data = _a.data;
                            if (typeof data === "string") {
                                var _b = JSON.parse(data), type = _b.type, payload = _b.payload;
                                switch (type) {
                                    case "end": {
                                        var ab = arraybuffer_1.mergeArraybuffer(Object.values(_this.memory));
                                        peer.onData.execute({
                                            label: payload,
                                            data: ab,
                                            nodeId: peer.nodeId,
                                            dataType: "ArrayBuffer"
                                        });
                                        _this.memory = [];
                                    }
                                }
                            }
                            else {
                                _this.memory.push(data);
                            }
                        }).unSubscribe;
                        peer.onDisconnect.once(unSubscribe);
                        return [2 /*return*/];
                }
            });
        }); };
        this.send = function (ab, label) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var dc, chunks;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createDC()];
                    case 1:
                        dc = _a.sent();
                        chunks = arraybuffer_1.sliceArraybuffer(ab, 16 * 1000);
                        return [4 /*yield*/, this.job(chunks, dc)];
                    case 2:
                        _a.sent();
                        this.rpc({ type: "end", payload: label }, dc);
                        return [2 /*return*/];
                }
            });
        }); };
        this.job = function (chunks, dc) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var i, chunk;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < chunks.length)) return [3 /*break*/, 5];
                        if (!(dc.bufferedAmount > 1024 * 1000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        chunk = chunks[i];
                        console.log({ i: i }, chunk);
                        try {
                            dc.send(chunk);
                            i++;
                        }
                        catch (error) {
                            console.log({ error: error });
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.rpc = function (msg, dc) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                try {
                    dc.send(JSON.stringify(msg));
                }
                catch (error) {
                    console.log({ error: error });
                }
                return [2 /*return*/];
            });
        }); };
        this.createDC = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var dc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dc = this.peer.rtc.createDataChannel(this.label);
                        return [4 /*yield*/, new Promise(function (r) { return (dc.onopen = function () { return r(); }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, dc];
                }
            });
        }); };
        this.listen();
    }
    return ArrayBufferService;
}());
exports.default = ArrayBufferService;
//# sourceMappingURL=index.js.map