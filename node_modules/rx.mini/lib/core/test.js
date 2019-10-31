"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _1 = tslib_1.__importDefault(require("."));
describe("event", function () {
    test("subscribe", function () {
        var testEvent = new _1.default();
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
                    testEvent = new _1.default();
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
    test("complete", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var event, trigger, listener, res, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event = new _1.default();
                    trigger = event.returnTrigger;
                    listener = event.returnListener;
                    setTimeout(function () { return trigger.execute(0); }, 0);
                    return [4 /*yield*/, listener.asPromise()];
                case 1:
                    res = _a.sent();
                    expect(typeof res).toBe("number");
                    setTimeout(function () { return trigger.complete(); }, 0);
                    return [4 /*yield*/, listener.asPromise()];
                case 2:
                    res = _a.sent();
                    expect(typeof res).toBe("undefined");
                    return [2 /*return*/];
            }
        });
    }); });
    test("test-error", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var event, res, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event = new _1.default();
                    setTimeout(function () { return event.execute(1); }, 0);
                    return [4 /*yield*/, event.asPromise()];
                case 1:
                    res = _a.sent();
                    expect(typeof res).toBe("number");
                    setTimeout(function () { return event.error("error"); }, 0);
                    return [4 /*yield*/, event.asPromise().catch(function (e) { return e; })];
                case 2:
                    res = _a.sent();
                    expect(res).toBe("error");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=test.js.map