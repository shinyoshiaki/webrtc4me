"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("../../core"));
function Buffer(length, event) {
    var observable = new core_1.default();
    var pool = [];
    var fulled = false;
    event.subscribe(function (e) {
        if (!fulled && pool.length === length) {
            pool.forEach(observable.execute);
            fulled = true;
        }
        if (fulled) {
            observable.execute(e);
        }
        else {
            pool.push(e);
        }
    });
    var subscribe = observable.subscribe, asPromise = observable.asPromise, once = observable.once;
    return { subscribe: subscribe, asPromise: asPromise, once: once };
}
exports.Buffer = Buffer;
//# sourceMappingURL=index.js.map