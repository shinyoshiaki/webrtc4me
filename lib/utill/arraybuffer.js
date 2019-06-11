"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sliceArraybuffer(arrayBuffer, segmentSize) {
    var segments = [];
    var fi = 0;
    while (fi * segmentSize < arrayBuffer.byteLength) {
        segments.push(arrayBuffer.slice(fi * segmentSize, (fi + 1) * segmentSize));
        ++fi;
    }
    return segments;
}
exports.sliceArraybuffer = sliceArraybuffer;
function mergeArraybuffer(segments) {
    var sumLength = 0;
    for (var i = 0; i < segments.length; ++i) {
        sumLength += segments[i].byteLength;
    }
    var whole = new Uint8Array(sumLength);
    var pos = 0;
    for (var i = 0; i < segments.length; ++i) {
        whole.set(new Uint8Array(segments[i]), pos);
        pos += segments[i].byteLength;
    }
    return whole.buffer;
}
exports.mergeArraybuffer = mergeArraybuffer;
exports.blob2Arraybuffer = function (blob) {
    return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onerror = function (e) { return reject(e); };
        r.onload = function (e) { return resolve(e.target.result); };
        r.readAsArrayBuffer(blob);
    });
};
//# sourceMappingURL=arraybuffer.js.map