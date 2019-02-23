"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaType = void 0;

var _core = _interopRequireDefault(require("./core"));

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

    _defineProperty(this, "initDone", false);

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
                this.peer.onData.subscribe(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    done = true;

                    if (stream || !_this.opt.get) {
                      _this.init(stream);
                    }
                  }
                });

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

                this.peer.send("done", label);

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
                if (!this.initDone) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                this.initDone = true;
                peer = this.peer;
                rtc = new _core.default({
                  stream: stream
                });

                if (peer.isOffer) {
                  rtc.makeOffer();

                  rtc.signal = function (sdp) {
                    peer.send(JSON.stringify(sdp), _this2.label + "_offer");
                  };

                  peer.onData.subscribe(function (raw) {
                    if (raw.label === _this2.label + "_answer") {
                      rtc.setSdp(JSON.parse(raw.data));
                    }
                  });
                } else {
                  peer.onData.subscribe(function (raw) {
                    if (raw.label === _this2.label + "_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), _this2.label + "_answer");
                      };
                    }
                  });
                }

                rtc.onAddTrack.subscribe(function (stream) {
                  _this2.onStream(stream);
                });

              case 7:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJvbkxvY2FsU3RyZWFtIiwibGFiZWwiLCJsaXN0ZW4iLCJkb25lIiwib25EYXRhIiwic3Vic2NyaWJlIiwicmF3IiwiZGF0YSIsInN0cmVhbSIsImdldCIsImluaXQiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwiaW5pdERvbmUiLCJydGMiLCJXZWJSVEMiLCJpc09mZmVyIiwibWFrZU9mZmVyIiwic2lnbmFsIiwic2RwIiwiSlNPTiIsInN0cmluZ2lmeSIsInNldFNkcCIsInBhcnNlIiwib25BZGRUcmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQVdZQyxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBVVNDLE07OztBQUtuQixrQkFBb0JDLElBQXBCLEVBQXFFO0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxzQ0FEMUQsS0FDMEQ7O0FBQ25FLFNBQUtDLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixVQUFBRCxDQUFDLEVBQUksQ0FBRSxDQUE1Qjs7QUFDQSxTQUFLRSxLQUFMLEdBQWFKLEdBQUcsQ0FBQ0ksS0FBSixJQUFhLFFBQTFCO0FBQ0EsU0FBS0MsTUFBTDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7QUFFekJFLGdCQUFBQSxJLEdBQU8sSztBQUNYLHFCQUFLUCxJQUFMLENBQVVRLE1BQVYsQ0FBaUJDLFNBQWpCLENBQTJCLFVBQUFDLEdBQUcsRUFBSTtBQUNoQyxzQkFBSUEsR0FBRyxDQUFDTCxLQUFKLEtBQWNBLEtBQWQsSUFBdUJLLEdBQUcsQ0FBQ0MsSUFBSixLQUFhLE1BQXhDLEVBQWdEO0FBQzlDSixvQkFBQUEsSUFBSSxHQUFHLElBQVA7O0FBQ0Esd0JBQUlLLE1BQU0sSUFBSSxDQUFDLEtBQUksQ0FBQ1gsR0FBTCxDQUFTWSxHQUF4QixFQUE2QjtBQUMzQixzQkFBQSxLQUFJLENBQUNDLElBQUwsQ0FBVUYsTUFBVjtBQUNEO0FBQ0Y7QUFDRixpQkFQRDs7cUJBUUksS0FBS1gsR0FBTCxDQUFTWSxHOzs7Ozs7dUJBQ0ssS0FBS1osR0FBTCxDQUFTWSxHQUFULENBQWFFLEtBQWIsQ0FBbUJDLE9BQU8sQ0FBQ0MsR0FBM0IsQzs7O0FBQWhCTCxnQkFBQUEsTTtBQUNBLHFCQUFLUixhQUFMLENBQW1CUSxNQUFuQjs7O0FBRUYsb0JBQUlMLElBQUosRUFBVTtBQUNSLHVCQUFLTyxJQUFMLENBQVVGLE1BQVY7QUFDRDs7QUFDRCxxQkFBS1osSUFBTCxDQUFVa0IsSUFBVixDQUFlLE1BQWYsRUFBdUJiLEtBQXZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBR2lCTyxNOzs7Ozs7OztxQkFDYixLQUFLTyxROzs7Ozs7OztBQUNULHFCQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ01uQixnQkFBQUEsSSxHQUFPLEtBQUtBLEk7QUFDWm9CLGdCQUFBQSxHLEdBQU0sSUFBSUMsYUFBSixDQUFXO0FBQUVULGtCQUFBQSxNQUFNLEVBQU5BO0FBQUYsaUJBQVgsQzs7QUFDWixvQkFBSVosSUFBSSxDQUFDc0IsT0FBVCxFQUFrQjtBQUNoQkYsa0JBQUFBLEdBQUcsQ0FBQ0csU0FBSjs7QUFDQUgsa0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQnpCLG9CQUFBQSxJQUFJLENBQUNrQixJQUFMLENBQVVRLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDcEIsS0FBTCxHQUFhLFFBQTVDO0FBQ0QsbUJBRkQ7O0FBR0FMLGtCQUFBQSxJQUFJLENBQUNRLE1BQUwsQ0FBWUMsU0FBWixDQUFzQixVQUFBQyxHQUFHLEVBQUk7QUFDM0Isd0JBQUlBLEdBQUcsQ0FBQ0wsS0FBSixLQUFjLE1BQUksQ0FBQ0EsS0FBTCxHQUFhLFNBQS9CLEVBQTBDO0FBQ3hDZSxzQkFBQUEsR0FBRyxDQUFDUSxNQUFKLENBQVdGLElBQUksQ0FBQ0csS0FBTCxDQUFXbkIsR0FBRyxDQUFDQyxJQUFmLENBQVg7QUFDRDtBQUNGLG1CQUpEO0FBS0QsaUJBVkQsTUFVTztBQUNMWCxrQkFBQUEsSUFBSSxDQUFDUSxNQUFMLENBQVlDLFNBQVosQ0FBc0IsVUFBQUMsR0FBRyxFQUFJO0FBQzNCLHdCQUFJQSxHQUFHLENBQUNMLEtBQUosS0FBYyxNQUFJLENBQUNBLEtBQUwsR0FBYSxRQUEvQixFQUF5QztBQUN2Q2Usc0JBQUFBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXRixJQUFJLENBQUNHLEtBQUwsQ0FBV25CLEdBQUcsQ0FBQ0MsSUFBZixDQUFYOztBQUNBUyxzQkFBQUEsR0FBRyxDQUFDSSxNQUFKLEdBQWEsVUFBQUMsR0FBRyxFQUFJO0FBQ2xCekIsd0JBQUFBLElBQUksQ0FBQ2tCLElBQUwsQ0FBVVEsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsQ0FBVixFQUErQixNQUFJLENBQUNwQixLQUFMLEdBQWEsU0FBNUM7QUFDRCx1QkFGRDtBQUdEO0FBQ0YsbUJBUEQ7QUFRRDs7QUFDRGUsZ0JBQUFBLEdBQUcsQ0FBQ1UsVUFBSixDQUFlckIsU0FBZixDQUF5QixVQUFBRyxNQUFNLEVBQUk7QUFDakMsa0JBQUEsTUFBSSxDQUFDVixRQUFMLENBQWNVLE1BQWQ7QUFDRCxpQkFGRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgeyBnZXRMb2NhbEF1ZGlvLCBnZXRMb2NhbERlc2t0b3AsIGdldExvY2FsVmlkZW8gfSBmcm9tIFwiLi91dGlsbFwiO1xuXG50eXBlIEdldCA9XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxBdWRpbz5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbERlc2t0b3A+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxWaWRlbz5cbiAgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uIHtcbiAgZ2V0OiBHZXQ7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbiAgb25Mb2NhbFN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGluaXREb25lID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGVlcjogV2ViUlRDLCBwcml2YXRlIG9wdDogUGFydGlhbDxPcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLm9uTG9jYWxTdHJlYW0gPSBfID0+IHt9O1xuICAgIHRoaXMubGFiZWwgPSBvcHQubGFiZWwgfHwgXCJzdHJlYW1cIjtcbiAgICB0aGlzLmxpc3RlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsaXN0ZW4oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcImluaXRfXCIgKyB0aGlzLmxhYmVsO1xuICAgIGxldCBzdHJlYW06IE1lZGlhU3RyZWFtIHwgdW5kZWZpbmVkO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgdGhpcy5wZWVyLm9uRGF0YS5zdWJzY3JpYmUocmF3ID0+IHtcbiAgICAgIGlmIChyYXcubGFiZWwgPT09IGxhYmVsICYmIHJhdy5kYXRhID09PSBcImRvbmVcIikge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHN0cmVhbSB8fCAhdGhpcy5vcHQuZ2V0KSB7XG4gICAgICAgICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy5vcHQuZ2V0KSB7XG4gICAgICBzdHJlYW0gPSAoYXdhaXQgdGhpcy5vcHQuZ2V0LmNhdGNoKGNvbnNvbGUubG9nKSkgYXMgYW55O1xuICAgICAgdGhpcy5vbkxvY2FsU3RyZWFtKHN0cmVhbSEpO1xuICAgIH1cbiAgICBpZiAoZG9uZSkge1xuICAgICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gICAgfVxuICAgIHRoaXMucGVlci5zZW5kKFwiZG9uZVwiLCBsYWJlbCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQoc3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLmluaXREb25lKSByZXR1cm47XG4gICAgdGhpcy5pbml0RG9uZSA9IHRydWU7XG4gICAgY29uc3QgcGVlciA9IHRoaXMucGVlcjtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHJ0Yy5tYWtlT2ZmZXIoKTtcbiAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgfTtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpIHtcbiAgICAgICAgICBydGMuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJ0Yy5vbkFkZFRyYWNrLnN1YnNjcmliZShzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=