"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = require("../../utill/arraybuffer");
var ArrayBufferService = /** @class */ (function () {
    function ArrayBufferService() {
        var _this = this;
        this.label = "w4me_file";
        this.origin = "datachannel";
        this.memory = [];
        // TODO test on kad
        this.send = function (ab, origin, dc, pc) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var chunks, _loop_1, this_1, out_i_1, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.origin = origin;
                        chunks = arraybuffer_1.sliceArraybuffer(ab, 16 * 1000);
                        _loop_1 = function (i) {
                            var chunk, error_1, make_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(dc.readyState === "open")) return [3 /*break*/, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 2, , 4]);
                                        chunk = chunks[i];
                                        dc.send(chunk);
                                        i++;
                                        return [3 /*break*/, 4];
                                    case 2:
                                        error_1 = _a.sent();
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [3 /*break*/, 7];
                                    case 5:
                                        if (!(dc.readyState === "closed")) return [3 /*break*/, 7];
                                        make_1 = pc.createDataChannel(this_1.label);
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                make_1.onopen = function () {
                                                    resolve();
                                                };
                                            })];
                                    case 6:
                                        _a.sent();
                                        dc = make_1;
                                        _a.label = 7;
                                    case 7:
                                        out_i_1 = i;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < chunks.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        i = out_i_1;
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4:
                        dc.send(origin);
                        return [2 /*return*/];
                }
            });
        }); };
    }
    ArrayBufferService.prototype.listen = function (peer) {
        var _this = this;
        peer.onData.subscribe(function (msg) {
            if (msg.label === _this.label) {
                var data = msg.data;
                if (typeof data === "string") {
                    var ab = arraybuffer_1.mergeArraybuffer(_this.memory);
                    console.log("finish", _this.memory, msg.data);
                    peer.onData.execute({
                        label: data,
                        data: ab,
                        nodeId: peer.nodeId
                    });
                    _this.memory = [];
                }
                else {
                    _this.memory.push(data);
                }
            }
        });
    };
    return ArrayBufferService;
}());
exports.default = ArrayBufferService;
//# sourceMappingURL=index.js.map