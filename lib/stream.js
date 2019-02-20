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
                this.peer.addOnData(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    done = true;

                    if (stream || !_this.opt.get) {
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
                    if (raw.label === _this2.label + "_offer") {
                      rtc.setSdp(JSON.parse(raw.data));

                      rtc.signal = function (sdp) {
                        peer.send(JSON.stringify(sdp), _this2.label + "_answer");
                      };
                    }
                  }, this.label);
                }

                rtc.addOnAddTrack(function (stream) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJvbkxvY2FsU3RyZWFtIiwibGFiZWwiLCJsaXN0ZW4iLCJkb25lIiwiYWRkT25EYXRhIiwicmF3IiwiZGF0YSIsInN0cmVhbSIsImdldCIsImluaXQiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwiaW5pdERvbmUiLCJydGMiLCJXZWJSVEMiLCJpc09mZmVyIiwibWFrZU9mZmVyIiwic2lnbmFsIiwic2RwIiwiSlNPTiIsInN0cmluZ2lmeSIsInNldFNkcCIsInBhcnNlIiwiYWRkT25BZGRUcmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQVdZQyxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBVVNDLE07OztBQUtuQixrQkFBb0JDLElBQXBCLEVBQXFFO0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxzQ0FEMUQsS0FDMEQ7O0FBQ25FLFNBQUtDLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixVQUFBRCxDQUFDLEVBQUksQ0FBRSxDQUE1Qjs7QUFDQSxTQUFLRSxLQUFMLEdBQWFKLEdBQUcsQ0FBQ0ksS0FBSixJQUFhLFFBQTFCO0FBQ0EsU0FBS0MsTUFBTDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7QUFFekJFLGdCQUFBQSxJLEdBQU8sSztBQUNYLHFCQUFLUCxJQUFMLENBQVVRLFNBQVYsQ0FBb0IsVUFBQUMsR0FBRyxFQUFJO0FBQ3pCLHNCQUFJQSxHQUFHLENBQUNKLEtBQUosS0FBY0EsS0FBZCxJQUF1QkksR0FBRyxDQUFDQyxJQUFKLEtBQWEsTUFBeEMsRUFBZ0Q7QUFDOUNILG9CQUFBQSxJQUFJLEdBQUcsSUFBUDs7QUFDQSx3QkFBSUksTUFBTSxJQUFJLENBQUMsS0FBSSxDQUFDVixHQUFMLENBQVNXLEdBQXhCLEVBQTZCO0FBQzNCLHNCQUFBLEtBQUksQ0FBQ0MsSUFBTCxDQUFVRixNQUFWO0FBQ0Q7QUFDRjtBQUNGLGlCQVBELEVBT0dOLEtBUEg7O3FCQVFJLEtBQUtKLEdBQUwsQ0FBU1csRzs7Ozs7O3VCQUNLLEtBQUtYLEdBQUwsQ0FBU1csR0FBVCxDQUFhRSxLQUFiLENBQW1CQyxPQUFPLENBQUNDLEdBQTNCLEM7OztBQUFoQkwsZ0JBQUFBLE07QUFDQSxxQkFBS1AsYUFBTCxDQUFtQk8sTUFBbkI7OztBQUVGLG9CQUFJSixJQUFKLEVBQVU7QUFDUix1QkFBS00sSUFBTCxDQUFVRixNQUFWO0FBQ0Q7O0FBQ0QscUJBQUtYLElBQUwsQ0FBVWlCLElBQVYsQ0FBZSxNQUFmLEVBQXVCWixLQUF2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUdpQk0sTTs7Ozs7Ozs7cUJBQ2IsS0FBS08sUTs7Ozs7Ozs7QUFDVCxxQkFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNNbEIsZ0JBQUFBLEksR0FBTyxLQUFLQSxJO0FBQ1ptQixnQkFBQUEsRyxHQUFNLElBQUlDLFVBQUosQ0FBVztBQUFFVCxrQkFBQUEsTUFBTSxFQUFOQTtBQUFGLGlCQUFYLEM7O0FBQ1osb0JBQUlYLElBQUksQ0FBQ3FCLE9BQVQsRUFBa0I7QUFDaEJGLGtCQUFBQSxHQUFHLENBQUNHLFNBQUo7O0FBQ0FILGtCQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJ4QixvQkFBQUEsSUFBSSxDQUFDaUIsSUFBTCxDQUFVUSxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsR0FBZixDQUFWLEVBQStCLE1BQUksQ0FBQ25CLEtBQUwsR0FBYSxRQUE1QztBQUNELG1CQUZEOztBQUdBTCxrQkFBQUEsSUFBSSxDQUFDUSxTQUFMLENBQWUsVUFBQUMsR0FBRyxFQUFJO0FBQ3BCLHdCQUFJQSxHQUFHLENBQUNKLEtBQUosS0FBYyxNQUFJLENBQUNBLEtBQUwsR0FBYSxTQUEvQixFQUEwQztBQUN4Q2Msc0JBQUFBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXRixJQUFJLENBQUNHLEtBQUwsQ0FBV25CLEdBQUcsQ0FBQ0MsSUFBZixDQUFYO0FBQ0Q7QUFDRixtQkFKRCxFQUlHLEtBQUtMLEtBSlI7QUFLRCxpQkFWRCxNQVVPO0FBQ0xMLGtCQUFBQSxJQUFJLENBQUNRLFNBQUwsQ0FBZSxVQUFBQyxHQUFHLEVBQUk7QUFDcEIsd0JBQUlBLEdBQUcsQ0FBQ0osS0FBSixLQUFjLE1BQUksQ0FBQ0EsS0FBTCxHQUFhLFFBQS9CLEVBQXlDO0FBQ3ZDYyxzQkFBQUEsR0FBRyxDQUFDUSxNQUFKLENBQVdGLElBQUksQ0FBQ0csS0FBTCxDQUFXbkIsR0FBRyxDQUFDQyxJQUFmLENBQVg7O0FBQ0FTLHNCQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxVQUFBQyxHQUFHLEVBQUk7QUFDbEJ4Qix3QkFBQUEsSUFBSSxDQUFDaUIsSUFBTCxDQUFVUSxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsR0FBZixDQUFWLEVBQStCLE1BQUksQ0FBQ25CLEtBQUwsR0FBYSxTQUE1QztBQUNELHVCQUZEO0FBR0Q7QUFDRixtQkFQRCxFQU9HLEtBQUtBLEtBUFI7QUFRRDs7QUFDRGMsZ0JBQUFBLEdBQUcsQ0FBQ1UsYUFBSixDQUFrQixVQUFBbEIsTUFBTSxFQUFJO0FBQzFCLGtCQUFBLE1BQUksQ0FBQ1QsUUFBTCxDQUFjUyxNQUFkO0FBQ0QsaUJBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBnZXRMb2NhbEF1ZGlvLCBnZXRMb2NhbERlc2t0b3AsIGdldExvY2FsVmlkZW8gfSBmcm9tIFwiLi91dGlsbFwiO1xuXG50eXBlIEdldCA9XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxBdWRpbz5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbERlc2t0b3A+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxWaWRlbz5cbiAgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uIHtcbiAgZ2V0OiBHZXQ7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbiAgb25Mb2NhbFN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGluaXREb25lID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGVlcjogV2ViUlRDLCBwcml2YXRlIG9wdDogUGFydGlhbDxPcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLm9uTG9jYWxTdHJlYW0gPSBfID0+IHt9O1xuICAgIHRoaXMubGFiZWwgPSBvcHQubGFiZWwgfHwgXCJzdHJlYW1cIjtcbiAgICB0aGlzLmxpc3RlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsaXN0ZW4oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcImluaXRfXCIgKyB0aGlzLmxhYmVsO1xuICAgIGxldCBzdHJlYW06IE1lZGlhU3RyZWFtIHwgdW5kZWZpbmVkO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgdGhpcy5wZWVyLmFkZE9uRGF0YShyYXcgPT4ge1xuICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gbGFiZWwgJiYgcmF3LmRhdGEgPT09IFwiZG9uZVwiKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBpZiAoc3RyZWFtIHx8ICF0aGlzLm9wdC5nZXQpIHtcbiAgICAgICAgICB0aGlzLmluaXQoc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGxhYmVsKTtcbiAgICBpZiAodGhpcy5vcHQuZ2V0KSB7XG4gICAgICBzdHJlYW0gPSAoYXdhaXQgdGhpcy5vcHQuZ2V0LmNhdGNoKGNvbnNvbGUubG9nKSkgYXMgYW55O1xuICAgICAgdGhpcy5vbkxvY2FsU3RyZWFtKHN0cmVhbSEpO1xuICAgIH1cbiAgICBpZiAoZG9uZSkge1xuICAgICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gICAgfVxuICAgIHRoaXMucGVlci5zZW5kKFwiZG9uZVwiLCBsYWJlbCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQoc3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLmluaXREb25lKSByZXR1cm47XG4gICAgdGhpcy5pbml0RG9uZSA9IHRydWU7XG4gICAgY29uc3QgcGVlciA9IHRoaXMucGVlcjtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHJ0Yy5tYWtlT2ZmZXIoKTtcbiAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgfTtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpIHtcbiAgICAgICAgICBydGMuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgICBydGMuc2lnbmFsID0gc2RwID0+IHtcbiAgICAgICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMubGFiZWwpO1xuICAgIH1cbiAgICBydGMuYWRkT25BZGRUcmFjayhzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=