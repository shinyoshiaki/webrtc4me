"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("../../core"));
var _1 = require(".");
test("buffer", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var event, pool, i;
    return tslib_1.__generator(this, function (_a) {
        event = new core_1.default();
        pool = _1.Buffer(3, event);
        i = 0;
        pool.subscribe(function (v) {
            expect(i > 3).toBe(true);
        });
        event.execute(i++);
        event.execute(i++);
        event.execute(i++);
        event.execute(i++);
        event.execute(i++);
        event.execute(i++);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=test.js.map