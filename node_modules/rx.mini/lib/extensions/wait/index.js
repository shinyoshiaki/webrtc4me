"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var __1 = tslib_1.__importDefault(require("../../"));
var Wait = /** @class */ (function () {
    function Wait() {
        this.candidates = {};
    }
    Wait.prototype.exist = function (id) {
        return Object.keys(this.candidates).includes(id);
    };
    Wait.prototype.delete = function (kid) {
        delete this.candidates[kid];
    };
    Wait.prototype.create = function (id, job) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var event_1, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.exist(id)) return [3 /*break*/, 1];
                        return [2 /*return*/, { exist: this.candidates[id] }];
                    case 1:
                        event_1 = new __1.default();
                        this.candidates[id] = event_1;
                        return [4 /*yield*/, job()];
                    case 2:
                        result = _a.sent();
                        event_1.execute(result);
                        this.delete(id);
                        return [2 /*return*/, { result: result }];
                }
            });
        });
    };
    return Wait;
}());
exports.default = Wait;
//# sourceMappingURL=index.js.map