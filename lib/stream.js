"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;
exports.default = exports.MediaType = void 0;

var _simplePeer = _interopRequireDefault(require("simple-peer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        var stream, p;
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

                if (peer.isOffer) {
                  p = new _simplePeer.default({
                    initiator: true,
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    peer.send(JSON.stringify(data), "stream_offer");
                  });
                } else {
                  p = new _simplePeer.default({
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    peer.send(JSON.stringify(data), "stream_answer");
                  });
                }

                peer.addOnData(function (data) {
                  var sdp = JSON.parse(data.data);

                  if (data.label === "stream_answer" || data.label === "stream_offer") {
                    p.signal(sdp);
                  }
                }, "stream");
                p.on("error", function (err) {
                  console.log({
                    err: err
                  });
                });
                p.on("stream", function (stream) {
                  _this.onStream(stream);
                });
                p.on("connect", function () {});

              case 11:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsVmlkZW8iLCJvcHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm5hdmlnYXRvciIsImdldFVzZXJNZWRpYSIsIndlYmtpdEdldFVzZXJNZWRpYSIsIm1vekdldFVzZXJNZWRpYSIsIm1zR2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJ2aWRlbyIsInRoZW4iLCJzdHJlYW0iLCJnZXRMb2NhbEF1ZGlvIiwiYXVkaW8iLCJNZWRpYVR5cGUiLCJTdHJlYW0iLCJwZWVyIiwib25TdHJlYW0iLCJfIiwiaW5pdCIsInR5cGUiLCJfc3RyZWFtIiwiaXNPZmZlciIsInAiLCJQZWVyIiwiaW5pdGlhdG9yIiwib24iLCJkYXRhIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJhZGRPbkRhdGEiLCJzZHAiLCJwYXJzZSIsImxhYmVsIiwic2lnbmFsIiwiZXJyIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBSU8sU0FBU0MsYUFBVCxDQUF1QkMsR0FBdkIsRUFBZ0U7QUFDckUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUNFRCxTQUFTLENBQUNDLFlBQVYsSUFDQUQsU0FBUyxDQUFDRSxrQkFEVixJQUVBRixTQUFTLENBQUNHLGVBRlYsSUFHQUgsU0FBUyxDQUFDSSxjQUpaO0FBS0EsUUFBSSxDQUFDUCxHQUFMLEVBQVVBLEdBQUcsR0FBRztBQUFFUSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxNQUFNLEVBQUU7QUFBdkIsS0FBTjtBQUNWTixJQUFBQSxTQUFTLENBQUNPLFlBQVYsQ0FDR04sWUFESCxDQUNnQjtBQUFFTyxNQUFBQSxLQUFLLEVB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QVVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxJQUFmLENBQVYsRUFBZ0MsZUFBaEM7QUFDRCxtQkFGRDtBQUdEOztBQUNEWCxnQkFBQUEsSUFBSSxDQUFDZSxTQUFMLENBQWUsVUFBQUosSUFBSSxFQUFJO0FBQ3JCLHNCQUFNSyxHQUFHLEdBQUdILElBQUksQ0FBQ0ksS0FBTCxDQUFXTixJQUFJLENBQUNBLElBQWhCLENBQVo7O0FBQ0Esc0JBQUlBLElBQUksQ0FBQ08sS0FBTCxLQUFlLGVBQWYsSUFBa0NQLElBQUksQ0FBQ08sS0FBTCxLQUFlLGNBQXJELEVBQXFFO0FBQ25FWCxvQkFBQUEsQ0FBQyxDQUFDWSxNQUFGLENBQVNILEdBQVQ7QUFDRDtBQUNGLGlCQUxELEVBS0csUUFMSDtBQU1BVCxnQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssT0FBTCxFQUFjLFVBQUFVLEdBQUcsRUFBSTtBQUNuQkMsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUVGLG9CQUFBQSxHQUFHLEVBQUhBO0FBQUYsbUJBQVo7QUFDRCxpQkFGRDtBQUdBYixnQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssUUFBTCxFQUFlLFVBQUFmLE1BQU0sRUFBSTtBQUN2QixrQkFBQSxLQUFJLENBQUNNLFFBQUwsQ0FBY04sTUFBZDtBQUNELGlCQUZEO0FBR0FZLGdCQUFBQSxDQUFDLENBQUNHLEVBQUYsQ0FBSyxTQUFMLEVBQWdCLFlBQU0sQ0FBRSxDQUF4QiIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBQZWVyIGZyb20gXCJzaW1wbGUtcGVlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxWaWRlbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9IH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxBdWRpbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlLCB2aWRlbzogZmFsc2UgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihwZWVyOiBXZWJSVEMsIG9wdD86IHsgc3RyZWFtPzogTWVkaWFTdHJlYW07IHR5cGU/OiBNZWRpYVR5cGUgfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmluaXQocGVlciwgb3B0LnN0cmVhbSwgb3B0LnR5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHBlZXI6IFdlYlJUQywgX3N0cmVhbT86IE1lZGlhU3RyZWFtLCB0eXBlPzogTWVkaWFUeXBlKSB7XG4gICAgY29uc3Qgc3RyZWFtOiBNZWRpYVN0cmVhbSA9XG4gICAgICBfc3RyZWFtIHx8XG4gICAgICAoYXdhaXQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHR5cGUgJiYgKHR5cGUgYXMgTWVkaWFUeXBlKSA9PSBNZWRpYVR5cGUudmlkZW8pIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxWaWRlbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbEF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCkpO1xuXG4gICAgbGV0IHA6IFBlZXIuSW5zdGFuY2U7XG4gICAgaWYgKHBlZXIuaXNPZmZlcikge1xuICAgICAgcCA9IG5ldyBQZWVyKHsgaW5pdGlhdG9yOiB0cnVlLCBzdHJlYW0gfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSksIFwic3RyZWFtX29mZmVyXCIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHAgPSBuZXcgUGVlcih7IHN0cmVhbSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSwgXCJzdHJlYW1fYW5zd2VyXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHBlZXIuYWRkT25EYXRhKGRhdGEgPT4ge1xuICAgICAgY29uc3Qgc2RwID0gSlNPTi5wYXJzZShkYXRhLmRhdGEpO1xuICAgICAgaWYgKGRhdGEubGFiZWwgPT09IFwic3RyZWFtX2Fuc3dlclwiIHx8IGRhdGEubGFiZWwgPT09IFwic3RyZWFtX29mZmVyXCIpIHtcbiAgICAgICAgcC5zaWduYWwoc2RwKTtcbiAgICAgIH1cbiAgICB9LCBcInN0cmVhbVwiKTtcbiAgICBwLm9uKFwiZXJyb3JcIiwgZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHsgZXJyIH0pO1xuICAgIH0pO1xuICAgIHAub24oXCJzdHJlYW1cIiwgc3RyZWFtID0+IHtcbiAgICAgIHRoaXMub25TdHJlYW0oc3RyZWFtKTtcbiAgICB9KTtcbiAgICBwLm9uKFwiY29ubmVjdFwiLCAoKSA9PiB7fSk7XG4gIH1cbn1cbiJdfQ==