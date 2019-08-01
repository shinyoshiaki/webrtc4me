"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = require("../utill/arraybuffer");
var SendFile = /** @class */ (function () {
    function SendFile(peer) {
        var _this = this;
        this.peer = peer;
        this.label = "file_quick";
        var unSubscribe = peer.onData.subscribe(function (_a) {
            var label = _a.label, data = _a.data;
            if (label === _this.label) {
                if (typeof data === "string") {
                    if (_this.blob) {
                        var url = window.URL.createObjectURL(_this.blob);
                        var anchor = document.createElement("a");
                        anchor.download = data;
                        anchor.href = url;
                        anchor.click();
                    }
                }
                else {
                    _this.blob = new Blob([data]);
                    peer.send("ready", _this.label);
                }
            }
        }).unSubscribe;
        peer.onDisconnect.once(unSubscribe);
    }
    SendFile.prototype.send = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ab;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, arraybuffer_1.blob2Arraybuffer(file)];
                    case 1:
                        ab = _a.sent();
                        this.peer.send(ab, this.label);
                        return [4 /*yield*/, new Promise(function (r) {
                                var unSubscribe = _this.peer.onData.subscribe(function (_a) {
                                    var data = _a.data, label = _a.label;
                                    if (label === _this.label) {
                                        if (data === "ready") {
                                            unSubscribe();
                                            r();
                                        }
                                    }
                                }).unSubscribe;
                            })];
                    case 2:
                        _a.sent();
                        this.peer.send(file.name, this.label);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SendFile;
}());
exports.default = SendFile;
//# sourceMappingURL=filequick.js.map