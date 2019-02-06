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
                        rtc.setSdp(JSON.parse(raw.data));
                      }
                    });
                  }, 500);
                } else {
                  peer.addOnData(function (raw) {
                    if (raw.label === "test_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJpbml0Iiwic3RyZWFtIiwidHlwZSIsInZpZGVvIiwicnRjIiwiV2ViUlRDIiwiaXNPZmZlciIsInNldFRpbWVvdXQiLCJtYWtlT2ZmZXIiLCJzaWduYWwiLCJzZHAiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZE9uRGF0YSIsInJhdyIsImxhYmVsIiwic2V0U2RwIiwicGFyc2UiLCJkYXRhIiwiYWRkT25BZGRUcmFjayIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUhBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFLWUMsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQVVTQyxNOzs7QUFHbkIsa0JBQVlDLElBQVosRUFBcUQ7QUFBQSxRQUEzQkMsR0FBMkIsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDbkQsU0FBS0MsUUFBTCxHQUFnQixVQUFBQyxDQUFDLEVBQUksQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLRixHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLRyxJQUFMLENBQVVKLElBQVY7QUFDRDs7Ozs7OztnREFFa0JBLEk7Ozs7Ozs7OytCQUVmLEtBQUtDLEdBQUwsQ0FBU0ksTTs7Ozs7Ozs7dUJBQ0Y7QUFBQTtBQUFBLHdDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQ0FDRixLQUFJLENBQUNKLEdBQUwsQ0FBU0ssSUFBVCxJQUFrQixLQUFJLENBQUNMLEdBQUwsQ0FBU0ssSUFBVixJQUFnQ1IsU0FBUyxDQUFDUyxLQUR6RDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGlDQUVTLDJCQUZUOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGlDQUlTLDJCQUpUOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQUQsSTs7Ozs7O0FBRkhGLGdCQUFBQSxNO0FBVUFHLGdCQUFBQSxHLEdBQU0sSUFBSUMsY0FBSixDQUFXO0FBQUVKLGtCQUFBQSxNQUFNLEVBQU5BO0FBQUYsaUJBQVgsQzs7QUFDWixvQkFBSUwsSUFBSSxDQUFDVSxPQUFULEVBQWtCO0FBQ2hCQyxrQkFBQUEsVUFBVSxDQUFDLFlBQU07QUFDZkgsb0JBQUFBLEdBQUcsQ0FBQ0ksU0FBSjs7QUFDQUosb0JBQUFBLEdBQUcsQ0FBQ0ssTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQmQsc0JBQUFBLElBQUksQ0FBQ2UsSUFBTCxDQUFVQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsR0FBZixDQUFWLEVBQStCLFlBQS9CO0FBQ0QscUJBRkQ7O0FBR0FkLG9CQUFBQSxJQUFJLENBQUNrQixTQUFMLENBQWUsVUFBQUMsR0FBRyxFQUFJO0FBQ3BCLDBCQUFJQSxHQUFHLENBQUNDLEtBQUosS0FBYyxhQUFsQixFQUFpQztBQUMvQlosd0JBQUFBLEdBQUcsQ0FBQ2EsTUFBSixDQUFXTCxJQUFJLENBQUNNLEtBQUwsQ0FBV0gsR0FBRyxDQUFDSSxJQUFmLENBQVg7QUFDRDtBQUNGLHFCQUpEO0FBS0QsbUJBVlMsRUFVUCxHQVZPLENBQVY7QUFXRCxpQkFaRCxNQVlPO0FBQ0x2QixrQkFBQUEsSUFBSSxDQUFDa0IsU0FBTCxDQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQix3QkFBSUEsR0FBRyxDQUFDQyxLQUFKLEtBQWMsWUFBbEIsRUFBZ0M7QUFDOUJaLHNCQUFBQSxHQUFHLENBQUNhLE1BQUosQ0FBV0wsSUFBSSxDQUFDTSxLQUFMLENBQVdILEdBQUcsQ0FBQ0ksSUFBZixDQUFYOztBQUNBZixzQkFBQUEsR0FBRyxDQUFDSyxNQUFKLEdBQWEsVUFBQUMsR0FBRyxFQUFJO0FBQ2xCZCx3QkFBQUEsSUFBSSxDQUFDZSxJQUFMLENBQVVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQVYsRUFBK0IsYUFBL0I7QUFDRCx1QkFGRDtBQUdEO0FBQ0YsbUJBUEQ7QUFRRDs7QUFDRE4sZ0JBQUFBLEdBQUcsQ0FBQ2dCLGFBQUosQ0FBa0IsVUFBQW5CLE1BQU0sRUFBSTtBQUMxQm9CLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWTtBQUFFckIsb0JBQUFBLE1BQU0sRUFBTkE7QUFBRixtQkFBWjs7QUFDQSxrQkFBQSxLQUFJLENBQUNILFFBQUwsQ0FBY0csTUFBZDtBQUNELGlCQUhEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgeyBnZXRMb2NhbFZpZGVvLCBnZXRMb2NhbEF1ZGlvIH0gZnJvbSBcIi4vdXRpbGxcIjtcblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmludGVyZmFjZSBPcHRpb24ge1xuICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcbiAgdHlwZT86IE1lZGlhVHlwZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgb25TdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuICBvcHQ6IE9wdGlvbjtcbiAgY29uc3RydWN0b3IocGVlcjogV2ViUlRDLCBvcHQ6IFBhcnRpYWw8T3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG4gICAgdGhpcy5pbml0KHBlZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHBlZXI6IFdlYlJUQykge1xuICAgIGNvbnN0IHN0cmVhbTogTWVkaWFTdHJlYW0gPVxuICAgICAgdGhpcy5vcHQuc3RyZWFtIHx8XG4gICAgICAoYXdhaXQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub3B0LnR5cGUgJiYgKHRoaXMub3B0LnR5cGUgYXMgTWVkaWFUeXBlKSA9PSBNZWRpYVR5cGUudmlkZW8pIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxWaWRlbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRMb2NhbEF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCkpO1xuXG4gICAgY29uc3QgcnRjID0gbmV3IFdlYlJUQyh7IHN0cmVhbSB9KTtcbiAgICBpZiAocGVlci5pc09mZmVyKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcnRjLm1ha2VPZmZlcigpO1xuICAgICAgICBydGMuc2lnbmFsID0gc2RwID0+IHtcbiAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgXCJ0ZXN0X29mZmVyXCIpO1xuICAgICAgICB9O1xuICAgICAgICBwZWVyLmFkZE9uRGF0YShyYXcgPT4ge1xuICAgICAgICAgIGlmIChyYXcubGFiZWwgPT09IFwidGVzdF9hbnN3ZXJcIikge1xuICAgICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IFwidGVzdF9vZmZlclwiKSB7XG4gICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgXCJ0ZXN0X2Fuc3dlclwiKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcnRjLmFkZE9uQWRkVHJhY2soc3RyZWFtID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHsgc3RyZWFtIH0pO1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=