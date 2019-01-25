"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;
exports.default = exports.MediaType = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLocalVideo(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      audio: true,
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
    navigator.getUserMedia = navigator.getUserMedia;
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

        var stream, rtc;
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
                // stream.getTracks().forEach(track => peer.rtc.addTrack(track, stream));
                // peer.rtc.ontrack = (event: RTCTrackEvent) => {
                //   console.log("ontrack", { event });
                //   const stream = event.streams[0];
                //   this.onStream(stream);
                // };
                rtc = new _index.default({
                  stream: stream
                });

                if (peer.isOffer) {
                  setTimeout(function () {
                    rtc.makeOffer();

                    rtc.signal = function (sdp) {
                      peer.send(JSON.stringify(sdp), "test_offer");
                    };

                    peer.addOnData(function (raw) {
                      if (raw.label === "test_answer") {
                        rtc.setAnswer(JSON.parse(raw.data));
                      }
                    });
                  }, 1000);
                } else {
                  peer.addOnData(function (raw) {
                    if (raw.label === "test_offer") {
                      rtc.makeAnswer(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), "test_answer");
                      };
                    }
                  });
                }

                rtc.addOnAddTrack(function (stream) {
                  console.log({
                    stream: stream
                  });

                  _this.onStream(stream);
                });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsiZ2V0TG9jYWxWaWRlbyIsIm9wdCIsIlByb21pc2UiLCJyZXNvbHZlIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJhdWRpbyIsInZpZGVvIiwidGhlbiIsInN0cmVhbSIsImdldExvY2FsQXVkaW8iLCJNZWRpYVR5cGUiLCJTdHJlYW0iLCJwZWVyIiwib25TdHJlYW0iLCJfIiwiaW5pdCIsInR5cGUiLCJfc3RyZWFtIiwicnRjIiwiV2ViUlRDIiwiaXNPZmZlciIsInNldFRpbWVvdXQiLCJtYWtlT2ZmZXIiLCJzaWduYWwiLCJzZHAiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZE9uRGF0YSIsInJhdyIsImxhYmVsIiwic2V0QW5zd2VyIiwicGFyc2UiLCJkYXRhIiwibWFrZUFuc3dlciIsImFkZE9uQWRkVHJhY2siLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLFNBQVNBLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQWdFO0FBQ3JFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FBeUJELFNBQVMsQ0FBQ0MsWUFBbkM7QUFFQSxRQUFJLENBQUNKLEdBQUwsRUFBVUEsR0FBRyxHQUFHO0FBQUVLLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLE1BQU0sRUFBRTtBQUF2QixLQUFOO0FBQ1ZILElBQUFBLFNBQVMsQ0FBQ0ksWUFBVixDQUNHSCxZQURILENBQ2dCO0FBQ1pJLE1BQUFBLEtBQUssRUFBRSxJQURLO0FBRVpDLE1BQUFBLEtBQUssRUFBRTtBQUFFSixRQUFBQSxLQUFLLEVBQUVMLEdBQUcsQ0FBQ0ssS0FBYjtBQUFvQkMsUUFBQUEsTUFBTSxFQUFFTixHQUFHLENBQUNNO0FB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d0JBQUlBLEdBQUcsQ0FBQ0MsS0FBSixLQUFjLFlBQWxCLEVBQWdDO0FBQzlCWixzQkFBQUEsR0FBRyxDQUFDZ0IsVUFBSixDQUFlUixJQUFJLENBQUNNLEtBQUwsQ0FBV0gsR0FBRyxDQUFDSSxJQUFmLENBQWY7O0FBQ0FmLHNCQUFBQSxHQUFHLENBQUNLLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJaLHdCQUFBQSxJQUFJLENBQUNhLElBQUwsQ0FBVUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBVixFQUErQixhQUEvQjtBQUNELHVCQUZEO0FBR0Q7QUFDRixtQkFQRDtBQVFEOztBQUNETixnQkFBQUEsR0FBRyxDQUFDaUIsYUFBSixDQUFrQixVQUFBM0IsTUFBTSxFQUFJO0FBQzFCNEIsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUU3QixvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFaOztBQUNBLGtCQUFBLEtBQUksQ0FBQ0ssUUFBTCxDQUFjTCxNQUFkO0FBQ0QsaUJBSEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFZpZGVvKG9wdD86IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSkge1xuICByZXR1cm4gbmV3IFByb21pc2U8TWVkaWFTdHJlYW0+KChyZXNvbHZlOiAodjogTWVkaWFTdHJlYW0pID0+IHZvaWQpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYTtcblxuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoe1xuICAgICAgICBhdWRpbzogdHJ1ZSxcbiAgICAgICAgdmlkZW86IHsgd2lkdGg6IG9wdC53aWR0aCwgaGVpZ2h0OiBvcHQuaGVpZ2h0IH1cbiAgICAgIH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxBdWRpbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlLCB2aWRlbzogZmFsc2UgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihwZWVyOiBXZWJSVEMsIG9wdD86IHsgc3RyZWFtPzogTWVkaWFTdHJlYW07IHR5cGU/OiBNZWRpYVR5cGUgfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmluaXQocGVlciwgb3B0LnN0cmVhbSwgb3B0LnR5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHBlZXI6IFdlYlJUQywgX3N0cmVhbT86IE1lZGlhU3RyZWFtLCB0eXBlPzogTWVkaWFUeXBlKSB7XG4gICAgY29uc3Qgc3RyZWFtOiBNZWRpYVN0cmVhbSA9XG4gICAgICBfc3RyZWFtIHx8XG4gICAgICAoYXdhaXQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHR5cGUgJiYgKHR5cGUgYXMgTWVkaWFUeXBlKSA9PSBNZWRpYVR5cGUudmlkZW8pIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxWaWRlbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbEF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCkpO1xuXG4gICAgLy8gc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gcGVlci5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIC8vIHBlZXIucnRjLm9udHJhY2sgPSAoZXZlbnQ6IFJUQ1RyYWNrRXZlbnQpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwib250cmFja1wiLCB7IGV2ZW50IH0pO1xuXG4gICAgLy8gICBjb25zdCBzdHJlYW0gPSBldmVudC5zdHJlYW1zWzBdO1xuXG4gICAgLy8gICB0aGlzLm9uU3RyZWFtKHN0cmVhbSk7XG4gICAgLy8gfTtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBydGMubWFrZU9mZmVyKCk7XG4gICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCBcInRlc3Rfb2ZmZXJcIik7XG4gICAgICAgIH07XG4gICAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gXCJ0ZXN0X2Fuc3dlclwiKSB7XG4gICAgICAgICAgICBydGMuc2V0QW5zd2VyKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IFwidGVzdF9vZmZlclwiKSB7XG4gICAgICAgICAgcnRjLm1ha2VBbnN3ZXIoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIFwidGVzdF9hbnN3ZXJcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJ0Yy5hZGRPbkFkZFRyYWNrKHN0cmVhbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IHN0cmVhbSB9KTtcbiAgICAgIHRoaXMub25TdHJlYW0oc3RyZWFtKTtcbiAgICB9KTtcbiAgfVxufVxuIl19