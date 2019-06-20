"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arraybuffer_1 = tslib_1.__importDefault(require("./arraybuffer"));
function SetupServices() {
    var arrayBufferService = new arraybuffer_1.default();
    return { arrayBufferService: arrayBufferService };
}
exports.default = SetupServices;
//# sourceMappingURL=index.js.map