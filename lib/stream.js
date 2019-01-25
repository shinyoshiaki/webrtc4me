"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaType = void 0;

var _index = _interopRequireDefault(require("./index"));

var _utill = require("./utill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

var MediaType;
exports.MediaType = MediaType;

(function (MediaType) {
  MediaType[MediaType["video"] = 0] = "video";
  MediaType[MediaType["audio"] = 1] = "audio";
})(MediaType || (exports.MediaType = MediaType = {}));

var Stream =
/*#__PURE__*/
function () {
  function Stream(peer) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Stream);

    _defineProperty(this, "onStream", void 0);

    _defineProperty(this, "opt", void 0);

    this.onStream = function (_) {};

    this.opt = opt;
    this.init(peer);
  }

  _createClass(Stream, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(peer) {
        var _this = this;

        var stream, rtc;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = this.opt.stream;

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
                          if (!(_this.opt.type && _this.opt.type == MediaType.video)) {
                            _context.next = 6;
                            break;
                          }

                          _context.next = 3;
                          return (0, _utill.getLocalVideo)();

                        case 3:
                          return _context.abrupt("return", _context.sent);

                        case 6:
                          _context.next = 8;
                          return (0, _utill.getLocalAudio)();

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
                  }, 500);
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

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return Stream;
}();

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJpbml0Iiwic3RyZWFtIiwidHlwZSIsInZpZGVvIiwicnRjIiwiV2ViUlRDIiwiaXNPZmZlciIsInNldFRpbWVvdXQiLCJtYWtlT2ZmZXIiLCJzaWduYWwiLCJzZHAiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZE9uRGF0YSIsInJhdyIsImxhYmVsIiwic2V0QW5zd2VyIiwicGFyc2UiLCJkYXRhIiwibWFrZUFuc3dlciIsImFkZE9uQWRkVHJhY2siLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFIQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0lBS1lDLFM7OztXQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7R0FBQUEsUyx5QkFBQUEsUzs7SUFVU0MsTTs7O0FBR25CLGtCQUFZQyxJQUFaLEVBQXFEO0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ25ELFNBQUtDLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0YsR0FBTCxHQUFXQSxHQUFYO0FBQ0EsU0FBS0csSUFBTCxDQUFVSixJQUFWO0FBQ0Q7Ozs7Ozs7Z0RBRWtCQSxJOzs7Ozs7OzsrQkFFZixLQUFLQyxHQUFMLENBQVNJLE07Ozs7Ozs7O3VCQUNGO0FBQUE7QUFBQSx3Q0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0NBQ0YsS0FBSSxDQUFDSixHQUFMLENBQVNLLElBQVQsSUFBa0IsS0FBSSxDQUFDTCxHQUFMLENBQVNLLElBQVYsSUFBZ0NSLFNBQVMsQ0FBQ1MsS0FEekQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxpQ0FFUywyQkFGVDs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQ0FJUywyQkFKVDs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFELEk7Ozs7OztBQUZIRixnQkFBQUEsTTtBQVVBRyxnQkFBQUEsRyxHQUFNLElBQUlDLGNBQUosQ0FBVztBQUFFSixrQkFBQUEsTUFBTSxFQUFOQTtBQUFGLGlCQUFYLEM7O0FBQ1osb0JBQUlMLElBQUksQ0FBQ1UsT0FBVCxFQUFrQjtBQUNoQkMsa0JBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2ZILG9CQUFBQSxHQUFHLENBQUNJLFNBQUo7O0FBQ0FKLG9CQUFBQSxHQUFHLENBQUNLLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJkLHNCQUFBQSxJQUFJLENBQUNlLElBQUwsQ0FBVUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBVixFQUErQixZQUEvQjtBQUNELHFCQUZEOztBQUdBZCxvQkFBQUEsSUFBSSxDQUFDa0IsU0FBTCxDQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQiwwQkFBSUEsR0FBRyxDQUFDQyxLQUFKLEtBQWMsYUFBbEIsRUFBaUM7QUFDL0JaLHdCQUFBQSxHQUFHLENBQUNhLFNBQUosQ0FBY0wsSUFBSSxDQUFDTSxLQUFMLENBQVdILEdBQUcsQ0FBQ0ksSUFBZixDQUFkO0FBQ0Q7QUFDRixxQkFKRDtBQUtELG1CQVZTLEVBVVAsR0FWTyxDQUFWO0FBV0QsaUJBWkQsTUFZTztBQUNMdkIsa0JBQUFBLElBQUksQ0FBQ2tCLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEIsd0JBQUlBLEdBQUcsQ0FBQ0MsS0FBSixLQUFjLFlBQWxCLEVBQWdDO0FBQzlCWixzQkFBQUEsR0FBRyxDQUFDZ0IsVUFBSixDQUFlUixJQUFJLENBQUNNLEtBQUwsQ0FBV0gsR0FBRyxDQUFDSSxJQUFmLENBQWY7O0FBQ0FmLHNCQUFBQSxHQUFHLENBQUNLLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJkLHdCQUFBQSxJQUFJLENBQUNlLElBQUwsQ0FBVUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBVixFQUErQixhQUEvQjtBQUNELHVCQUZEO0FBR0Q7QUFDRixtQkFQRDtBQVFEOztBQUNETixnQkFBQUEsR0FBRyxDQUFDaUIsYUFBSixDQUFrQixVQUFBcEIsTUFBTSxFQUFJO0FBQzFCcUIsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUV0QixvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFaOztBQUNBLGtCQUFBLEtBQUksQ0FBQ0gsUUFBTCxDQUFjRyxNQUFkO0FBQ0QsaUJBSEQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IGdldExvY2FsVmlkZW8sIGdldExvY2FsQXVkaW8gfSBmcm9tIFwiLi91dGlsbFwiO1xuXG5leHBvcnQgZW51bSBNZWRpYVR5cGUge1xuICB2aWRlbyxcbiAgYXVkaW9cbn1cblxuaW50ZXJmYWNlIE9wdGlvbiB7XG4gIHN0cmVhbT86IE1lZGlhU3RyZWFtO1xuICB0eXBlPzogTWVkaWFUeXBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIG9wdDogT3B0aW9uO1xuICBjb25zdHJ1Y3RvcihwZWVyOiBXZWJSVEMsIG9wdDogUGFydGlhbDxPcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcbiAgICB0aGlzLmluaXQocGVlcik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQocGVlcjogV2ViUlRDKSB7XG4gICAgY29uc3Qgc3RyZWFtOiBNZWRpYVN0cmVhbSA9XG4gICAgICB0aGlzLm9wdC5zdHJlYW0gfHxcbiAgICAgIChhd2FpdCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vcHQudHlwZSAmJiAodGhpcy5vcHQudHlwZSBhcyBNZWRpYVR5cGUpID09IE1lZGlhVHlwZS52aWRlbykge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbFZpZGVvKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldExvY2FsQXVkaW8oKTtcbiAgICAgICAgfVxuICAgICAgfSkoKSk7XG5cbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBydGMubWFrZU9mZmVyKCk7XG4gICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCBcInRlc3Rfb2ZmZXJcIik7XG4gICAgICAgIH07XG4gICAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gXCJ0ZXN0X2Fuc3dlclwiKSB7XG4gICAgICAgICAgICBydGMuc2V0QW5zd2VyKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gXCJ0ZXN0X29mZmVyXCIpIHtcbiAgICAgICAgICBydGMubWFrZUFuc3dlcihKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgXCJ0ZXN0X2Fuc3dlclwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcnRjLmFkZE9uQWRkVHJhY2soc3RyZWFtID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHsgc3RyZWFtIH0pO1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=