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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLnRzIl0sIm5hbWVzIjpbImNodW5rU2l6ZSIsImdldFNsaWNlQXJyYXlCdWZmZXIiLCJibG9iIiwic3ViamVjdCIsIlN1YmplY3QiLCJzdGF0ZSIsImFzT2JzZXJ2YWJsZSIsInIiLCJGaWxlUmVhZGVyIiwiYmxvYlNsaWNlIiwiRmlsZSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2h1bmtzIiwiTWF0aCIsImNlaWwiLCJzaXplIiwiY3VycmVudENodW5rIiwib25lcnJvciIsImUiLCJlcnJvciIsIm9ubG9hZCIsImNodW5rIiwidGFyZ2V0IiwicmVzdWx0IiwibG9hZE5leHQiLCJuZXh0IiwiY29tcGxldGUiLCJzdGFydCIsImVuZCIsInJlYWRBc0FycmF5QnVmZmVyIiwiY2FsbCIsIkZpbGVTaGFyZSIsInBlZXIiLCJsYWJlbCIsImNvbnNvbGUiLCJsb2ciLCJvbkRhdGEiLCJzdWJzY3JpYmUiLCJyYXciLCJkYXRhIiwib2JqIiwiSlNPTiIsInBhcnNlIiwibmFtZSIsInR5cGUiLCJwYXlsb2FkIiwic2VuZCIsInN0cmluZ2lmeSIsInB1c2giLCJub3ciLCJsZW5ndGgiLCJzZW5kU3RhcnQiLCJzZW5kQ2h1bmsiLCJzZW5kRW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHLEtBQWxCOztBQUVPLFNBQVNDLG1CQUFULENBQTZCQyxJQUE3QixFQUEwRDtBQUMvRCxNQUFNQyxPQUFPLEdBQUcsSUFBSUMsYUFBSixFQUFoQjtBQUNBLE1BQU1DLEtBQUssR0FBR0YsT0FBTyxDQUFDRyxZQUFSLEVBQWQ7QUFFQSxNQUFNQyxDQUFDLEdBQUcsSUFBSUMsVUFBSixFQUFWO0FBQUEsTUFDRUMsU0FBUyxHQUFHQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsS0FEN0I7QUFBQSxNQUVFQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVYixJQUFJLENBQUNjLElBQUwsR0FBWWhCLFNBQXRC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Ozt5QkFFSWhDLEksRUFBWTtBQUFBOztBQUNmLFdBQUtrRCxTQUFMLENBQWVsRCxJQUFJLENBQUMwQyxJQUFwQixFQUEwQjFDLElBQUksQ0FBQ2MsSUFBL0I7QUFDQWYsTUFBQUEsbUJBQW1CLENBQUNDLElBQUQsQ0FBbkIsQ0FBMEJvQyxTQUExQixDQUNFLFVBQUFoQixLQUFLO0FBQUEsZUFBSSxNQUFJLENBQUMrQixTQUFMLENBQWUvQixLQUFmLENBQUo7QUFBQSxPQURQLEVBRUUsWUFBTSxDQUFFLENBRlYsRUFHRSxZQUFNO0FBQ0osUUFBQSxNQUFJLENBQUNnQyxPQUFMO0FBQ0QsT0FMSDtBQU9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuY29uc3QgY2h1bmtTaXplID0gMTYwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbGljZUFycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgY29uc3Qgc3RhdGUgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgIGJsb2JTbGljZSA9IEZpbGUucHJvdG90eXBlLnNsaWNlLFxuICAgIGNodW5rcyA9IE1hdGguY2VpbChibG9iLnNpemUgLyBjaHVua1NpemUpO1xuICBsZXQgY3VycmVudENodW5rID0gMDtcbiAgci5vbmVycm9yID0gZSA9PiB7XG4gICAgc3ViamVjdC5lcnJvcihlKTtcbiAgfTtcbiAgci5vbmxvYWQgPSBlID0+IHtcbiAgICBjb25zdCBjaHVuayA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcbiAgICBjdXJyZW50Q2h1bmsrKztcbiAgICBpZiAoY3VycmVudENodW5rIDwgY2h1bmtzKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgICAgc3ViamVjdC5uZXh0KGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gbG9hZE5leHQoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBjdXJyZW50Q2h1bmsgKiBjaHVua1NpemU7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua1NpemUgPj0gYmxvYi5zaXplID8gYmxvYi5zaXplIDogc3RhcnQgKyBjaHVua1NpemU7XG4gICAgci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iU2xpY2UuY2FsbChibG9iLCBzdGFydCwgZW5kKSk7XG4gIH1cbiAgbG9hZE5leHQoKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5pbnRlcmZhY2UgQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBwYXlsb2FkOiBhbnk7XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGluZyBleHRlbmRzIEFjdGlvbiB7XG4gIHR5cGU6IFwiZG93bmxvYWRpbmdcIjtcbiAgcGF5bG9hZDogeyBub3c6IG51bWJlcjsgc2l6ZTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGVkIGV4dGVuZHMgQWN0aW9uIHtcbiAgdHlwZTogXCJkb3dubG9hZGVkXCI7XG4gIHBheWxvYWQ6IHsgY2h1bmtzOiBBcnJheUJ1ZmZlcltdOyBuYW1lOiBzdHJpbmcgfTtcbn1cblxudHlwZSBBY3Rpb25zID0gRG93bmxvYWRpbmcgfCBEb3dubG9hZGVkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU2hhcmUge1xuICBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgc3RhdGUgPSB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSBjaHVua3M6IEFycmF5QnVmZmVyW10gPSBbXTtcbiAgcHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgc2l6ZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlZXI6IFdlYlJUQywgcHVibGljIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgaWYgKCFsYWJlbCkgbGFiZWwgPSBcImZpbGVcIjtcbiAgICBjb25zb2xlLmxvZyh7IGxhYmVsIH0pO1xuICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgY29uc3QgeyBsYWJlbCwgZGF0YSB9ID0gcmF3O1xuICAgICAgaWYgKGxhYmVsID09PSB0aGlzLmxhYmVsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICBzd2l0Y2ggKG9iai5zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBcInN0YXJ0XCI6XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IG9iai5uYW1lO1xuICAgICAgICAgICAgICB0aGlzLnNpemUgPSBvYmouc2l6ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkZWRcIixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGNodW5rczogdGhpcy5jaHVua3MsIG5hbWU6IHRoaXMubmFtZSB9XG4gICAgICAgICAgICAgIH0gYXMgRG93bmxvYWRlZCk7XG4gICAgICAgICAgICAgIHBlZXIuc2VuZChcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IHN0YXRlOiBcImNvbXBsZXRlXCIsIG5hbWU6IHRoaXMubmFtZSB9KSxcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gW107XG4gICAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmNodW5rcy5wdXNoKGRhdGEpO1xuICAgICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIHR5cGU6IFwiZG93bmxvYWRpbmdcIixcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgbm93OiB0aGlzLmNodW5rcy5sZW5ndGggKiBjaHVua1NpemUsIHNpemU6IHRoaXMuc2l6ZSB9XG4gICAgICAgICAgfSBhcyBEb3dubG9hZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTdGFydChuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlcikge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzdGF0ZTogXCJzdGFydFwiLCBzaXplLCBuYW1lIH0pLCB0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHNlbmRDaHVuayhjaHVuazogQXJyYXlCdWZmZXIpIHtcbiAgICB0aGlzLnBlZXIuc2VuZChjaHVuaywgdGhpcy5sYWJlbCk7XG4gIH1cblxuICBzZW5kRW5kKCkge1xuICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdGU6IFwiZW5kXCIgfSksIHRoaXMubGFiZWwpO1xuICB9XG5cbiAgc2VuZChibG9iOiBGaWxlKSB7XG4gICAgdGhpcy5zZW5kU3RhcnQoYmxvYi5uYW1lLCBibG9iLnNpemUpO1xuICAgIGdldFNsaWNlQXJyYXlCdWZmZXIoYmxvYikuc3Vic2NyaWJlKFxuICAgICAgY2h1bmsgPT4gdGhpcy5zZW5kQ2h1bmsoY2h1bmspLFxuICAgICAgKCkgPT4ge30sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZEVuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==