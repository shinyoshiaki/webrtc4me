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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLnRzIl0sIm5hbWVzIjpbImNodW5rU2l6ZSIsImdldFNsaWNlQXJyYXlCdWZmZXIiLCJibG9iIiwic3ViamVjdCIsIlN1YmplY3QiLCJzdGF0ZSIsImFzT2JzZXJ2YWJsZSIsInIiLCJGaWxlUmVhZGVyIiwiYmxvYlNsaWNlIiwiRmlsZSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2h1bmtzIiwiTWF0aCIsImNlaWwiLCJzaXplIiwiY3VycmVudENodW5rIiwib25lcnJvciIsImUiLCJlcnJvciIsIm9ubG9hZCIsImNodW5rIiwidGFyZ2V0IiwicmVzdWx0IiwibG9hZE5leHQiLCJuZXh0IiwiY29tcGxldGUiLCJzdGFydCIsImVuZCIsInJlYWRBc0FycmF5QnVmZmVyIiwiY2FsbCIsIkZpbGVTaGFyZSIsInBlZXIiLCJsYWJlbCIsIm9uRGF0YSIsInN1YnNjcmliZSIsInJhdyIsImRhdGEiLCJvYmoiLCJKU09OIiwicGFyc2UiLCJuYW1lIiwidHlwZSIsInBheWxvYWQiLCJwdXNoIiwibm93IiwibGVuZ3RoIiwic2VuZCIsInN0cmluZ2lmeSIsInNlbmRTdGFydCIsInNlbmRDaHVuayIsInNlbmRFbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7QUFHQSxJQUFNQSxTQUFTLEdBQUcsS0FBbEI7O0FBRU8sU0FBU0MsbUJBQVQsQ0FBNkJDLElBQTdCLEVBQTBEO0FBQy9ELE1BQU1DLE9BQU8sR0FBRyxJQUFJQyxhQUFKLEVBQWhCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHRixPQUFPLENBQUNHLFlBQVIsRUFBZDtBQUVBLE1BQU1DLENBQUMsR0FBRyxJQUFJQyxVQUFKLEVBQVY7QUFBQSxNQUNFQyxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsU0FBTCxDQUFlQyxLQUQ3QjtBQUFBLE1BRUVDLE1BQU0sR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVViLElBQUksQ0FBQ2MsSUFBTCxHQUFZaEIsU0FBdEIsQ0FGWDtBQUdBLE1BQUlpQixZQUFZLEdBQUcsQ0FBbkI7O0FBQ0FWLEVBQUFBLENBQUMsQ0FBQ1csT0FBRixHQUFZLFVBQUFDLENBQUMsRUFBSTtBQUNmaEIsSUFBQUEsT0FBTyxDQUFDaUIsS0FBUixDQUFjRCxDQUFkO0FBQ0QsR0FGRDs7QUFHQVosRUFBQUEsQ0FBQyxDQUFDYyxNQUFGLEdBQVcsVUFBQUYsQ0FBQyxFQUFJO0FBQ2QsUUFBTUcsS0FBSyxHQUFJSCxDQUFDLENBQUNJLE1BQUgsQ0FBa0JDLE1BQWhDO0FBQ0FQLElBQUFBLFlBQVk7O0FBQ1osUUFBSUEsWUFBWSxHQUFHSixNQUFuQixFQUEyQjtBQUN6QlksTUFBQUEsUUFBUTtBQUNSdEIsTUFBQUEsT0FBTyxDQUFDdUIsSUFBUixDQUFhSixLQUFiO0FBQ0QsS0FIRCxNQUdPO0FBQ0xuQixNQUFBQSxPQUFPLENBQUN3QixRQUFSO0FBQ0Q7QUFDRixHQVREOztBQVVBLFdBQVNGLFFBQVQsR0FBb0I7QUFDbEIsUUFBTUcsS0FBSyxHQUFHWCxZQUFZLEdBQUdqQixTQUE3QjtBQUNBLFFBQU02QixHQUFHLEdBQUdELEtBQUssR0FBRzVCLFNBQVIsSUFBcUJFLElBQUksQ0FBQ2MsSUFBMUIsR0FBaUNkLElBQUksQ0FBQ2MsSUFBdEMsR0FBNkNZLEtBQUssR0FBRzVCLFNBQWpFO0FBQ0FPLElBQUFBLENBQUMsQ0FBQ3VCLGlCQUFGLENBQW9CckIsU0FBUyxDQUFDc0IsSUFBVixDQUFlN0IsSUFBZixFQUFxQjBCLEtBQXJCLEVBQTRCQyxHQUE1QixDQUFwQjtBQUNEOztBQUNESixFQUFBQSxRQUFRO0FBQ1IsU0FBT3BCLEtBQVA7QUFDRDs7SUFtQm9CMkIsUzs7O0FBUW5CLHFCQUFvQkMsSUFBcEIsRUFBMENDLEtBQTFDLEVBQTBEO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQSxxQ0FQaEQsSUFBSTlCLGFBQUosRUFPZ0Q7O0FBQUEsbUNBTmxELEtBQUtELE9BQUwsQ0FBYUcsWUFBYixFQU1rRDs7QUFBQSxvQ0FKMUIsRUFJMEI7O0FBQUEsa0NBSG5DLEVBR21DOztBQUFBLGtDQUZuQyxDQUVtQzs7QUFDeEQsUUFBSSxDQUFDNEIsS0FBTCxFQUFZQSxLQUFLLEdBQUcsTUFBUjtBQUVaRCxJQUFBQSxJQUFJLENBQUNFLE1BQUwsQ0FBWUMsU0FBWixDQUFzQixVQUFDQyxHQUFELEVBQWtCO0FBQUEsVUFDOUJILEtBRDhCLEdBQ2RHLEdBRGMsQ0FDOUJILEtBRDhCO0FBQUEsVUFDdkJJLElBRHVCLEdBQ2RELEdBRGMsQ0FDdkJDLElBRHVCOztBQUV0QyxVQUFJSixLQUFLLEtBQUssS0FBSSxDQUFDQSxLQUFuQixFQUEwQjtBQUN4QixZQUFJO0FBQ0YsY0FBTUssR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsSUFBWCxDQUFaOztBQUNBLGtCQUFRQyxHQUFHLENBQUNsQyxLQUFaO0FBQ0UsaUJBQUssT0FBTDtBQUNFLGNBQUEsS0FBSSxDQUFDUSxNQUFMLEdBQWMsRUFBZDtBQUNBLGNBQUEsS0FBSSxDQUFDNkIsSUFBTCxHQUFZSCxHQUFHLENBQUNHLElBQWhCO0FBQ0EsY0FBQSxLQUFJLENBQUMxQixJQUFMLEdBQVl1QixHQUFHLENBQUN2QixJQUFoQjtBQUNBOztBQUNGLGlCQUFLLEtBQUw7QUFDRSxjQUFBLEtBQUksQ0FBQ2IsT0FBTCxDQUFhdUIsSUFBYixDQUFrQjtBQUNoQmlCLGdCQUFBQSxJQUFJLEVBQUUsWUFEVTtBQUVoQkMsZ0JBQUFBLE9BQU8sRUFBRTtBQUFFL0Isa0JBQUFBLE1BQU0sRUFBRSxLQUFJLENBQUNBLE1BQWY7QUFBdUI2QixrQkFBQUEsSUFBSSxFQUFFLEtBQUksQ0FBQ0E7QUFBbEM7QUFGTyxlQUFsQjs7QUFJQSxjQUFBLEtBQUksQ0FBQzdCLE1BQUwsR0FBYyxFQUFkO0FBQ0EsY0FBQSxLQUFJLENBQUM2QixJQUFMLEdBQVksRUFBWjtBQUNBO0FBYko7QUFlRCxTQWpCRCxDQWlCRSxPQUFPdEIsS0FBUCxFQUFjO0FBQ2QsVUFBQSxLQUFJLENBQUNQLE1BQUwsQ0FBWWdDLElBQVosQ0FBaUJQLElBQWpCOztBQUNBLFVBQUEsS0FBSSxDQUFDbkMsT0FBTCxDQUFhdUIsSUFBYixDQUFrQjtBQUNoQmlCLFlBQUFBLElBQUksRUFBRSxhQURVO0FBRWhCQyxZQUFBQSxPQUFPLEVBQUU7QUFBRUUsY0FBQUEsR0FBRyxFQUFFLEtBQUksQ0FBQ2pDLE1BQUwsQ0FBWWtDLE1BQVosR0FBcUIvQyxTQUE1QjtBQUF1Q2dCLGNBQUFBLElBQUksRUFBRSxLQUFJLENBQUNBO0FBQWxEO0FBRk8sV0FBbEI7QUFJRDtBQUNGO0FBQ0YsS0E1QkQ7QUE2QkQ7Ozs7OEJBRVMwQixJLEVBQWMxQixJLEVBQWM7QUFDcEMsV0FBS2lCLElBQUwsQ0FBVWUsSUFBVixDQUFlUixJQUFJLENBQUNTLFNBQUwsQ0FBZTtBQUFFNUMsUUFBQUEsS0FBSyxFQUFFLE9BQVQ7QUFBa0JXLFFBQUFBLElBQUksRUFBSkEsSUFBbEI7QUFBd0IwQixRQUFBQSxJQUFJLEVBQUpBO0FBQXhCLE9BQWYsQ0FBZixFQUErRCxLQUFLUixLQUFwRTtBQUNEOzs7OEJBRVNaLEssRUFBb0I7QUFDNUIsV0FBS1csSUFBTCxDQUFVZSxJQUFWLENBQWUxQixLQUFmLEVBQXNCLEtBQUtZLEtBQTNCO0FBQ0Q7Ozs4QkFFUztBQUNSLFdBQUtELElBQUwsQ0FBVWUsSUFBVixDQUFlUixJQUFJLENBQUNTLFNBQUwsQ0FBZTtBQUFFNUMsUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBZixDQUFmLEVBQWlELEtBQUs2QixLQUF0RDtBQUNEOzs7eUJBRUloQyxJLEVBQVk7QUFBQTs7QUFDZixXQUFLZ0QsU0FBTCxDQUFlaEQsSUFBSSxDQUFDd0MsSUFBcEIsRUFBMEJ4QyxJQUFJLENBQUNjLElBQS9CO0FBQ0FmLE1BQUFBLG1CQUFtQixDQUFDQyxJQUFELENBQW5CLENBQTBCa0MsU0FBMUIsQ0FDRSxVQUFBZCxLQUFLO0FBQUEsZUFBSSxNQUFJLENBQUM2QixTQUFMLENBQWU3QixLQUFmLENBQUo7QUFBQSxPQURQLEVBRUUsWUFBTSxDQUFFLENBRlYsRUFHRSxZQUFNO0FBQ0osUUFBQSxNQUFJLENBQUM4QixPQUFMO0FBQ0QsT0FMSDtBQU9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IG1lc3NhZ2UgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcblxuY29uc3QgY2h1bmtTaXplID0gMTYwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbGljZUFycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgY29uc3Qgc3RhdGUgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgIGJsb2JTbGljZSA9IEZpbGUucHJvdG90eXBlLnNsaWNlLFxuICAgIGNodW5rcyA9IE1hdGguY2VpbChibG9iLnNpemUgLyBjaHVua1NpemUpO1xuICBsZXQgY3VycmVudENodW5rID0gMDtcbiAgci5vbmVycm9yID0gZSA9PiB7XG4gICAgc3ViamVjdC5lcnJvcihlKTtcbiAgfTtcbiAgci5vbmxvYWQgPSBlID0+IHtcbiAgICBjb25zdCBjaHVuayA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcbiAgICBjdXJyZW50Q2h1bmsrKztcbiAgICBpZiAoY3VycmVudENodW5rIDwgY2h1bmtzKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgICAgc3ViamVjdC5uZXh0KGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gbG9hZE5leHQoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBjdXJyZW50Q2h1bmsgKiBjaHVua1NpemU7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua1NpemUgPj0gYmxvYi5zaXplID8gYmxvYi5zaXplIDogc3RhcnQgKyBjaHVua1NpemU7XG4gICAgci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iU2xpY2UuY2FsbChibG9iLCBzdGFydCwgZW5kKSk7XG4gIH1cbiAgbG9hZE5leHQoKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5pbnRlcmZhY2UgQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBwYXlsb2FkOiBhbnk7XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGluZyBleHRlbmRzIEFjdGlvbiB7XG4gIHR5cGU6IFwiZG93bmxvYWRpbmdcIjtcbiAgcGF5bG9hZDogeyBub3c6IG51bWJlcjsgc2l6ZTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGVkIGV4dGVuZHMgQWN0aW9uIHtcbiAgdHlwZTogXCJkb3dubG9hZGVkXCI7XG4gIHBheWxvYWQ6IHsgY2h1bmtzOiBBcnJheUJ1ZmZlcltdOyBuYW1lOiBzdHJpbmcgfTtcbn1cblxudHlwZSBBY3Rpb25zID0gRG93bmxvYWRpbmcgfCBEb3dubG9hZGVkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU2hhcmUge1xuICBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgc3RhdGUgPSB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSBjaHVua3M6IEFycmF5QnVmZmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICBwcml2YXRlIHNpemU6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwZWVyOiBXZWJSVEMsIHByaXZhdGUgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBpZiAoIWxhYmVsKSBsYWJlbCA9IFwiZmlsZVwiO1xuXG4gICAgcGVlci5vbkRhdGEuc3Vic2NyaWJlKChyYXc6IG1lc3NhZ2UpID0+IHtcbiAgICAgIGNvbnN0IHsgbGFiZWwsIGRhdGEgfSA9IHJhdztcbiAgICAgIGlmIChsYWJlbCA9PT0gdGhpcy5sYWJlbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgc3dpdGNoIChvYmouc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxuICAgICAgICAgICAgICB0aGlzLmNodW5rcyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBvYmoubmFtZTtcbiAgICAgICAgICAgICAgdGhpcy5zaXplID0gb2JqLnNpemU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3dubG9hZGVkXCIsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBjaHVua3M6IHRoaXMuY2h1bmtzLCBuYW1lOiB0aGlzLm5hbWUgfVxuICAgICAgICAgICAgICB9IGFzIERvd25sb2FkZWQpO1xuICAgICAgICAgICAgICB0aGlzLmNodW5rcyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5jaHVua3MucHVzaChkYXRhKTtcbiAgICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkaW5nXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IG5vdzogdGhpcy5jaHVua3MubGVuZ3RoICogY2h1bmtTaXplLCBzaXplOiB0aGlzLnNpemUgfVxuICAgICAgICAgIH0gYXMgRG93bmxvYWRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU3RhcnQobmFtZTogc3RyaW5nLCBzaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLnBlZXIuc2VuZChKU09OLnN0cmluZ2lmeSh7IHN0YXRlOiBcInN0YXJ0XCIsIHNpemUsIG5hbWUgfSksIHRoaXMubGFiZWwpO1xuICB9XG5cbiAgc2VuZENodW5rKGNodW5rOiBBcnJheUJ1ZmZlcikge1xuICAgIHRoaXMucGVlci5zZW5kKGNodW5rLCB0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHNlbmRFbmQoKSB7XG4gICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzdGF0ZTogXCJlbmRcIiB9KSwgdGhpcy5sYWJlbCk7XG4gIH1cblxuICBzZW5kKGJsb2I6IEZpbGUpIHtcbiAgICB0aGlzLnNlbmRTdGFydChibG9iLm5hbWUsIGJsb2Iuc2l6ZSk7XG4gICAgZ2V0U2xpY2VBcnJheUJ1ZmZlcihibG9iKS5zdWJzY3JpYmUoXG4gICAgICBjaHVuayA9PiB0aGlzLnNlbmRDaHVuayhjaHVuayksXG4gICAgICAoKSA9PiB7fSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5zZW5kRW5kKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIl19