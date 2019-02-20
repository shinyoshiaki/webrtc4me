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

    _defineProperty(this, "label", void 0);

    this.onStream = function (_) {};

    this.opt = opt;
    this.label = opt.label || "stream";
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
                  rtc.makeOffer();

                  rtc.signal = function (sdp) {
                    peer.send(JSON.stringify(sdp), _this.label + "_offer");
                  };

                  peer.addOnData(function (raw) {
                    if (raw.label === _this.label + "_answer") {
                      rtc.setSdp(JSON.parse(raw.data));
                    }
                  }, this.label); //送信側受信側のdcチャネルを同期
                } else {
                  peer.addOnData(function (raw) {
                    console.log("label", _this.label);

                    if (raw.label === _this.label + "_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), _this.label + "_answer");
                      };
                    }
                  }, this.label); //送信側受信側のdcチャネルを同期
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJsYWJlbCIsImluaXQiLCJzdHJlYW0iLCJ0eXBlIiwidmlkZW8iLCJydGMiLCJXZWJSVEMiLCJpc09mZmVyIiwibWFrZU9mZmVyIiwic2lnbmFsIiwic2RwIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJhZGRPbkRhdGEiLCJyYXciLCJzZXRTZHAiLCJwYXJzZSIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiYWRkT25BZGRUcmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBSEFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQUtZQyxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBV1NDLE07OztBQUluQixrQkFBWUMsSUFBWixFQUFxRDtBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNuRCxTQUFLQyxRQUFMLEdBQWdCLFVBQUFDLENBQUMsRUFBSSxDQUFFLENBQXZCOztBQUNBLFNBQUtGLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtHLEtBQUwsR0FBYUgsR0FBRyxDQUFDRyxLQUFKLElBQWEsUUFBMUI7QUFDQSxTQUFLQyxJQUFMLENBQVVMLElBQVY7QUFDRDs7Ozs7OztnREFFa0JBLEk7Ozs7Ozs7OytCQUVmLEtBQUtDLEdBQUwsQ0FBU0ssTTs7Ozs7Ozs7dUJBQ0Y7QUFBQTtBQUFBLHdDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQ0FDRixLQUFJLENBQUNMLEdBQUwsQ0FBU00sSUFBVCxJQUFrQixLQUFJLENBQUNOLEdBQUwsQ0FBU00sSUFBVixJQUFnQ1QsU0FBUyxDQUFDVSxLQUR6RDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGlDQUVTLDJCQUZUOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGlDQUlTLDJCQUpUOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQUQsSTs7Ozs7O0FBRkhGLGdCQUFBQSxNO0FBVUFHLGdCQUFBQSxHLEdBQU0sSUFBSUMsY0FBSixDQUFXO0FBQUVKLGtCQUFBQSxNQUFNLEVBQU5BO0FBQUYsaUJBQVgsQzs7QUFDWixvQkFBSU4sSUFBSSxDQUFDVyxPQUFULEVBQWtCO0FBQ2hCRixrQkFBQUEsR0FBRyxDQUFDRyxTQUFKOztBQUNBSCxrQkFBQUEsR0FBRyxDQUFDSSxNQUFKLEdBQWEsVUFBQUMsR0FBRyxFQUFJO0FBQ2xCZCxvQkFBQUEsSUFBSSxDQUFDZSxJQUFMLENBQVVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQVYsRUFBK0IsS0FBSSxDQUFDVixLQUFMLEdBQWEsUUFBNUM7QUFDRCxtQkFGRDs7QUFHQUosa0JBQUFBLElBQUksQ0FBQ2tCLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEIsd0JBQUlBLEdBQUcsQ0FBQ2YsS0FBSixLQUFjLEtBQUksQ0FBQ0EsS0FBTCxHQUFhLFNBQS9CLEVBQTBDO0FBQ3hDSyxzQkFBQUEsR0FBRyxDQUFDVyxNQUFKLENBQVdKLElBQUksQ0FBQ0ssS0FBTCxDQUFXRixHQUFHLENBQUNHLElBQWYsQ0FBWDtBQUNEO0FBQ0YsbUJBSkQsRUFJRyxLQUFLbEIsS0FKUixFQUxnQixDQVNBO0FBQ2pCLGlCQVZELE1BVU87QUFDTEosa0JBQUFBLElBQUksQ0FBQ2tCLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEJJLG9CQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLEtBQUksQ0FBQ3BCLEtBQTFCOztBQUNBLHdCQUFJZSxHQUFHLENBQUNmLEtBQUosS0FBYyxLQUFJLENBQUNBLEtBQUwsR0FBYSxRQUEvQixFQUF5QztBQUN2Q0ssc0JBQUFBLEdBQUcsQ0FBQ1csTUFBSixDQUFXSixJQUFJLENBQUNLLEtBQUwsQ0FBV0YsR0FBRyxDQUFDRyxJQUFmLENBQVg7O0FBQ0FiLHNCQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJkLHdCQUFBQSxJQUFJLENBQUNlLElBQUwsQ0FBVUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBVixFQUErQixLQUFJLENBQUNWLEtBQUwsR0FBYSxTQUE1QztBQUNELHVCQUZEO0FBR0Q7QUFDRixtQkFSRCxFQVFHLEtBQUtBLEtBUlIsRUFESyxDQVNXO0FBQ2pCOztBQUNESyxnQkFBQUEsR0FBRyxDQUFDZ0IsYUFBSixDQUFrQixVQUFBbkIsTUFBTSxFQUFJO0FBQzFCaUIsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUVsQixvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFaOztBQUNBLGtCQUFBLEtBQUksQ0FBQ0osUUFBTCxDQUFjSSxNQUFkO0FBQ0QsaUJBSEQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IGdldExvY2FsVmlkZW8sIGdldExvY2FsQXVkaW8gfSBmcm9tIFwiLi91dGlsbFwiO1xuXG5leHBvcnQgZW51bSBNZWRpYVR5cGUge1xuICB2aWRlbyxcbiAgYXVkaW9cbn1cblxuaW50ZXJmYWNlIE9wdGlvbiB7XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIHR5cGU6IE1lZGlhVHlwZTtcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgb25TdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuICBvcHQ6IFBhcnRpYWw8T3B0aW9uPjtcbiAgbGFiZWw6IHN0cmluZztcbiAgY29uc3RydWN0b3IocGVlcjogV2ViUlRDLCBvcHQ6IFBhcnRpYWw8T3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG4gICAgdGhpcy5sYWJlbCA9IG9wdC5sYWJlbCB8fCBcInN0cmVhbVwiO1xuICAgIHRoaXMuaW5pdChwZWVyKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdChwZWVyOiBXZWJSVEMpIHtcbiAgICBjb25zdCBzdHJlYW06IE1lZGlhU3RyZWFtID1cbiAgICAgIHRoaXMub3B0LnN0cmVhbSB8fFxuICAgICAgKGF3YWl0IChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9wdC50eXBlICYmICh0aGlzLm9wdC50eXBlIGFzIE1lZGlhVHlwZSkgPT0gTWVkaWFUeXBlLnZpZGVvKSB7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldExvY2FsVmlkZW8oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxBdWRpbygpO1xuICAgICAgICB9XG4gICAgICB9KSgpKTtcblxuICAgIGNvbnN0IHJ0YyA9IG5ldyBXZWJSVEMoeyBzdHJlYW0gfSk7XG4gICAgaWYgKHBlZXIuaXNPZmZlcikge1xuICAgICAgcnRjLm1ha2VPZmZlcigpO1xuICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIik7XG4gICAgICB9O1xuICAgICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gdGhpcy5sYWJlbCArIFwiX2Fuc3dlclwiKSB7XG4gICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMubGFiZWwpOyAvL+mAgeS/oeWBtOWPl+S/oeWBtOOBrmRj44OB44Oj44ON44Or44KS5ZCM5pyfXG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibGFiZWxcIiwgdGhpcy5sYWJlbCk7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9vZmZlclwiKSB7XG4gICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX2Fuc3dlclwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmxhYmVsKTvjgIAvL+mAgeS/oeWBtOWPl+S/oeWBtOOBrmRj44OB44Oj44ON44Or44KS5ZCM5pyfXG4gICAgfVxuICAgIHJ0Yy5hZGRPbkFkZFRyYWNrKHN0cmVhbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IHN0cmVhbSB9KTtcbiAgICAgIHRoaXMub25TdHJlYW0oc3RyZWFtKTtcbiAgICB9KTtcbiAgfVxufVxuIl19