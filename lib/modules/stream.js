"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaType = void 0;

var _core = _interopRequireDefault(require("../core"));

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

        var label, _this$opt, get, stream, localStream, reg;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                label = "init_" + this.label;
                _this$opt = this.opt, get = _this$opt.get, stream = _this$opt.stream;
                localStream = stream;

                if (!localStream) {
                  _context.next = 7;
                  break;
                }

                this.onLocalStream(localStream);
                _context.next = 12;
                break;

              case 7:
                if (!get) {
                  _context.next = 12;
                  break;
                }

                _context.next = 10;
                return get.catch(console.log);

              case 10:
                localStream = _context.sent;
                this.onLocalStream(localStream);

              case 12:
                reg = this.peer.onData.subscribe(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    if (!get) {
                      _this.init(localStream);

                      reg.unSubscribe();
                    }
                  }
                });
                this.peer.send("done", label);

              case 14:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL3N0cmVhbS50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiTWVkaWFUeXBlIiwiU3RyZWFtIiwicGVlciIsIm9wdCIsIm9uU3RyZWFtIiwiXyIsIm9uTG9jYWxTdHJlYW0iLCJsYWJlbCIsImxpc3RlbiIsImdldCIsInN0cmVhbSIsImxvY2FsU3RyZWFtIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwicmVnIiwib25EYXRhIiwic3Vic2NyaWJlIiwicmF3IiwiZGF0YSIsImluaXQiLCJ1blN1YnNjcmliZSIsInNlbmQiLCJpbml0RG9uZSIsInJ0YyIsIldlYlJUQyIsImlzT2ZmZXIiLCJtYWtlT2ZmZXIiLCJzaWduYWwiLCJzZHAiLCJKU09OIiwic3RyaW5naWZ5Iiwic2V0U2RwIiwicGFyc2UiLCJvbkFkZFRyYWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0lBV1lDLFM7OztXQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7R0FBQUEsUyx5QkFBQUEsUzs7SUFXU0MsTTs7O0FBS25CLGtCQUFvQkMsSUFBcEIsRUFBcUU7QUFBQSxRQUEzQkMsR0FBMkIsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLHNDQUQxRCxLQUMwRDs7QUFDbkUsU0FBS0MsUUFBTCxHQUFnQixVQUFBQyxDQUFDLEVBQUksQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLFVBQUFELENBQUMsRUFBSSxDQUFFLENBQTVCOztBQUNBLFNBQUtFLEtBQUwsR0FBYUosR0FBRyxDQUFDSSxLQUFKLElBQWEsUUFBMUI7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7NEJBRUwsS0FBS0osRyxFQUFyQk0sRyxhQUFBQSxHLEVBQUtDLE0sYUFBQUEsTTtBQUNUQyxnQkFBQUEsVyxHQUFjRCxNOztxQkFFZEMsVzs7Ozs7QUFDRixxQkFBS0wsYUFBTCxDQUFtQkssV0FBbkI7Ozs7O3FCQUNTRixHOzs7Ozs7dUJBQ1lBLEdBQUcsQ0FBQ0csS0FBSixDQUFVQyxPQUFPLENBQUNDLEdBQWxCLEM7OztBQUFyQkgsZ0JBQUFBLFc7QUFDQSxxQkFBS0wsYUFBTCxDQUFtQkssV0FBbkI7OztBQUdJSSxnQkFBQUEsRyxHQUFNLEtBQUtiLElBQUwsQ0FBVWMsTUFBVixDQUFpQkMsU0FBakIsQ0FBMkIsVUFBQUMsR0FBRyxFQUFJO0FBQzVDLHNCQUFJQSxHQUFHLENBQUNYLEtBQUosS0FBY0EsS0FBZCxJQUF1QlcsR0FBRyxDQUFDQyxJQUFKLEtBQWEsTUFBeEMsRUFBZ0Q7QUFDOUMsd0JBQUksQ0FBQ1YsR0FBTCxFQUFVO0FBQ1Isc0JBQUEsS0FBSSxDQUFDVyxJQUFMLENBQVVULFdBQVY7O0FBQ0FJLHNCQUFBQSxHQUFHLENBQUNNLFdBQUo7QUFDRDtBQUNGO0FBQ0YsaUJBUFcsQztBQVNaLHFCQUFLbkIsSUFBTCxDQUFVb0IsSUFBVixDQUFlLE1BQWYsRUFBdUJmLEtBQXZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBR2lCRyxNOzs7Ozs7OztxQkFDYixLQUFLYSxROzs7Ozs7OztBQUNULHFCQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBRU1yQixnQkFBQUEsSSxHQUFPLEtBQUtBLEk7QUFDWnNCLGdCQUFBQSxHLEdBQU0sSUFBSUMsYUFBSixDQUFXO0FBQUVmLGtCQUFBQSxNQUFNLEVBQU5BO0FBQUYsaUJBQVgsQzs7QUFDWixvQkFBSVIsSUFBSSxDQUFDd0IsT0FBVCxFQUFrQjtBQUNoQkYsa0JBQUFBLEdBQUcsQ0FBQ0csU0FBSjs7QUFDQUgsa0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQjNCLG9CQUFBQSxJQUFJLENBQUNvQixJQUFMLENBQVVRLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDdEIsS0FBTCxHQUFhLFFBQTVDO0FBQ0QsbUJBRkQ7O0FBR0FMLGtCQUFBQSxJQUFJLENBQUNjLE1BQUwsQ0FBWUMsU0FBWixDQUFzQixVQUFBQyxHQUFHLEVBQUk7QUFDM0Isd0JBQUlBLEdBQUcsQ0FBQ1gsS0FBSixLQUFjLE1BQUksQ0FBQ0EsS0FBTCxHQUFhLFNBQS9CLEVBQTBDO0FBQ3hDaUIsc0JBQUFBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXRixJQUFJLENBQUNHLEtBQUwsQ0FBV2YsR0FBRyxDQUFDQyxJQUFmLENBQVg7QUFDRDtBQUNGLG1CQUpEO0FBS0QsaUJBVkQsTUFVTztBQUNMakIsa0JBQUFBLElBQUksQ0FBQ2MsTUFBTCxDQUFZQyxTQUFaLENBQXNCLFVBQUFDLEdBQUcsRUFBSTtBQUMzQix3QkFBSUEsR0FBRyxDQUFDWCxLQUFKLEtBQWMsTUFBSSxDQUFDQSxLQUFMLEdBQWEsUUFBL0IsRUFBeUM7QUFDdkNpQixzQkFBQUEsR0FBRyxDQUFDUSxNQUFKLENBQVdGLElBQUksQ0FBQ0csS0FBTCxDQUFXZixHQUFHLENBQUNDLElBQWYsQ0FBWDs7QUFDQUssc0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQjNCLHdCQUFBQSxJQUFJLENBQUNvQixJQUFMLENBQVVRLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDdEIsS0FBTCxHQUFhLFNBQTVDO0FBQ0QsdUJBRkQ7QUFHRDtBQUNGLG1CQVBEO0FBUUQ7O0FBQ0RpQixnQkFBQUEsR0FBRyxDQUFDVSxVQUFKLENBQWVqQixTQUFmLENBQXlCLFVBQUFQLE1BQU0sRUFBSTtBQUNqQyxrQkFBQSxNQUFJLENBQUNOLFFBQUwsQ0FBY00sTUFBZDtBQUNELGlCQUZEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuLi9jb3JlXCI7XG5pbXBvcnQgeyBnZXRMb2NhbEF1ZGlvLCBnZXRMb2NhbERlc2t0b3AsIGdldExvY2FsVmlkZW8gfSBmcm9tIFwiLi4vdXRpbGwvbWVkaWFcIjtcblxudHlwZSBHZXQgPVxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsQXVkaW8+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxEZXNrdG9wPlxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsVmlkZW8+XG4gIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZW51bSBNZWRpYVR5cGUge1xuICB2aWRlbyxcbiAgYXVkaW9cbn1cblxuaW50ZXJmYWNlIE9wdGlvbiB7XG4gIGdldDogR2V0O1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIG9uTG9jYWxTdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuICBsYWJlbDogc3RyaW5nO1xuICBpbml0RG9uZSA9IGZhbHNlO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlZXI6IFdlYlJUQywgcHJpdmF0ZSBvcHQ6IFBhcnRpYWw8T3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5vbkxvY2FsU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmxhYmVsID0gb3B0LmxhYmVsIHx8IFwic3RyZWFtXCI7XG4gICAgdGhpcy5saXN0ZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbGlzdGVuKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJpbml0X1wiICsgdGhpcy5sYWJlbDtcblxuICAgIGNvbnN0IHsgZ2V0LCBzdHJlYW0gfSA9IHRoaXMub3B0O1xuICAgIGxldCBsb2NhbFN0cmVhbSA9IHN0cmVhbTtcblxuICAgIGlmIChsb2NhbFN0cmVhbSkge1xuICAgICAgdGhpcy5vbkxvY2FsU3RyZWFtKGxvY2FsU3RyZWFtKTtcbiAgICB9IGVsc2UgaWYgKGdldCkge1xuICAgICAgbG9jYWxTdHJlYW0gPSAoYXdhaXQgZ2V0LmNhdGNoKGNvbnNvbGUubG9nKSkgYXMgTWVkaWFTdHJlYW07XG4gICAgICB0aGlzLm9uTG9jYWxTdHJlYW0obG9jYWxTdHJlYW0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZyA9IHRoaXMucGVlci5vbkRhdGEuc3Vic2NyaWJlKHJhdyA9PiB7XG4gICAgICBpZiAocmF3LmxhYmVsID09PSBsYWJlbCAmJiByYXcuZGF0YSA9PT0gXCJkb25lXCIpIHtcbiAgICAgICAgaWYgKCFnZXQpIHtcbiAgICAgICAgICB0aGlzLmluaXQobG9jYWxTdHJlYW0pO1xuICAgICAgICAgIHJlZy51blN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnBlZXIuc2VuZChcImRvbmVcIiwgbGFiZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHN0cmVhbTogTWVkaWFTdHJlYW0gfCB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5pbml0RG9uZSkgcmV0dXJuO1xuICAgIHRoaXMuaW5pdERvbmUgPSB0cnVlO1xuXG4gICAgY29uc3QgcGVlciA9IHRoaXMucGVlcjtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHJ0Yy5tYWtlT2ZmZXIoKTtcbiAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgfTtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpIHtcbiAgICAgICAgICBydGMuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJ0Yy5vbkFkZFRyYWNrLnN1YnNjcmliZShzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=