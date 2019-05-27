"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Count(times, resolve) {
    var count = 0;
    var check = function () {
        count++;
        if (count === times)
            resolve();
    };
    return check;
}
exports.Count = Count;
//# sourceMappingURL=testtools.js.map