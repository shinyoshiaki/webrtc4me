"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rx_mini_1 = tslib_1.__importDefault(require("rx.mini"));
var chunkSize = 16000;
var FileShare = /** @class */ (function () {
    function FileShare(peer, label) {
        var _this = this;
        this.peer = peer;
        this.label = label;
        this.chunks = [];
        this.name = "";
        this.size = 0;
        this.event = new rx_mini_1.default();
        if (!label)
            label = "file";
        peer.onData.subscribe(function (raw) {
            var label = raw.label, data = raw.data;
            if (label === _this.label) {
                if (typeof data === "string") {
                    var obj = JSON.parse(data);
                    switch (obj.state) {
                        case "start":
                            _this.chunks = [];
                            _this.name = obj.name;
                            _this.size = obj.size;
                            break;
                        case "end":
                            _this.event.execute(Downloaded(_this.chunks, _this.name));
                            peer.send(JSON.stringify({ state: "complete", name: _this.name }), _this.label);
                            _this.chunks = [];
                            _this.name = "";
                            break;
                    }
                }
                else {
                    _this.chunks.push(data);
                    _this.event.execute(Downloading(_this.chunks.length * chunkSize, _this.size));
                }
            }
        });
    }
    FileShare.prototype.sendStart = function (name, size) {
        this.name = name;
        this.peer.send(JSON.stringify({ state: "start", size: size, name: name }), this.label);
    };
    FileShare.prototype.sendChunk = function (chunk) {
        this.peer.send(chunk, this.label);
    };
    FileShare.prototype.sendEnd = function () {
        this.peer.send(JSON.stringify({ state: "end" }), this.label);
    };
    FileShare.prototype.send = function (blob) {
        var _this = this;
        this.sendStart(blob.name, blob.size);
        getSliceArrayBuffer(blob).subscribe(function (chunk) { return _this.sendChunk(chunk); }, function () { return _this.sendEnd(); });
    };
    return FileShare;
}());
exports.default = FileShare;
function getSliceArrayBuffer(blob) {
    var subject = new rx_mini_1.default();
    var r = new FileReader(), blobSlice = File.prototype.slice, chunknum = Math.ceil(blob.size / chunkSize);
    var currentChunk = 0;
    r.onerror = function (e) {
        subject.error(e);
    };
    r.onload = function (e) {
        var chunk = e.target.result;
        currentChunk++;
        if (currentChunk <= chunknum) {
            loadNext();
            subject.execute(chunk);
        }
        else {
            subject.complete();
        }
    };
    function loadNext() {
        var start = currentChunk * chunkSize;
        var end = start + chunkSize >= blob.size ? blob.size : start + chunkSize;
        r.readAsArrayBuffer(blobSlice.call(blob, start, end));
    }
    loadNext();
    return subject;
}
var Downloading = function (now, size) { return ({
    type: "downloading",
    payload: { now: now, size: size }
}); };
var Downloaded = function (chunks, name) { return ({
    type: "downloaded",
    payload: { chunks: chunks, name: name }
}); };
//# sourceMappingURL=file.js.map