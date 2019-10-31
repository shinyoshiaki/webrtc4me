"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _1 = tslib_1.__importDefault(require("."));
test("wait", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var wait;
    var _this = this;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wait = new _1.default();
                return [4 /*yield*/, Promise.all([
                        new Promise(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a, exist, result;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, wait.create("test", function () { return new Promise(function (r) { return setTimeout(function () { return r("solve"); }, 1000); }); })];
                                    case 1:
                                        _a = _b.sent(), exist = _a.exist, result = _a.result;
                                        expect(exist).toBe(undefined);
                                        if (result) {
                                            expect(result).toBe("solve");
                                            r();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }),
                        new Promise(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a, exist, result, res;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, wait.create("test", function () { return new Promise(function (r) { return setTimeout(function () { return r("solve2"); }, 1000); }); })];
                                    case 1:
                                        _a = _b.sent(), exist = _a.exist, result = _a.result;
                                        expect(result).toBe(undefined);
                                        if (!exist) return [3 /*break*/, 3];
                                        return [4 /*yield*/, exist.asPromise()];
                                    case 2:
                                        res = _b.sent();
                                        expect(res).toBe("solve");
                                        r();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })
                    ])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=test.js.map