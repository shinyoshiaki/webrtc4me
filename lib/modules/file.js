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
    console.log({
      label: label
    });
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

              peer.send(JSON.stringify({
                state: "complete",
                name: _this.name
              }), _this.label);
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
      this.name = name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL2ZpbGUudHMiXSwibmFtZXMiOlsiY2h1bmtTaXplIiwiZ2V0U2xpY2VBcnJheUJ1ZmZlciIsImJsb2IiLCJzdWJqZWN0IiwiU3ViamVjdCIsInN0YXRlIiwiYXNPYnNlcnZhYmxlIiwiciIsIkZpbGVSZWFkZXIiLCJibG9iU2xpY2UiLCJGaWxlIiwicHJvdG90eXBlIiwic2xpY2UiLCJjaHVua3MiLCJNYXRoIiwiY2VpbCIsInNpemUiLCJjdXJyZW50Q2h1bmsiLCJvbmVycm9yIiwiZSIsImVycm9yIiwib25sb2FkIiwiY2h1bmsiLCJ0YXJnZXQiLCJyZXN1bHQiLCJsb2FkTmV4dCIsIm5leHQiLCJjb21wbGV0ZSIsInN0YXJ0IiwiZW5kIiwicmVhZEFzQXJyYXlCdWZmZXIiLCJjYWxsIiwiRmlsZVNoYXJlIiwicGVlciIsImxhYmVsIiwiY29uc29sZSIsImxvZyIsIm9uRGF0YSIsInN1YnNjcmliZSIsInJhdyIsImRhdGEiLCJvYmoiLCJKU09OIiwicGFyc2UiLCJuYW1lIiwidHlwZSIsInBheWxvYWQiLCJzZW5kIiwic3RyaW5naWZ5IiwicHVzaCIsIm5vdyIsImxlbmd0aCIsInNlbmRTdGFydCIsInNlbmRDaHVuayIsInNlbmRFbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsS0FBbEI7O0FBRU8sU0FBU0MsbUJBQVQsQ0FBNkJDLElBQTdCLEVBQTBEO0FBQy9ELE1BQU1DLE9BQU8sR0FBRyxJQUFJQyxhQUFKLEVBQWhCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHRixPQUFPLENBQUNHLFlBQVIsRUFBZDtBQUVBLE1BQU1DLENBQUMsR0FBRyxJQUFJQyxVQUFKLEVBQVY7QUFBQSxNQUNFQyxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsU0FBTCxDQUFlQyxLQUQ3QjtBQUFBLE1BRUVDLE1BQU0sR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVViLElBQUksQ0FBQ2MsSUFBTCxH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S0FBdEQ7QUFDRDs7O3lCQUVJaEMsSSxFQUFZO0FBQUE7O0FBQ2YsV0FBS2tELFNBQUwsQ0FBZWxELElBQUksQ0FBQzBDLElBQXBCLEVBQTBCMUMsSUFBSSxDQUFDYyxJQUEvQjtBQUNBZixNQUFBQSxtQkFBbUIsQ0FBQ0MsSUFBRCxDQUFuQixDQUEwQm9DLFNBQTFCLENBQ0UsVUFBQWhCLEtBQUs7QUFBQSxlQUFJLE1BQUksQ0FBQytCLFNBQUwsQ0FBZS9CLEtBQWYsQ0FBSjtBQUFBLE9BRFAsRUFFRSxZQUFNLENBQUUsQ0FGVixFQUdFLFlBQU07QUFDSixRQUFBLE1BQUksQ0FBQ2dDLE9BQUw7QUFDRCxPQUxIO0FBT0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2ViUlRDIGZyb20gXCIuLi9jb3JlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuY29uc3QgY2h1bmtTaXplID0gMTYwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbGljZUFycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgY29uc3Qgc3RhdGUgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgIGJsb2JTbGljZSA9IEZpbGUucHJvdG90eXBlLnNsaWNlLFxuICAgIGNodW5rcyA9IE1hdGguY2VpbChibG9iLnNpemUgLyBjaHVua1NpemUpO1xuICBsZXQgY3VycmVudENodW5rID0gMDtcbiAgci5vbmVycm9yID0gZSA9PiB7XG4gICAgc3ViamVjdC5lcnJvcihlKTtcbiAgfTtcbiAgci5vbmxvYWQgPSBlID0+IHtcbiAgICBjb25zdCBjaHVuayA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcbiAgICBjdXJyZW50Q2h1bmsrKztcbiAgICBpZiAoY3VycmVudENodW5rIDwgY2h1bmtzKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgICAgc3ViamVjdC5uZXh0KGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gbG9hZE5leHQoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBjdXJyZW50Q2h1bmsgKiBjaHVua1NpemU7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua1NpemUgPj0gYmxvYi5zaXplID8gYmxvYi5zaXplIDogc3RhcnQgKyBjaHVua1NpemU7XG4gICAgci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iU2xpY2UuY2FsbChibG9iLCBzdGFydCwgZW5kKSk7XG4gIH1cbiAgbG9hZE5leHQoKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5pbnRlcmZhY2UgQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBwYXlsb2FkOiBhbnk7XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGluZyBleHRlbmRzIEFjdGlvbiB7XG4gIHR5cGU6IFwiZG93bmxvYWRpbmdcIjtcbiAgcGF5bG9hZDogeyBub3c6IG51bWJlcjsgc2l6ZTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGVkIGV4dGVuZHMgQWN0aW9uIHtcbiAgdHlwZTogXCJkb3dubG9hZGVkXCI7XG4gIHBheWxvYWQ6IHsgY2h1bmtzOiBBcnJheUJ1ZmZlcltdOyBuYW1lOiBzdHJpbmcgfTtcbn1cblxudHlwZSBBY3Rpb25zID0gRG93bmxvYWRpbmcgfCBEb3dubG9hZGVkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU2hhcmUge1xuICBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgc3RhdGUgPSB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSBjaHVua3M6IEFycmF5QnVmZmVyW10gPSBbXTtcbiAgcHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgc2l6ZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlZXI6IFdlYlJUQywgcHVibGljIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgaWYgKCFsYWJlbCkgbGFiZWwgPSBcImZpbGVcIjtcbiAgICBjb25zb2xlLmxvZyh7IGxhYmVsIH0pO1xuICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgY29uc3QgeyBsYWJlbCwgZGF0YSB9ID0gcmF3O1xuICAgICAgaWYgKGxhYmVsID09PSB0aGlzLmxhYmVsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICBzd2l0Y2ggKG9iai5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBcInN0YXJ0XCI6XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IG9iai5uYW1lO1xuICAgICAgICAgICAgICB0aGlzLnNpemUgPSBvYmouc2l6ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkZWRcIixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGNodW5rczogdGhpcy5jaHVua3MsIG5hbWU6IHRoaXMubmFtZSB9XG4gICAgICAgICAgICAgIH0gYXMgRG93bmxvYWRlZCk7XG4gICAgICAgICAgICAgIHBlZXIuc2VuZChcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IHN0YXRlOiBcImNvbXBsZXRlXCIsIG5hbWU6IHRoaXMubmFtZSB9KSxcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmNodW5rcy5wdXNoKGRhdGEpO1xuICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIHR5cGU6IFwiZG93bmxvYWRpbmdcIixcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgbm93OiB0aGlzLmNodW5rcy5sZW5ndGggKiBjaHVua1NpemUsIHNpemU6IHRoaXMuc2l6ZSB9XG4gICAgICAgICAgfSBhcyBEb3dubG9hZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTdGFydChuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlcikge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzdGF0ZTogXCJzdGFydFwiLCBzaXplLCBuYW1lIH0pLCB0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHNlbmRDaHVuayhjaHVuazogQXJyYXlCdWZmZXIpIHtcbiAgICB0aGlzLnBlZXIuc2VuZChjaHVuaywgdGhpcy5sYWJlbCk7XG4gIH1cblxuICBzZW5kRW5kKCkge1xuICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdGU6IFwiZW5kXCIgfSksIHRoaXMubGFiZWwpO1xuICB9XG5cbiAgc2VuZChibG9iOiBGaWxlKSB7XG4gICAgdGhpcy5zZW5kU3RhcnQoYmxvYi5uYW1lLCBibG9iLnNpemUpO1xuICAgIGdldFNsaWNlQXJyYXlCdWZmZXIoYmxvYikuc3Vic2NyaWJlKFxuICAgICAgY2h1bmsgPT4gdGhpcy5zZW5kQ2h1bmsoY2h1bmspLFxuICAgICAgKCkgPT4ge30sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZEVuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==