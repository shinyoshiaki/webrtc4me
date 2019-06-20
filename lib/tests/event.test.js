"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rx_mini_1 = tslib_1.__importDefault(require("rx.mini"));
describe("event", function () {
    test("subscribe", function () {
        var testEvent = new rx_mini_1.default();
        var unSubscribe = testEvent.subscribe(function (data) {
            expect(data.msg).toBe("1");
        }).unSubscribe;
        testEvent.subscribe(function (data) {
            expect(data.msg).toBe("1");
        });
        testEvent.execute({ msg: "1" });
        expect(testEvent.event.stack.length).toBe(2);
        unSubscribe();
        expect(testEvent.event.stack.length).toBe(1);
        testEvent.once(function () {
            expect(testEvent.event.stack.length).toBe(1);
        });
        expect(testEvent.event.stack.length).toBe(2);
        testEvent.execute({ msg: "1" });
    });
    test("aspromise", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var testEvent, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testEvent = new rx_mini_1.default();
                    setTimeout(function () {
                        testEvent.execute(1);
                    }, 0);
                    return [4 /*yield*/, testEvent.asPromise()];
                case 1:
                    res = _a.sent();
                    expect(res).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=event.test.js.map