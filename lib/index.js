"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("./core"));
var stream_1 = tslib_1.__importDefault(require("./modules/stream"));
exports.Stream = stream_1.default;
var file_1 = tslib_1.__importDefault(require("./modules/file"));
exports.FileShare = file_1.default;
var media_1 = require("./utill/media");
exports.getLocalVideo = media_1.getLocalVideo;
var arraybuffer_1 = require("./utill/arraybuffer");
exports.blob2Arraybuffer = arraybuffer_1.blob2Arraybuffer;
var filequick_1 = tslib_1.__importDefault(require("./modules/filequick"));
exports.SendFile = filequick_1.default;
exports.default = core_1.default;
//# sourceMappingURL=index.js.map