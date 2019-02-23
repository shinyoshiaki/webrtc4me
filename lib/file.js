"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSliceArrayBuffer = getSliceArrayBuffer;
exports.default = void 0;

var _rxjs = require("rxjs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var chunkSize = 16000;

function getSliceArrayBuffer(blob) {
  var subject = new _rxjs.Subject();
  var state = subject.asObservable();
  var r = new FileReader(),
      blobSlice = File.prototype.slice,
      chunks = Math.ceil(blob.size / chunkSize);
  var currentChunk = 0;

  r.onerror = function (e) {
    subject.error(e);
  };

  r.onload = function (e) {
    var chunk = e.target.result;
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
      subject.next(chunk);
    } else {
      subject.complete();
    }
  };

  function loadNext() {
    var start = currentChunk * chunkSize;
    var end = start + chunkSize >= blob.size ? blob.size : start + chunkSize;
    r.readAsArrayBuffer(blobSlice.call(blob, start, end));
  }

  loadNext();
  return state;
}

var FileShare =
/*#__PURE__*/
function () {
  function FileShare(peer, label) {
    var _this = this;

    _classCallCheck(this, FileShare);

    this.peer = peer;
    this.label = label;

    _defineProperty(this, "subject", new _rxjs.Subject());

    _defineProperty(this, "state", this.subject.asObservable());

    _defineProperty(this, "chunks", []);

    _defineProperty(this, "name", "");

    _defineProperty(this, "size", 0);

    if (!label) label = "file";
    peer.onData.subscribe(function (raw) {
      var label = raw.label,
          data = raw.data;

      if (label === _this.label) {
        try {
          var obj = JSON.parse(data);

          switch (obj.state) {
            case "start":
              _this.chunks = [];
              _this.name = obj.name;
              _this.size = obj.size;
              break;

            case "end":
              _this.subject.next({
                type: "downloaded",
                payload: {
                  chunks: _this.chunks,
                  name: _this.name
                }
              });

              _this.chunks = [];
              _this.name = "";
              break;
          }
        } catch (error) {
          _this.chunks.push(data);

          _this.subject.next({
            type: "downloading",
            payload: {
              now: _this.chunks.length * chunkSize,
              size: _this.size
            }
          });
        }
      }
    });
  }

  _createClass(FileShare, [{
    key: "sendStart",
    value: function sendStart(name, size) {
      this.peer.send(JSON.stringify({
        state: "start",
        size: size,
        name: name
      }), this.label);
    }
  }, {
    key: "sendChunk",
    value: function sendChunk(chunk) {
      this.peer.send(chunk, this.label);
    }
  }, {
    key: "sendEnd",
    value: function sendEnd() {
      this.peer.send(JSON.stringify({
        state: "end"
      }), this.label);
    }
  }, {
    key: "send",
    value: function send(blob) {
      var _this2 = this;

      this.sendStart(blob.name, blob.size);
      getSliceArrayBuffer(blob).subscribe(function (chunk) {
        return _this2.sendChunk(chunk);
      }, function () {}, function () {
        _this2.sendEnd();
      });
    }
  }]);

  return FileShare;
}();

exports.default = FileShare;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLnRzIl0sIm5hbWVzIjpbImNodW5rU2l6ZSIsImdldFNsaWNlQXJyYXlCdWZmZXIiLCJibG9iIiwic3ViamVjdCIsIlN1YmplY3QiLCJzdGF0ZSIsImFzT2JzZXJ2YWJsZSIsInIiLCJGaWxlUmVhZGVyIiwiYmxvYlNsaWNlIiwiRmlsZSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2h1bmtzIiwiTWF0aCIsImNlaWwiLCJzaXplIiwiY3VycmVudENodW5rIiwib25lcnJvciIsImUiLCJlcnJvciIsIm9ubG9hZCIsImNodW5rIiwidGFyZ2V0IiwicmVzdWx0IiwibG9hZE5leHQiLCJuZXh0IiwiY29tcGxldGUiLCJzdGFydCIsImVuZCIsInJlYWRBc0FycmF5QnVmZmVyIiwiY2FsbCIsIkZpbGVTaGFyZSIsInBlZXIiLCJsYWJlbCIsIm9uRGF0YSIsInN1YnNjcmliZSIsInJhdyIsImRhdGEiLCJvYmoiLCJKU09OIiwicGFyc2UiLCJuYW1lIiwidHlwZSIsInBheWxvYWQiLCJwdXNoIiwibm93IiwibGVuZ3RoIiwic2VuZCIsInN0cmluZ2lmeSIsInNlbmRTdGFydCIsInNlbmRDaHVuayIsInNlbmRFbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsS0FBbEI7O0FBRU8sU0FBU0MsbUJBQVQsQ0FBNkJDLElBQTdCLEVBQTBEO0FBQy9ELE1BQU1DLE9BQU8sR0FBRyxJQUFJQyxhQUFKLEVBQWhCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHRixPQUFPLENBQUNHLFlBQVIsRUFBZDtBQUVBLE1BQU1DLENBQUMsR0FBRyxJQUFJQyxVQUFKLEVBQVY7QUFBQSxNQUNFQyxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsU0FBTCxDQUFlQyxLQUQ3QjtBQUFBLE1BRUVDLE1BQU0sR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVViLElBQUksQ0FBQ2MsSUFBTCxHQUFZaEIsU0FBdEIsQ0FGWDtBQUdBLE1BQUlp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QUNELE9BTEg7QUFPRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXZWJSVEMgZnJvbSBcIi4vY29yZVwiO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzXCI7XG5cbmNvbnN0IGNodW5rU2l6ZSA9IDE2MDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2xpY2VBcnJheUJ1ZmZlcihibG9iOiBCbG9iKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgY29uc3Qgc3ViamVjdCA9IG5ldyBTdWJqZWN0PEFjdGlvbnM+KCk7XG4gIGNvbnN0IHN0YXRlID0gc3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBjb25zdCByID0gbmV3IEZpbGVSZWFkZXIoKSxcbiAgICBibG9iU2xpY2UgPSBGaWxlLnByb3RvdHlwZS5zbGljZSxcbiAgICBjaHVua3MgPSBNYXRoLmNlaWwoYmxvYi5zaXplIC8gY2h1bmtTaXplKTtcbiAgbGV0IGN1cnJlbnRDaHVuayA9IDA7XG4gIHIub25lcnJvciA9IGUgPT4ge1xuICAgIHN1YmplY3QuZXJyb3IoZSk7XG4gIH07XG4gIHIub25sb2FkID0gZSA9PiB7XG4gICAgY29uc3QgY2h1bmsgPSAoZS50YXJnZXQgYXMgYW55KS5yZXN1bHQ7XG4gICAgY3VycmVudENodW5rKys7XG4gICAgaWYgKGN1cnJlbnRDaHVuayA8IGNodW5rcykge1xuICAgICAgbG9hZE5leHQoKTtcbiAgICAgIHN1YmplY3QubmV4dChjaHVuayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGxvYWROZXh0KCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gY3VycmVudENodW5rICogY2h1bmtTaXplO1xuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgY2h1bmtTaXplID49IGJsb2Iuc2l6ZSA/IGJsb2Iuc2l6ZSA6IHN0YXJ0ICsgY2h1bmtTaXplO1xuICAgIHIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYlNsaWNlLmNhbGwoYmxvYiwgc3RhcnQsIGVuZCkpO1xuICB9XG4gIGxvYWROZXh0KCk7XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuaW50ZXJmYWNlIEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgcGF5bG9hZDogYW55O1xufVxuXG5pbnRlcmZhY2UgRG93bmxvYWRpbmcgZXh0ZW5kcyBBY3Rpb24ge1xuICB0eXBlOiBcImRvd25sb2FkaW5nXCI7XG4gIHBheWxvYWQ6IHsgbm93OiBudW1iZXI7IHNpemU6IG51bWJlciB9O1xufVxuXG5pbnRlcmZhY2UgRG93bmxvYWRlZCBleHRlbmRzIEFjdGlvbiB7XG4gIHR5cGU6IFwiZG93bmxvYWRlZFwiO1xuICBwYXlsb2FkOiB7IGNodW5rczogQXJyYXlCdWZmZXJbXTsgbmFtZTogc3RyaW5nIH07XG59XG5cbnR5cGUgQWN0aW9ucyA9IERvd25sb2FkaW5nIHwgRG93bmxvYWRlZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVNoYXJlIHtcbiAgc3ViamVjdCA9IG5ldyBTdWJqZWN0PEFjdGlvbnM+KCk7XG4gIHN0YXRlID0gdGhpcy5zdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgY2h1bmtzOiBBcnJheUJ1ZmZlcltdID0gW107XG4gIHByaXZhdGUgbmFtZTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBzaXplOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGVlcjogV2ViUlRDLCBwcml2YXRlIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgaWYgKCFsYWJlbCkgbGFiZWwgPSBcImZpbGVcIjtcblxuICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgY29uc3QgeyBsYWJlbCwgZGF0YSB9ID0gcmF3O1xuICAgICAgaWYgKGxhYmVsID09PSB0aGlzLmxhYmVsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICBzd2l0Y2ggKG9iai5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBcInN0YXJ0XCI6XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IG9iai5uYW1lO1xuICAgICAgICAgICAgICB0aGlzLnNpemUgPSBvYmouc2l6ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkZWRcIixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGNodW5rczogdGhpcy5jaHVua3MsIG5hbWU6IHRoaXMubmFtZSB9XG4gICAgICAgICAgICAgIH0gYXMgRG93bmxvYWRlZCk7XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmNodW5rcy5wdXNoKGRhdGEpO1xuICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIHR5cGU6IFwiZG93bmxvYWRpbmdcIixcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgbm93OiB0aGlzLmNodW5rcy5sZW5ndGggKiBjaHVua1NpemUsIHNpemU6IHRoaXMuc2l6ZSB9XG4gICAgICAgICAgfSBhcyBEb3dubG9hZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTdGFydChuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlcikge1xuICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdGU6IFwic3RhcnRcIiwgc2l6ZSwgbmFtZSB9KSwgdGhpcy5sYWJlbCk7XG4gIH1cblxuICBzZW5kQ2h1bmsoY2h1bms6IEFycmF5QnVmZmVyKSB7XG4gICAgdGhpcy5wZWVyLnNlbmQoY2h1bmssIHRoaXMubGFiZWwpO1xuICB9XG5cbiAgc2VuZEVuZCgpIHtcbiAgICB0aGlzLnBlZXIuc2VuZChKU09OLnN0cmluZ2lmeSh7IHN0YXRlOiBcImVuZFwiIH0pLCB0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHNlbmQoYmxvYjogRmlsZSkge1xuICAgIHRoaXMuc2VuZFN0YXJ0KGJsb2IubmFtZSwgYmxvYi5zaXplKTtcbiAgICBnZXRTbGljZUFycmF5QnVmZmVyKGJsb2IpLnN1YnNjcmliZShcbiAgICAgIGNodW5rID0+IHRoaXMuc2VuZENodW5rKGNodW5rKSxcbiAgICAgICgpID0+IHt9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbmRFbmQoKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=