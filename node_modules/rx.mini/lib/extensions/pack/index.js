"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("../../core"));
function Pack() {
    var events = [];
    var event = function () {
        var e = new core_1.default();
        events.push(e);
        return e;
    };
    var finishAll = function () {
        events.forEach(function (e) { return e.allUnsubscribe(); });
        events = [];
    };
    return { event: event, finishAll: finishAll };
}
exports.default = Pack;
//# sourceMappingURL=index.js.map