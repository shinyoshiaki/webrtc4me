"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = require("../../utill/arraybuffer");
var ArrayBufferService = /** @class */ (function () {
    function ArrayBufferService() {
        this.label = "w4me_file";
        this.origin = "datachannel";
        this.memory = [];
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
                        label: msg.data,
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
    ArrayBufferService.prototype.send = function (ab, origin, rtc) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var chunks, _i, chunks_1, chunk;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.origin = origin;
                        console.log(this.origin, origin);
                        chunks = arraybuffer_1.sliceArraybuffer(ab, 16000);
                        _i = 0, chunks_1 = chunks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 4];
                        chunk = chunks_1[_i];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r); })];
                    case 2:
                        _a.sent();
                        rtc.send(chunk);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        rtc.send(origin);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ArrayBufferService;
}());
exports.default = ArrayBufferService;
//# sourceMappingURL=index.js.map