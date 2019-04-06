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

        var label, stream;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                label = "init_" + this.label;
                this.peer.onData.subscribe(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    if (stream || !_this.opt.get) {
                      _this.init(stream);
                    }
                  }
                });

                if (!this.opt.get) {
                  _context.next = 7;
                  break;
                }

                _context.next = 5;
                return this.opt.get.catch(console.log);

              case 5:
                stream = _context.sent;
                this.onLocalStream(stream);

              case 7:
                if (this.opt.stream) {
                  stream = this.opt.stream;
                  this.onLocalStream(stream);
                }

                this.peer.send("done", label);

              case 9:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL3N0cmVhbS50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiTWVkaWFUeXBlIiwiU3RyZWFtIiwicGVlciIsIm9wdCIsIm9uU3RyZWFtIiwiXyIsIm9uTG9jYWxTdHJlYW0iLCJsYWJlbCIsImxpc3RlbiIsIm9uRGF0YSIsInN1YnNjcmliZSIsInJhdyIsImRhdGEiLCJzdHJlYW0iLCJnZXQiLCJpbml0IiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwic2VuZCIsImluaXREb25lIiwicnRjIiwiV2ViUlRDIiwiaXNPZmZlciIsIm1ha2VPZmZlciIsInNpZ25hbCIsInNkcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRTZHAiLCJwYXJzZSIsIm9uQWRkVHJhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQUZBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFXWUMsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQVdTQyxNOzs7QUFLbkIsa0JBQW9CQyxJQUFwQixFQUFxRTtBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsc0NBRDFELEtBQzBEOztBQUNuRSxTQUFLQyxRQUFMLEdBQWdCLFVBQUFDLENBQUMsRUFBSSxDQUFFLENBQXZCOztBQUNBLFNBQUtDLGFBQUwsR0FBcUIsVUFBQUQsQ0FBQyxFQUFJLENBQUUsQ0FBNUI7O0FBQ0EsU0FBS0UsS0FBTCxHQUFhSixHQUFHLENBQUNJLEtBQUosSUFBYSxRQUExQjtBQUNBLFNBQUtDLE1BQUw7QUFDRDs7Ozs7Ozs7Ozs7Ozs7O0FBR09ELGdCQUFBQSxLLEdBQVEsVUFBVSxLQUFLQSxLO0FBRzdCLHFCQUFLTCxJQUFMLENBQVVPLE1BQVYsQ0FBaUJDLFNBQWpCLENBQTJCLFVBQUFDLEdBQUcsRUFBSTtBQUNoQyxzQkFBSUEsR0FBRyxDQUFDSixLQUFKLEtBQWNBLEtBQWQsSUFBdUJJLEdBQUcsQ0FBQ0MsSUFBSixLQUFhLE1BQXhDLEVBQWdEO0FBQzlDLHdCQUFJQyxNQUFNLElBQUksQ0FBQyxLQUFJLENBQUNWLEdBQUwsQ0FBU1csR0FBeEIsRUFBNkI7QUFDM0Isc0JBQUEsS0FBSSxDQUFDQyxJQUFMLENBQVVGLE1BQVY7QUFDRDtBQUNGO0FBQ0YsaUJBTkQ7O3FCQVFJLEtBQUtWLEdBQUwsQ0FBU1csRzs7Ozs7O3VCQUNLLEtBQUtYLEdBQUwsQ0FBU1csR0FBVCxDQUFhRSxLQUFiLENBQW1CQyxPQUFPLENBQUNDLEdBQTNCLEM7OztBQUFoQkwsZ0JBQUFBLE07QUFDQSxxQkFBS1AsYUFBTCxDQUFtQk8sTUFBbkI7OztBQUVGLG9CQUFJLEtBQUtWLEdBQUwsQ0FBU1UsTUFBYixFQUFxQjtBQUNuQkEsa0JBQUFBLE1BQU0sR0FBRyxLQUFLVixHQUFMLENBQVNVLE1BQWxCO0FBQ0EsdUJBQUtQLGFBQUwsQ0FBbUJPLE1BQW5CO0FBQ0Q7O0FBRUQscUJBQUtYLElBQUwsQ0FBVWlCLElBQVYsQ0FBZSxNQUFmLEVBQXVCWixLQUF2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUdpQk0sTTs7Ozs7Ozs7cUJBQ2IsS0FBS08sUTs7Ozs7Ozs7QUFDVCxxQkFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNNbEIsZ0JBQUFBLEksR0FBTyxLQUFLQSxJO0FBQ1ptQixnQkFBQUEsRyxHQUFNLElBQUlDLGFBQUosQ0FBVztBQUFFVCxrQkFBQUEsTUFBTSxFQUFOQTtBQUFGLGlCQUFYLEM7O0FBQ1osb0JBQUlYLElBQUksQ0FBQ3FCLE9BQVQsRUFBa0I7QUFDaEJGLGtCQUFBQSxHQUFHLENBQUNHLFNBQUo7O0FBQ0FILGtCQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJ4QixvQkFBQUEsSUFBSSxDQUFDaUIsSUFBTCxDQUFVUSxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsR0FBZixDQUFWLEVBQStCLE1BQUksQ0FBQ25CLEtBQUwsR0FBYSxRQUE1QztBQUNELG1CQUZEOztBQUdBTCxrQkFBQUEsSUFBSSxDQUFDTyxNQUFMLENBQVlDLFNBQVosQ0FBc0IsVUFBQUMsR0FBRyxFQUFJO0FBQzNCLHdCQUFJQSxHQUFHLENBQUNKLEtBQUosS0FBYyxNQUFJLENBQUNBLEtBQUwsR0FBYSxTQUEvQixFQUEwQztBQUN4Q2Msc0JBQUFBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXRixJQUFJLENBQUNHLEtBQUwsQ0FBV25CLEdBQUcsQ0FBQ0MsSUFBZixDQUFYO0FBQ0Q7QUFDRixtQkFKRDtBQUtELGlCQVZELE1BVU87QUFDTFYsa0JBQUFBLElBQUksQ0FBQ08sTUFBTCxDQUFZQyxTQUFaLENBQXNCLFVBQUFDLEdBQUcsRUFBSTtBQUMzQix3QkFBSUEsR0FBRyxDQUFDSixLQUFKLEtBQWMsTUFBSSxDQUFDQSxLQUFMLEdBQWEsUUFBL0IsRUFBeUM7QUFDdkNjLHNCQUFBQSxHQUFHLENBQUNRLE1BQUosQ0FBV0YsSUFBSSxDQUFDRyxLQUFMLENBQVduQixHQUFHLENBQUNDLElBQWYsQ0FBWDs7QUFDQVMsc0JBQUFBLEdBQUcsQ0FBQ0ksTUFBSixHQUFhLFVBQUFDLEdBQUcsRUFBSTtBQUNsQnhCLHdCQUFBQSxJQUFJLENBQUNpQixJQUFMLENBQVVRLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQVYsRUFBK0IsTUFBSSxDQUFDbkIsS0FBTCxHQUFhLFNBQTVDO0FBQ0QsdUJBRkQ7QUFHRDtBQUNGLG1CQVBEO0FBUUQ7O0FBQ0RjLGdCQUFBQSxHQUFHLENBQUNVLFVBQUosQ0FBZXJCLFNBQWYsQ0FBeUIsVUFBQUcsTUFBTSxFQUFJO0FBQ2pDLGtCQUFBLE1BQUksQ0FBQ1QsUUFBTCxDQUFjUyxNQUFkO0FBQ0QsaUJBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4uL2NvcmVcIjtcbmltcG9ydCB7IGdldExvY2FsQXVkaW8sIGdldExvY2FsRGVza3RvcCwgZ2V0TG9jYWxWaWRlbyB9IGZyb20gXCIuLi9saWIvdXRpbGxcIjtcblxudHlwZSBHZXQgPVxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsQXVkaW8+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxEZXNrdG9wPlxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsVmlkZW8+XG4gIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZW51bSBNZWRpYVR5cGUge1xuICB2aWRlbyxcbiAgYXVkaW9cbn1cblxuaW50ZXJmYWNlIE9wdGlvbiB7XG4gIGdldDogR2V0O1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIG9uTG9jYWxTdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuICBsYWJlbDogc3RyaW5nO1xuICBpbml0RG9uZSA9IGZhbHNlO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlZXI6IFdlYlJUQywgcHJpdmF0ZSBvcHQ6IFBhcnRpYWw8T3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5vbkxvY2FsU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmxhYmVsID0gb3B0LmxhYmVsIHx8IFwic3RyZWFtXCI7XG4gICAgdGhpcy5saXN0ZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbGlzdGVuKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJpbml0X1wiICsgdGhpcy5sYWJlbDtcbiAgICBsZXQgc3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZDtcblxuICAgIHRoaXMucGVlci5vbkRhdGEuc3Vic2NyaWJlKHJhdyA9PiB7XG4gICAgICBpZiAocmF3LmxhYmVsID09PSBsYWJlbCAmJiByYXcuZGF0YSA9PT0gXCJkb25lXCIpIHtcbiAgICAgICAgaWYgKHN0cmVhbSB8fCAhdGhpcy5vcHQuZ2V0KSB7XG4gICAgICAgICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdC5nZXQpIHtcbiAgICAgIHN0cmVhbSA9IChhd2FpdCB0aGlzLm9wdC5nZXQuY2F0Y2goY29uc29sZS5sb2cpKSBhcyBhbnk7XG4gICAgICB0aGlzLm9uTG9jYWxTdHJlYW0oc3RyZWFtISk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdC5zdHJlYW0pIHtcbiAgICAgIHN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICAgIHRoaXMub25Mb2NhbFN0cmVhbShzdHJlYW0pO1xuICAgIH1cblxuICAgIHRoaXMucGVlci5zZW5kKFwiZG9uZVwiLCBsYWJlbCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQoc3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLmluaXREb25lKSByZXR1cm47XG4gICAgdGhpcy5pbml0RG9uZSA9IHRydWU7XG4gICAgY29uc3QgcGVlciA9IHRoaXMucGVlcjtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHJ0Yy5tYWtlT2ZmZXIoKTtcbiAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgfTtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpIHtcbiAgICAgICAgICBydGMuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJ0Yy5vbkFkZFRyYWNrLnN1YnNjcmliZShzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=