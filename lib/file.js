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
    peer.addOnData(function (raw) {
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
    }, label);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLnRzIl0sIm5hbWVzIjpbImNodW5rU2l6ZSIsImdldFNsaWNlQXJyYXlCdWZmZXIiLCJibG9iIiwic3ViamVjdCIsIlN1YmplY3QiLCJzdGF0ZSIsImFzT2JzZXJ2YWJsZSIsInIiLCJGaWxlUmVhZGVyIiwiYmxvYlNsaWNlIiwiRmlsZSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2h1bmtzIiwiTWF0aCIsImNlaWwiLCJzaXplIiwiY3VycmVudENodW5rIiwib25lcnJvciIsImUiLCJlcnJvciIsIm9ubG9hZCIsImNodW5rIiwidGFyZ2V0IiwicmVzdWx0IiwibG9hZE5leHQiLCJuZXh0IiwiY29tcGxldGUiLCJzdGFydCIsImVuZCIsInJlYWRBc0FycmF5QnVmZmVyIiwiY2FsbCIsIkZpbGVTaGFyZSIsInBlZXIiLCJsYWJlbCIsImNvbnNvbGUiLCJsb2ciLCJhZGRPbkRhdGEiLCJyYXciLCJkYXRhIiwib2JqIiwiSlNPTiIsInBhcnNlIiwibmFtZSIsInR5cGUiLCJwYXlsb2FkIiwicHVzaCIsIm5vdyIsImxlbmd0aCIsInNlbmQiLCJzdHJpbmdpZnkiLCJzZW5kU3RhcnQiLCJzdWJzY3JpYmUiLCJzZW5kQ2h1bmsiLCJzZW5kRW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHLEtBQWxCOztBQUVPLFNBQVNDLG1CQUFULENBQTZCQyxJQUE3QixFQUEwRDtBQUMvRCxNQUFNQyxPQUFPLEdBQUcsSUFBSUMsYUFBSixFQUFoQjtBQUNBLE1BQU1DLEtBQUssR0FBR0YsT0FBTyxDQUFDRyxZQUFSLEVBQWQ7QUFFQSxNQUFNQyxDQUFDLEdBQUcsSUFBSUMsVUFBSixFQUFWO0FBQUEsTUFDRUMsU0FBUyxHQUFHQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsS0FEN0I7QUFBQSxNQUVFQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVYixJQUFJLENBQUNjLElBQUwsR0FBWWhCLFNBQXRCLENBRlg7QUFHQSxNQUFJaUIsWUFBWSxHQUFHLENBQW5COztBQUNBVixFQUFBQSxDQUFDLENBQUNXLE9BQUYsR0FBWSxVQUFBQyxDQUFDLEVBQUk7QUFDZmhCLElBQUFBLE9BQU8sQ0FBQ2lCLEtBQVIsQ0FBY0QsQ0FBZDtBQUNELEdBRkQ7O0FBR0FaLEVBQUFBLENBQUMsQ0FBQ2MsTUFBRixHQUFXLFVBQUFGLENBQUMsRUFBSTtBQUNkLFFBQU1HLEtBQUssR0FBSUgsQ0FBQyxDQUFDSSxNQUFILENBQWtCQyxNQUFoQztBQUNBUCxJQUFBQSxZQUFZOztBQUNaLFFBQUlBLFlBQVksR0FBR0osTUFBbkIsRUFBMkI7QUFDekJZLE1BQUFBLFFBQVE7QUFDUnRCLE1BQUFBLE9BQU8sQ0FBQ3VCLElBQVIsQ0FBYUosS0FBYjtBQUNELEtBSEQsTUFHTztBQUNMbkIsTUFBQUEsT0FBTyxDQUFDd0IsUUFBUjtBQUNEO0FBQ0YsR0FURDs7QUFVQSxXQUFTRixRQUFULEdBQW9CO0FBQ2xCLFFBQU1HLEtBQUssR0FBR1gsWUFBWSxHQUFHakIsU0FBN0I7QUFDQSxRQUFNNkIsR0FBRyxHQUFHRCxLQUFLLEdBQUc1QixTQUFSLElBQXFCRSxJQUFJLENBQUNjLElBQTFCLEdBQWlDZCxJQUFJLENBQUNjLElBQXRDLEdBQTZDWSxLQUFLLEdBQUc1QixTQUFqRTtBQUNBTyxJQUFBQSxDQUFDLENBQUN1QixpQkFBRixDQUFvQnJCLFNBQVMsQ0FBQ3NCLElBQVYsQ0FBZTdCLElBQWYsRUFBcUIwQixLQUFyQixFQUE0QkMsR0FBNUIsQ0FBcEI7QUFDRDs7QUFDREosRUFBQUEsUUFBUTtBQUNSLFNBQU9wQixLQUFQO0FBQ0Q7O0lBbUJvQjJCLFM7OztBQVFuQixxQkFBb0JDLElBQXBCLEVBQTBDQyxLQUExQyxFQUEwRDtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUEscUNBUGhELElBQUk5QixhQUFKLEVBT2dEOztBQUFBLG1DQU5sRCxLQUFLRCxPQUFMLENBQWFHLFlBQWIsRUFNa0Q7O0FBQUEsb0NBSjFCLEVBSTBCOztBQUFBLGtDQUhuQyxFQUdtQzs7QUFBQSxrQ0FGbkMsQ0FFbUM7O0FBQ3hELFFBQUksQ0FBQzRCLEtBQUwsRUFBWUEsS0FBSyxHQUFHLE1BQVI7QUFDWkMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk7QUFBRUYsTUFBQUEsS0FBSyxFQUFMQTtBQUFGLEtBQVo7QUFDQUQsSUFBQUEsSUFBSSxDQUFDSSxTQUFMLENBQWUsVUFBQUMsR0FBRyxFQUFJO0FBQUEsVUFDWkosS0FEWSxHQUNJSSxHQURKLENBQ1pKLEtBRFk7QUFBQSxVQUNMSyxJQURLLEdBQ0lELEdBREosQ0FDTEMsSUFESzs7QUFFcEIsVUFBSUwsS0FBSyxLQUFLLEtBQUksQ0FBQ0EsS0FBbkIsRUFBMEI7QUFDeEIsWUFBSTtBQUNGLGNBQU1NLEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdILElBQVgsQ0FBWjs7QUFDQSxrQkFBUUMsR0FBRyxDQUFDbkMsS0FBWjtBQUNFLGlCQUFLLE9BQUw7QUFDRSxjQUFBLEtBQUksQ0FBQ1EsTUFBTCxHQUFjLEVBQWQ7QUFDQSxjQUFBLEtBQUksQ0FBQzhCLElBQUwsR0FBWUgsR0FBRyxDQUFDRyxJQUFoQjtBQUNBLGNBQUEsS0FBSSxDQUFDM0IsSUFBTCxHQUFZd0IsR0FBRyxDQUFDeEIsSUFBaEI7QUFDQTs7QUFDRixpQkFBSyxLQUFMO0FBQ0UsY0FBQSxLQUFJLENBQUNiLE9BQUwsQ0FBYXVCLElBQWIsQ0FBa0I7QUFDaEJrQixnQkFBQUEsSUFBSSxFQUFFLFlBRFU7QUFFaEJDLGdCQUFBQSxPQUFPLEVBQUU7QUFBRWhDLGtCQUFBQSxNQUFNLEVBQUUsS0FBSSxDQUFDQSxNQUFmO0FBQXVCOEIsa0JBQUFBLElBQUksRUFBRSxLQUFJLENBQUNBO0FBQWxDO0FBRk8sZUFBbEI7O0FBSUEsY0FBQSxLQUFJLENBQUM5QixNQUFMLEdBQWMsRUFBZDtBQUNBLGNBQUEsS0FBSSxDQUFDOEIsSUFBTCxHQUFZLEVBQVo7QUFDQTtBQWJKO0FBZUQsU0FqQkQsQ0FpQkUsT0FBT3ZCLEtBQVAsRUFBYztBQUNkLFVBQUEsS0FBSSxDQUFDUCxNQUFMLENBQVlpQyxJQUFaLENBQWlCUCxJQUFqQjs7QUFDQSxVQUFBLEtBQUksQ0FBQ3BDLE9BQUwsQ0FBYXVCLElBQWIsQ0FBa0I7QUFDaEJrQixZQUFBQSxJQUFJLEVBQUUsYUFEVTtBQUVoQkMsWUFBQUEsT0FBTyxFQUFFO0FBQUVFLGNBQUFBLEdBQUcsRUFBRSxLQUFJLENBQUNsQyxNQUFMLENBQVltQyxNQUFaLEdBQXFCaEQsU0FBNUI7QUFBdUNnQixjQUFBQSxJQUFJLEVBQUUsS0FBSSxDQUFDQTtBQUFsRDtBQUZPLFdBQWxCO0FBSUQ7QUFDRjtBQUNGLEtBNUJELEVBNEJHa0IsS0E1Qkg7QUE2QkQ7Ozs7OEJBRVNTLEksRUFBYzNCLEksRUFBYztBQUNwQyxXQUFLaUIsSUFBTCxDQUFVZ0IsSUFBVixDQUFlUixJQUFJLENBQUNTLFNBQUwsQ0FBZTtBQUFFN0MsUUFBQUEsS0FBSyxFQUFFLE9BQVQ7QUFBa0JXLFFBQUFBLElBQUksRUFBSkEsSUFBbEI7QUFBd0IyQixRQUFBQSxJQUFJLEVBQUpBO0FBQXhCLE9BQWYsQ0FBZixFQUErRCxLQUFLVCxLQUFwRTtBQUNEOzs7OEJBRVNaLEssRUFBb0I7QUFDNUIsV0FBS1csSUFBTCxDQUFVZ0IsSUFBVixDQUFlM0IsS0FBZixFQUFzQixLQUFLWSxLQUEzQjtBQUNEOzs7OEJBRVM7QUFDUixXQUFLRCxJQUFMLENBQVVnQixJQUFWLENBQWVSLElBQUksQ0FBQ1MsU0FBTCxDQUFlO0FBQUU3QyxRQUFBQSxLQUFLLEVBQUU7QUFBVCxPQUFmLENBQWYsRUFBaUQsS0FBSzZCLEtBQXREO0FBQ0Q7Ozt5QkFFSWhDLEksRUFBWTtBQUFBOztBQUNmLFdBQUtpRCxTQUFMLENBQWVqRCxJQUFJLENBQUN5QyxJQUFwQixFQUEwQnpDLElBQUksQ0FBQ2MsSUFBL0I7QUFDQWYsTUFBQUEsbUJBQW1CLENBQUNDLElBQUQsQ0FBbkIsQ0FBMEJrRCxTQUExQixDQUNFLFVBQUE5QixLQUFLO0FBQUEsZUFBSSxNQUFJLENBQUMrQixTQUFMLENBQWUvQixLQUFmLENBQUo7QUFBQSxPQURQLEVBRUUsWUFBTSxDQUFFLENBRlYsRUFHRSxZQUFNO0FBQ0osUUFBQSxNQUFJLENBQUNnQyxPQUFMO0FBQ0QsT0FMSDtBQU9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuY29uc3QgY2h1bmtTaXplID0gMTYwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbGljZUFycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgY29uc3Qgc3RhdGUgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgIGJsb2JTbGljZSA9IEZpbGUucHJvdG90eXBlLnNsaWNlLFxuICAgIGNodW5rcyA9IE1hdGguY2VpbChibG9iLnNpemUgLyBjaHVua1NpemUpO1xuICBsZXQgY3VycmVudENodW5rID0gMDtcbiAgci5vbmVycm9yID0gZSA9PiB7XG4gICAgc3ViamVjdC5lcnJvcihlKTtcbiAgfTtcbiAgci5vbmxvYWQgPSBlID0+IHtcbiAgICBjb25zdCBjaHVuayA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcbiAgICBjdXJyZW50Q2h1bmsrKztcbiAgICBpZiAoY3VycmVudENodW5rIDwgY2h1bmtzKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgICAgc3ViamVjdC5uZXh0KGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gbG9hZE5leHQoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBjdXJyZW50Q2h1bmsgKiBjaHVua1NpemU7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua1NpemUgPj0gYmxvYi5zaXplID8gYmxvYi5zaXplIDogc3RhcnQgKyBjaHVua1NpemU7XG4gICAgci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iU2xpY2UuY2FsbChibG9iLCBzdGFydCwgZW5kKSk7XG4gIH1cbiAgbG9hZE5leHQoKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5pbnRlcmZhY2UgQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBwYXlsb2FkOiBhbnk7XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGluZyBleHRlbmRzIEFjdGlvbiB7XG4gIHR5cGU6IFwiZG93bmxvYWRpbmdcIjtcbiAgcGF5bG9hZDogeyBub3c6IG51bWJlcjsgc2l6ZTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBEb3dubG9hZGVkIGV4dGVuZHMgQWN0aW9uIHtcbiAgdHlwZTogXCJkb3dubG9hZGVkXCI7XG4gIHBheWxvYWQ6IHsgY2h1bmtzOiBBcnJheUJ1ZmZlcltdOyBuYW1lOiBzdHJpbmcgfTtcbn1cblxudHlwZSBBY3Rpb25zID0gRG93bmxvYWRpbmcgfCBEb3dubG9hZGVkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU2hhcmUge1xuICBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8QWN0aW9ucz4oKTtcbiAgc3RhdGUgPSB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSBjaHVua3M6IEFycmF5QnVmZmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICBwcml2YXRlIHNpemU6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwZWVyOiBXZWJSVEMsIHByaXZhdGUgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBpZiAoIWxhYmVsKSBsYWJlbCA9IFwiZmlsZVwiO1xuICAgIGNvbnNvbGUubG9nKHsgbGFiZWwgfSk7XG4gICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgIGNvbnN0IHsgbGFiZWwsIGRhdGEgfSA9IHJhdztcbiAgICAgIGlmIChsYWJlbCA9PT0gdGhpcy5sYWJlbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgc3dpdGNoIChvYmouc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxuICAgICAgICAgICAgICB0aGlzLmNodW5rcyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBvYmoubmFtZTtcbiAgICAgICAgICAgICAgdGhpcy5zaXplID0gb2JqLnNpemU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3dubG9hZGVkXCIsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyBjaHVua3M6IHRoaXMuY2h1bmtzLCBuYW1lOiB0aGlzLm5hbWUgfVxuICAgICAgICAgICAgICB9IGFzIERvd25sb2FkZWQpO1xuICAgICAgICAgICAgICB0aGlzLmNodW5rcyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5jaHVua3MucHVzaChkYXRhKTtcbiAgICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICB0eXBlOiBcImRvd25sb2FkaW5nXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiB7IG5vdzogdGhpcy5jaHVua3MubGVuZ3RoICogY2h1bmtTaXplLCBzaXplOiB0aGlzLnNpemUgfVxuICAgICAgICAgIH0gYXMgRG93bmxvYWRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgbGFiZWwpO1xuICB9XG5cbiAgc2VuZFN0YXJ0KG5hbWU6IHN0cmluZywgc2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzdGF0ZTogXCJzdGFydFwiLCBzaXplLCBuYW1lIH0pLCB0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHNlbmRDaHVuayhjaHVuazogQXJyYXlCdWZmZXIpIHtcbiAgICB0aGlzLnBlZXIuc2VuZChjaHVuaywgdGhpcy5sYWJlbCk7XG4gIH1cblxuICBzZW5kRW5kKCkge1xuICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdGU6IFwiZW5kXCIgfSksIHRoaXMubGFiZWwpO1xuICB9XG5cbiAgc2VuZChibG9iOiBGaWxlKSB7XG4gICAgdGhpcy5zZW5kU3RhcnQoYmxvYi5uYW1lLCBibG9iLnNpemUpO1xuICAgIGdldFNsaWNlQXJyYXlCdWZmZXIoYmxvYikuc3Vic2NyaWJlKFxuICAgICAgY2h1bmsgPT4gdGhpcy5zZW5kQ2h1bmsoY2h1bmspLFxuICAgICAgKCkgPT4ge30sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZEVuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==