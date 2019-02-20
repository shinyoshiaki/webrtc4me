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
                  setTimeout(function () {
                    rtc.makeOffer();

                    rtc.signal = function (sdp) {
                      peer.send(JSON.stringify(sdp), _this.label + "_offer");
                    };

                    peer.addOnData(function (raw) {
                      if (raw.label === _this.label + "_answer") {
                        rtc.setSdp(JSON.parse(raw.data));
                      }
                    });
                  }, 500);
                } else {
                  peer.addOnData(function (raw) {
                    if (raw.label === _this.label + "_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), _this.label + "_answer");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJsYWJlbCIsImluaXQiLCJzdHJlYW0iLCJ0eXBlIiwidmlkZW8iLCJydGMiLCJXZWJSVEMiLCJpc09mZmVyIiwic2V0VGltZW91dCIsIm1ha2VPZmZlciIsInNpZ25hbCIsInNkcCIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiYWRkT25EYXRhIiwicmF3Iiwic2V0U2RwIiwicGFyc2UiLCJkYXRhIiwiYWRkT25BZGRUcmFjayIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUhBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFLWUMsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQVdTQyxNOzs7QUFJbkIsa0JBQVlDLElBQVosRUFBcUQ7QUFBQSxRQUEzQkMsR0FBMkIsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDbkQsU0FBS0MsUUFBTCxHQUFnQixVQUFBQyxDQUFDLEVBQUksQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLRixHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLRyxLQUFMLEdBQWFILEdBQUcsQ0FBQ0csS0FBSixJQUFhLFFBQTFCO0FBQ0EsU0FBS0MsSUFBTCxDQUFVTCxJQUFWO0FBQ0Q7Ozs7Ozs7Z0RBRWtCQSxJOzs7Ozs7OzsrQkFFZixLQUFLQyxHQUFMLENBQVNLLE07Ozs7Ozs7O3VCQUNGO0FBQUE7QUFBQSx3Q0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0NBQ0YsS0FBSSxDQUFDTCxHQUFMLENBQVNNLElBQVQsSUFBa0IsS0FBSSxDQUFDTixHQUFMLENBQVNNLElBQVYsSUFBZ0NULFNBQVMsQ0FBQ1UsS0FEekQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxpQ0FFUywyQkFGVDs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQ0FJUywyQkFKVDs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFELEk7Ozs7OztBQUZIRixnQkFBQUEsTTtBQVVBRyxnQkFBQUEsRyxHQUFNLElBQUlDLGNBQUosQ0FBVztBQUFFSixrQkFBQUEsTUFBTSxFQUFOQTtBQUFGLGlCQUFYLEM7O0FBQ1osb0JBQUlOLElBQUksQ0FBQ1csT0FBVCxFQUFrQjtBQUNoQkMsa0JBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2ZILG9CQUFBQSxHQUFHLENBQUNJLFNBQUo7O0FBQ0FKLG9CQUFBQSxHQUFHLENBQUNLLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJmLHNCQUFBQSxJQUFJLENBQUNnQixJQUFMLENBQVVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQVYsRUFBK0IsS0FBSSxDQUFDWCxLQUFMLEdBQWEsUUFBNUM7QUFDRCxxQkFGRDs7QUFHQUosb0JBQUFBLElBQUksQ0FBQ21CLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEIsMEJBQUlBLEdBQUcsQ0FBQ2hCLEtBQUosS0FBYyxLQUFJLENBQUNBLEtBQUwsR0FBYSxTQUEvQixFQUEwQztBQUN4Q0ssd0JBQUFBLEdBQUcsQ0FBQ1ksTUFBSixDQUFXSixJQUFJLENBQUNLLEtBQUwsQ0FBV0YsR0FBRyxDQUFDRyxJQUFmLENBQVg7QUFDRDtBQUNGLHFCQUpEO0FBS0QsbUJBVlMsRUFVUCxHQVZPLENBQVY7QUFXRCxpQkFaRCxNQVlPO0FBQ0x2QixrQkFBQUEsSUFBSSxDQUFDbUIsU0FBTCxDQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQix3QkFBSUEsR0FBRyxDQUFDaEIsS0FBSixLQUFjLEtBQUksQ0FBQ0EsS0FBTCxHQUFhLFFBQS9CLEVBQXlDO0FBQ3ZDSyxzQkFBQUEsR0FBRyxDQUFDWSxNQUFKLENBQVdKLElBQUksQ0FBQ0ssS0FBTCxDQUFXRixHQUFHLENBQUNHLElBQWYsQ0FBWDs7QUFDQWQsc0JBQUFBLEdBQUcsQ0FBQ0ssTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQmYsd0JBQUFBLElBQUksQ0FBQ2dCLElBQUwsQ0FBVUMsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBVixFQUErQixLQUFJLENBQUNYLEtBQUwsR0FBYSxTQUE1QztBQUNELHVCQUZEO0FBR0Q7QUFDRixtQkFQRDtBQVFEOztBQUNESyxnQkFBQUEsR0FBRyxDQUFDZSxhQUFKLENBQWtCLFVBQUFsQixNQUFNLEVBQUk7QUFDMUJtQixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk7QUFBRXBCLG9CQUFBQSxNQUFNLEVBQU5BO0FBQUYsbUJBQVo7O0FBQ0Esa0JBQUEsS0FBSSxDQUFDSixRQUFMLENBQWNJLE1BQWQ7QUFDRCxpQkFIRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgZ2V0TG9jYWxWaWRlbywgZ2V0TG9jYWxBdWRpbyB9IGZyb20gXCIuL3V0aWxsXCI7XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uIHtcbiAgc3RyZWFtOiBNZWRpYVN0cmVhbTtcbiAgdHlwZTogTWVkaWFUeXBlO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIG9wdDogUGFydGlhbDxPcHRpb24+O1xuICBsYWJlbDogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihwZWVyOiBXZWJSVEMsIG9wdDogUGFydGlhbDxPcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLm9wdCA9IG9wdDtcbiAgICB0aGlzLmxhYmVsID0gb3B0LmxhYmVsIHx8IFwic3RyZWFtXCI7XG4gICAgdGhpcy5pbml0KHBlZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHBlZXI6IFdlYlJUQykge1xuICAgIGNvbnN0IHN0cmVhbTogTWVkaWFTdHJlYW0gPVxuICAgICAgdGhpcy5vcHQuc3RyZWFtIHx8XG4gICAgICAoYXdhaXQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub3B0LnR5cGUgJiYgKHRoaXMub3B0LnR5cGUgYXMgTWVkaWFUeXBlKSA9PSBNZWRpYVR5cGUudmlkZW8pIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxWaWRlbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbEF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCkpO1xuXG4gICAgY29uc3QgcnRjID0gbmV3IFdlYlJUQyh7IHN0cmVhbSB9KTtcbiAgICBpZiAocGVlci5pc09mZmVyKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcnRjLm1ha2VPZmZlcigpO1xuICAgICAgICBydGMuc2lnbmFsID0gc2RwID0+IHtcbiAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgICB9O1xuICAgICAgICBwZWVyLmFkZE9uRGF0YShyYXcgPT4ge1xuICAgICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIikge1xuICAgICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9vZmZlclwiKSB7XG4gICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX2Fuc3dlclwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcnRjLmFkZE9uQWRkVHJhY2soc3RyZWFtID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHsgc3RyZWFtIH0pO1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=