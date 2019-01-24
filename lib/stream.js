"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;
exports.default = exports.MediaType = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

function getLocalVideo(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      video: {
        width: opt.width,
        height: opt.height
      }
    }).then(function (stream) {
      resolve(stream);
    });
  });
}

function getLocalAudio(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(function (stream) {
      resolve(stream);
    });
  });
}

var MediaType;
exports.MediaType = MediaType;

(function (MediaType) {
  MediaType[MediaType["video"] = 0] = "video";
  MediaType[MediaType["audio"] = 1] = "audio";
})(MediaType || (exports.MediaType = MediaType = {}));

var Stream =
/*#__PURE__*/
function () {
  function Stream(peer, opt) {
    _classCallCheck(this, Stream);

    _defineProperty(this, "onStream", void 0);

    opt = opt || {};

    this.onStream = function (_) {};

    this.init(peer, opt.stream, opt.type);
  }

  _createClass(Stream, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(peer, _stream, type) {
        var _this = this;

        var stream, track;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _stream;

                if (_context2.t0) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 4;
                return _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(type && type == MediaType.video)) {
                            _context.next = 6;
                            break;
                          }

                          _context.next = 3;
                          return getLocalVideo();

                        case 3:
                          return _context.abrupt("return", _context.sent);

                        case 6:
                          _context.next = 8;
                          return getLocalAudio();

                        case 8:
                          return _context.abrupt("return", _context.sent);

                        case 9:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }))();

              case 4:
                _context2.t0 = _context2.sent;

              case 5:
                stream = _context2.t0;
                track = stream.getVideoTracks()[0];
                peer.rtc.addTrack(track, stream);

                peer.rtc.ontrack = function (event) {
                  var stream = event.streams[0];

                  _this.onStream(stream);
                };

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function init(_x, _x2, _x3) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return Stream;
}();

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsVmlkZW8iLCJvcHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm5hdmlnYXRvciIsImdldFVzZXJNZWRpYSIsIndlYmtpdEdldFVzZXJNZWRpYSIsIm1vekdldFVzZXJNZWRpYSIsIm1zR2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJ2aWRlbyIsInRoZW4iLCJzdHJlYW0iLCJnZXRMb2NhbEF1ZGlvIiwiYXVkaW8iLCJNZWRpYVR5cGUiLCJTdHJlYW0iLCJwZWVyIiwib25TdHJlYW0iLCJfIiwiaW5pdCIsInR5cGUiLCJfc3RyZWFtIiwidHJhY2siLCJnZXRWaWRlb1RyYWNrcyIsInJ0YyIsImFkZFRyYWNrIiwib250cmFjayIsImV2ZW50Iiwic3RyZWFtcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUdPLFNBQVNDLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQWdFO0FBQ3JFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FDRUQsU0FBUyxDQUFDQyxZQUFWLElBQ0FELFNBQVMsQ0FBQ0Usa0JBRFYsSUFFQUYsU0FBUyxDQUFDRyxlQUZWLElBR0FILFNBQVMsQ0FBQ0ksY0FKWjtBQUtBLFFBQUksQ0FBQ1AsR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRVEsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVk4sSUFBQUEsU0FBUyxDQUFDTyxZQUFWLENBQ0dOLFlBREgsQ0FDZ0I7QUFBRU8sTUFBQUEsS0FBSyxFQUFFO0FBQUVILFFBQUFBLEtBQUssRUFBRVIsR0FBRyxDQUFDUSxLQUFiO0FBQW9CQyxRQUFBQSxNQUFNLEVBQUVULEdBQUcsQ0FBQ1M7QUFBaEM7QUFBVCxLQURoQixFQUVHRyxJQUZILENBRVEsVUFBQUMsTUFBTSxFQUFJO0FBQ2RYLE1BQUFBLE9BQU8sQ0FBQ1csTUFBRCxDQUFQO0FBQ0QsS0FKSDtBQUtELEdBWk0sQ0FBUDtBQWFEOztBQUNNLFNBQVNDLGFBQVQsQ0FBdUJkLEdBQXZCLEVBQWdFO0FBQ3JFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FDRUQsU0FBUyxDQUFDQyxZQUFWLElBQ0FELFNBQVMsQ0FBQ0Usa0JBRFYsSUFFQUYsU0FBUyxDQUFDRyxlQUZWLElBR0FILFNBQVMsQ0FBQ0ksY0FKWjtBQUtBLFFBQUksQ0FBQ1AsR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRVEsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVk4sSUFBQUEsU0FBUyxDQUFDTyxZQUFWLENBQ0dOLFlBREgsQ0FDZ0I7QUFBRVcsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUosTUFBQUEsS0FBSyxFQUFFO0FBQXRCLEtBRGhCLEVBRUdDLElBRkgsQ0FFUSxVQUFBQyxNQUFNLEVBQUk7QUFDZFgsTUFBQUEsT0FBTyxDQUFDVyxNQUFELENBQVA7QUFDRCxLQUpIO0FBS0QsR0FaTSxDQUFQO0FBYUQ7O0lBRVdHLFM7OztXQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7R0FBQUEsUyx5QkFBQUEsUzs7SUFLU0MsTTs7O0FBR25CLGtCQUFZQyxJQUFaLEVBQTBCbEIsR0FBMUIsRUFBNEU7QUFBQTs7QUFBQTs7QUFDMUVBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWI7O0FBQ0EsU0FBS21CLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsSUFBTCxDQUFVSCxJQUFWLEVBQWdCbEIsR0FBRyxDQUFDYSxNQUFwQixFQUE0QmIsR0FBRyxDQUFDc0IsSUFBaEM7QUFDRDs7Ozs7OztnREFFa0JKLEksRUFBY0ssTyxFQUF1QkQsSTs7Ozs7Ozs7K0JBRXBEQyxPOzs7Ozs7Ozt1QkFDTztBQUFBO0FBQUEsd0NBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdDQUNGRCxJQUFJLElBQUtBLElBQUQsSUFBdUJOLFNBQVMsQ0FBQ0wsS0FEdkM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxpQ0FFU1osYUFBYSxFQUZ0Qjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQ0FJU2UsYUFBYSxFQUp0Qjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFELEk7Ozs7OztBQUZIRCxnQkFBQUEsTTtBQVVBVyxnQkFBQUEsSyxHQUFRWCxNQUFNLENBQUNZLGNBQVAsR0FBd0IsQ0FBeEIsQztBQUNkUCxnQkFBQUEsSUFBSSxDQUFDUSxHQUFMLENBQVNDLFFBQVQsQ0FBa0JILEtBQWxCLEVBQXlCWCxNQUF6Qjs7QUFDQUssZ0JBQUFBLElBQUksQ0FBQ1EsR0FBTCxDQUFTRSxPQUFULEdBQW1CLFVBQUFDLEtBQUssRUFBSTtBQUMxQixzQkFBTWhCLE1BQU0sR0FBR2dCLEtBQUssQ0FBQ0MsT0FBTixDQUFjLENBQWQsQ0FBZjs7QUFDQSxrQkFBQSxLQUFJLENBQUNYLFFBQUwsQ0FBY04sTUFBZDtBQUNELGlCQUhEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxWaWRlbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9IH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxBdWRpbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlLCB2aWRlbzogZmFsc2UgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihwZWVyOiBXZWJSVEMsIG9wdD86IHsgc3RyZWFtPzogTWVkaWFTdHJlYW07IHR5cGU/OiBNZWRpYVR5cGUgfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmluaXQocGVlciwgb3B0LnN0cmVhbSwgb3B0LnR5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHBlZXI6IFdlYlJUQywgX3N0cmVhbT86IE1lZGlhU3RyZWFtLCB0eXBlPzogTWVkaWFUeXBlKSB7XG4gICAgY29uc3Qgc3RyZWFtOiBNZWRpYVN0cmVhbSA9XG4gICAgICBfc3RyZWFtIHx8XG4gICAgICAoYXdhaXQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHR5cGUgJiYgKHR5cGUgYXMgTWVkaWFUeXBlKSA9PSBNZWRpYVR5cGUudmlkZW8pIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxWaWRlbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbEF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCkpO1xuXG4gICAgY29uc3QgdHJhY2sgPSBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXTtcbiAgICBwZWVyLnJ0Yy5hZGRUcmFjayh0cmFjaywgc3RyZWFtKTtcbiAgICBwZWVyLnJ0Yy5vbnRyYWNrID0gZXZlbnQgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gZXZlbnQuc3RyZWFtc1swXTtcbiAgICAgIHRoaXMub25TdHJlYW0oc3RyZWFtKTtcbiAgICB9O1xuICB9XG59XG4iXX0=