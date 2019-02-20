"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaType = void 0;

var _2 = _interopRequireDefault(require("./"));

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

    this.peer = peer;
    this.opt = opt;

    _defineProperty(this, "onStream", void 0);

    _defineProperty(this, "onLocalStream", void 0);

    _defineProperty(this, "label", void 0);

    this.onStream = function (_) {};

    this.onLocalStream = function (_) {};

    this.label = opt.label || "stream";
    this.listen();
  }

  _createClass(Stream, [{
    key: "listen",
    value: function () {
      var _listen = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var label, stream, done;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                label = "init_" + this.label;
                done = false;
                this.peer.addOnData(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    done = true;

                    if (stream) {
                      _this.init(stream);
                    }
                  }
                }, label);

                if (!this.opt.get) {
                  _context.next = 8;
                  break;
                }

                _context.next = 6;
                return this.opt.get.catch(console.log);

              case 6:
                stream = _context.sent;
                this.onLocalStream(stream);

              case 8:
                if (done) {
                  this.init(stream);
                }

                if (stream) {
                  this.peer.send("done", label);
                }

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function listen() {
        return _listen.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(stream) {
        var _this2 = this;

        var peer, rtc;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                peer = this.peer;
                rtc = new _2.default({
                  stream: stream
                });

                if (peer.isOffer) {
                  rtc.makeOffer();

                  rtc.signal = function (sdp) {
                    peer.send(JSON.stringify(sdp), _this2.label + "_offer");
                  };

                  peer.addOnData(function (raw) {
                    if (raw.label === _this2.label + "_answer") {
                      rtc.setSdp(JSON.parse(raw.data));
                    }
                  }, this.label);
                } else {
                  peer.addOnData(function (raw) {
                    console.log("label", _this2.label);

                    if (raw.label === _this2.label + "_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), _this2.label + "_answer");
                      };
                    }
                  }, this.label);
                }

                rtc.addOnAddTrack(function (stream) {
                  console.log({
                    stream: stream
                  });

                  _this2.onStream(stream);
                });

              case 4:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJvbkxvY2FsU3RyZWFtIiwibGFiZWwiLCJsaXN0ZW4iLCJkb25lIiwiYWRkT25EYXRhIiwicmF3IiwiZGF0YSIsInN0cmVhbSIsImluaXQiLCJnZXQiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwicnRjIiwiV2ViUlRDIiwiaXNPZmZlciIsIm1ha2VPZmZlciIsInNpZ25hbCIsInNkcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRTZHAiLCJwYXJzZSIsImFkZE9uQWRkVHJhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQUZBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFXWUMsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQVVTQyxNOzs7QUFLbkIsa0JBQW9CQyxJQUFwQixFQUFxRTtBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ25FLFNBQUtDLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixVQUFBRCxDQUFDLEVBQUksQ0FBRSxDQUE1Qjs7QUFDQSxTQUFLRSxLQUFMLEdBQWFKLEdBQUcsQ0FBQ0ksS0FBSixJQUFhLFFBQTFCO0FBQ0EsU0FBS0MsTUFBTDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7QUFFekJFLGdCQUFBQSxJLEdBQU8sSztBQUNYLHFCQUFLUCxJQUFMLENBQVVRLFNBQVYsQ0FBb0IsVUFBQUMsR0FBRyxFQUFJO0FBQ3pCLHNCQUFJQSxHQUFHLENBQUNKLEtBQUosS0FBY0EsS0FBZCxJQUF1QkksR0FBRyxDQUFDQyxJQUFKLEtBQWEsTUFBeEMsRUFBZ0Q7QUFDOUNILG9CQUFBQSxJQUFJLEdBQUcsSUFBUDs7QUFDQSx3QkFBSUksTUFBSixFQUFZO0FBQ1Ysc0JBQUEsS0FBSSxDQUFDQyxJQUFMLENBQVVELE1BQVY7QUFDRDtBQUNGO0FBQ0YsaUJBUEQsRUFPR04sS0FQSDs7cUJBUUksS0FBS0osR0FBTCxDQUFTWSxHOzs7Ozs7dUJBQ0ssS0FBS1osR0FBTCxDQUFTWSxHQUFULENBQWFDLEtBQWIsQ0FBbUJDLE9BQU8sQ0FBQ0MsR0FBM0IsQzs7O0FBQWhCTCxnQkFBQUEsTTtBQUNBLHFCQUFLUCxhQUFMLENBQW1CTyxNQUFuQjs7O0FBRUYsb0JBQUlKLElBQUosRUFBVTtBQUNSLHVCQUFLSyxJQUFMLENBQVVELE1BQVY7QUFDRDs7QUFDRCxvQkFBSUEsTUFBSixFQUFZO0FBQ1YsdUJBQUtYLElBQUwsQ0FBVWlCLElBQVYsQ0FBZSxNQUFmLEVBQXVCWixLQUF2QjtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBR2dCTSxNOzs7Ozs7OztBQUNYWCxnQkFBQUEsSSxHQUFPLEtBQUtBLEk7QUFDWmtCLGdCQUFBQSxHLEdBQU0sSUFBSUMsVUFBSixDQUFXO0FBQUVSLGtCQUFBQSxNQUFNLEVBQU5BO0FBQUYsaUJBQVgsQzs7QUFDWixvQkFBSVgsSUFBSSxDQUFDb0IsT0FBVCxFQUFrQjtBQUNoQkYsa0JBQUFBLEdBQUcsQ0FBQ0csU0FBSjs7QUFDQUgsa0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQnZCLG9CQUFBQSxJQUFJLENBQUNpQixJQUFMLENBQVVPLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDbEIsS0FBTCxHQUFhLFFBQTVDO0FBQ0QsbUJBRkQ7O0FBR0FMLGtCQUFBQSxJQUFJLENBQUNRLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEIsd0JBQUlBLEdBQUcsQ0FBQ0osS0FBSixLQUFjLE1BQUksQ0FBQ0EsS0FBTCxHQUFhLFNBQS9CLEVBQTBDO0FBQ3hDYSxzQkFBQUEsR0FBRyxDQUFDUSxNQUFKLENBQVdGLElBQUksQ0FBQ0csS0FBTCxDQUFXbEIsR0FBRyxDQUFDQyxJQUFmLENBQVg7QUFDRDtBQUNGLG1CQUpELEVBSUcsS0FBS0wsS0FKUjtBQUtELGlCQVZELE1BVU87QUFDTEwsa0JBQUFBLElBQUksQ0FBQ1EsU0FBTCxDQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQk0sb0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVosRUFBcUIsTUFBSSxDQUFDWCxLQUExQjs7QUFDQSx3QkFBSUksR0FBRyxDQUFDSixLQUFKLEtBQWMsTUFBSSxDQUFDQSxLQUFMLEdBQWEsUUFBL0IsRUFBeUM7QUFDdkNhLHNCQUFBQSxHQUFHLENBQUNRLE1BQUosQ0FBV0YsSUFBSSxDQUFDRyxLQUFMLENBQVdsQixHQUFHLENBQUNDLElBQWYsQ0FBWDs7QUFDQVEsc0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQnZCLHdCQUFBQSxJQUFJLENBQUNpQixJQUFMLENBQVVPLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDbEIsS0FBTCxHQUFhLFNBQTVDO0FBQ0QsdUJBRkQ7QUFHRDtBQUNGLG1CQVJELEVBUUcsS0FBS0EsS0FSUjtBQVNEOztBQUNEYSxnQkFBQUEsR0FBRyxDQUFDVSxhQUFKLENBQWtCLFVBQUFqQixNQUFNLEVBQUk7QUFDMUJJLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWTtBQUFFTCxvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFaOztBQUNBLGtCQUFBLE1BQUksQ0FBQ1QsUUFBTCxDQUFjUyxNQUFkO0FBQ0QsaUJBSEQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBnZXRMb2NhbEF1ZGlvLCBnZXRMb2NhbERlc2t0b3AsIGdldExvY2FsVmlkZW8gfSBmcm9tIFwiLi91dGlsbFwiO1xuXG50eXBlIEdldCA9XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxBdWRpbz5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbERlc2t0b3A+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxWaWRlbz5cbiAgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uIHtcbiAgZ2V0OiBHZXQ7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbiAgb25Mb2NhbFN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIGxhYmVsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwZWVyOiBXZWJSVEMsIHByaXZhdGUgb3B0OiBQYXJ0aWFsPE9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub25TdHJlYW0gPSBfID0+IHt9O1xuICAgIHRoaXMub25Mb2NhbFN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5sYWJlbCA9IG9wdC5sYWJlbCB8fCBcInN0cmVhbVwiO1xuICAgIHRoaXMubGlzdGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxpc3RlbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiaW5pdF9cIiArIHRoaXMubGFiZWw7XG4gICAgbGV0IHN0cmVhbTogTWVkaWFTdHJlYW0gfCB1bmRlZmluZWQ7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICB0aGlzLnBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICBpZiAocmF3LmxhYmVsID09PSBsYWJlbCAmJiByYXcuZGF0YSA9PT0gXCJkb25lXCIpIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChzdHJlYW0pIHtcbiAgICAgICAgICB0aGlzLmluaXQoc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGxhYmVsKTtcbiAgICBpZiAodGhpcy5vcHQuZ2V0KSB7XG4gICAgICBzdHJlYW0gPSAoYXdhaXQgdGhpcy5vcHQuZ2V0LmNhdGNoKGNvbnNvbGUubG9nKSkgYXMgYW55O1xuICAgICAgdGhpcy5vbkxvY2FsU3RyZWFtKHN0cmVhbSEpO1xuICAgIH1cbiAgICBpZiAoZG9uZSkge1xuICAgICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gICAgfVxuICAgIGlmIChzdHJlYW0pIHtcbiAgICAgIHRoaXMucGVlci5zZW5kKFwiZG9uZVwiLCBsYWJlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHN0cmVhbTogTWVkaWFTdHJlYW0gfCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBwZWVyID0gdGhpcy5wZWVyO1xuICAgIGNvbnN0IHJ0YyA9IG5ldyBXZWJSVEMoeyBzdHJlYW0gfSk7XG4gICAgaWYgKHBlZXIuaXNPZmZlcikge1xuICAgICAgcnRjLm1ha2VPZmZlcigpO1xuICAgICAgcnRjLnNpZ25hbCA9IHNkcCA9PiB7XG4gICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIik7XG4gICAgICB9O1xuICAgICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gdGhpcy5sYWJlbCArIFwiX2Fuc3dlclwiKSB7XG4gICAgICAgICAgcnRjLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMubGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyLmFkZE9uRGF0YShyYXcgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxhYmVsXCIsIHRoaXMubGFiZWwpO1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcy5sYWJlbCk7XG4gICAgfVxuICAgIHJ0Yy5hZGRPbkFkZFRyYWNrKHN0cmVhbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IHN0cmVhbSB9KTtcbiAgICAgIHRoaXMub25TdHJlYW0oc3RyZWFtKTtcbiAgICB9KTtcbiAgfVxufVxuIl19