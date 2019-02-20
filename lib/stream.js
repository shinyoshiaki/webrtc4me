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

    _defineProperty(this, "label", void 0);

    this.onStream = function (_) {};

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
                      console.log("start streaming");

                      _this.init(stream);
                    }
                  }
                }, label);

                if (!this.opt.get) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return this.opt.get.catch(console.log);

              case 6:
                stream = _context.sent;

              case 7:
                if (done) {
                  this.init(stream);
                }

                if (stream) {
                  console.log("send done");
                  this.peer.send("done", label);
                }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIk1lZGlhVHlwZSIsIlN0cmVhbSIsInBlZXIiLCJvcHQiLCJvblN0cmVhbSIsIl8iLCJsYWJlbCIsImxpc3RlbiIsImRvbmUiLCJhZGRPbkRhdGEiLCJyYXciLCJkYXRhIiwic3RyZWFtIiwiY29uc29sZSIsImxvZyIsImluaXQiLCJnZXQiLCJjYXRjaCIsInNlbmQiLCJydGMiLCJXZWJSVEMiLCJpc09mZmVyIiwibWFrZU9mZmVyIiwic2lnbmFsIiwic2RwIiwiSlNPTiIsInN0cmluZ2lmeSIsInNldFNkcCIsInBhcnNlIiwiYWRkT25BZGRUcmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQVdZQyxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBVVNDLE07OztBQUluQixrQkFBb0JDLElBQXBCLEVBQXFFO0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFDbkUsU0FBS0MsUUFBTCxHQUFnQixVQUFBQyxDQUFDLEVBQUksQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxLQUFMLEdBQWFILEdBQUcsQ0FBQ0csS0FBSixJQUFhLFFBQTFCO0FBQ0EsU0FBS0MsTUFBTDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7QUFFekJFLGdCQUFBQSxJLEdBQU8sSztBQUNYLHFCQUFLTixJQUFMLENBQVVPLFNBQVYsQ0FBb0IsVUFBQUMsR0FBRyxFQUFJO0FBQ3pCLHNCQUFJQSxHQUFHLENBQUNKLEtBQUosS0FBY0EsS0FBZCxJQUF1QkksR0FBRyxDQUFDQyxJQUFKLEtBQWEsTUFBeEMsRUFBZ0Q7QUFDOUNILG9CQUFBQSxJQUFJLEdBQUcsSUFBUDs7QUFDQSx3QkFBSUksTUFBSixFQUFZO0FBQ1ZDLHNCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWjs7QUFDQSxzQkFBQSxLQUFJLENBQUNDLElBQUwsQ0FBVUgsTUFBVjtBQUNEO0FBQ0Y7QUFDRixpQkFSRCxFQVFHTixLQVJIOztxQkFTSSxLQUFLSCxHQUFMLENBQVNhLEc7Ozs7Ozt1QkFDSyxLQUFLYixHQUFMLENBQVNhLEdBQVQsQ0FBYUMsS0FBYixDQUFtQkosT0FBTyxDQUFDQyxHQUEzQixDOzs7QUFBaEJGLGdCQUFBQSxNOzs7QUFFRixvQkFBSUosSUFBSixFQUFVO0FBQ1IsdUJBQUtPLElBQUwsQ0FBVUgsTUFBVjtBQUNEOztBQUNELG9CQUFJQSxNQUFKLEVBQVk7QUFDVkMsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVo7QUFDQSx1QkFBS1osSUFBTCxDQUFVZ0IsSUFBVixDQUFlLE1BQWYsRUFBdUJaLEtBQXZCO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFHZ0JNLE07Ozs7Ozs7O0FBQ1hWLGdCQUFBQSxJLEdBQU8sS0FBS0EsSTtBQUNaaUIsZ0JBQUFBLEcsR0FBTSxJQUFJQyxVQUFKLENBQVc7QUFBRVIsa0JBQUFBLE1BQU0sRUFBTkE7QUFBRixpQkFBWCxDOztBQUNaLG9CQUFJVixJQUFJLENBQUNtQixPQUFULEVBQWtCO0FBQ2hCRixrQkFBQUEsR0FBRyxDQUFDRyxTQUFKOztBQUNBSCxrQkFBQUEsR0FBRyxDQUFDSSxNQUFKLEdBQWEsVUFBQUMsR0FBRyxFQUFJO0FBQ2xCdEIsb0JBQUFBLElBQUksQ0FBQ2dCLElBQUwsQ0FBVU8sSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsQ0FBVixFQUErQixNQUFJLENBQUNsQixLQUFMLEdBQWEsUUFBNUM7QUFDRCxtQkFGRDs7QUFHQUosa0JBQUFBLElBQUksQ0FBQ08sU0FBTCxDQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQix3QkFBSUEsR0FBRyxDQUFDSixLQUFKLEtBQWMsTUFBSSxDQUFDQSxLQUFMLEdBQWEsU0FBL0IsRUFBMEM7QUFDeENhLHNCQUFBQSxHQUFHLENBQUNRLE1BQUosQ0FBV0YsSUFBSSxDQUFDRyxLQUFMLENBQVdsQixHQUFHLENBQUNDLElBQWYsQ0FBWDtBQUNEO0FBQ0YsbUJBSkQsRUFJRyxLQUFLTCxLQUpSO0FBS0QsaUJBVkQsTUFVTztBQUNMSixrQkFBQUEsSUFBSSxDQUFDTyxTQUFMLENBQWUsVUFBQUMsR0FBRyxFQUFJO0FBQ3BCRyxvQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksT0FBWixFQUFxQixNQUFJLENBQUNSLEtBQTFCOztBQUNBLHdCQUFJSSxHQUFHLENBQUNKLEtBQUosS0FBYyxNQUFJLENBQUNBLEtBQUwsR0FBYSxRQUEvQixFQUF5QztBQUN2Q2Esc0JBQUFBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXRixJQUFJLENBQUNHLEtBQUwsQ0FBV2xCLEdBQUcsQ0FBQ0MsSUFBZixDQUFYOztBQUNBUSxzQkFBQUEsR0FBRyxDQUFDSSxNQUFKLEdBQWEsVUFBQUMsR0FBRyxFQUFJO0FBQ2xCdEIsd0JBQUFBLElBQUksQ0FBQ2dCLElBQUwsQ0FBVU8sSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsQ0FBVixFQUErQixNQUFJLENBQUNsQixLQUFMLEdBQWEsU0FBNUM7QUFDRCx1QkFGRDtBQUdEO0FBQ0YsbUJBUkQsRUFRRyxLQUFLQSxLQVJSO0FBU0Q7O0FBQ0RhLGdCQUFBQSxHQUFHLENBQUNVLGFBQUosQ0FBa0IsVUFBQWpCLE1BQU0sRUFBSTtBQUMxQkMsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUVGLG9CQUFBQSxNQUFNLEVBQU5BO0FBQUYsbUJBQVo7O0FBQ0Esa0JBQUEsTUFBSSxDQUFDUixRQUFMLENBQWNRLE1BQWQ7QUFDRCxpQkFIRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IGdldExvY2FsQXVkaW8sIGdldExvY2FsRGVza3RvcCwgZ2V0TG9jYWxWaWRlbyB9IGZyb20gXCIuL3V0aWxsXCI7XG5cbnR5cGUgR2V0ID1cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbEF1ZGlvPlxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsRGVza3RvcD5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbFZpZGVvPlxuICB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmludGVyZmFjZSBPcHRpb24ge1xuICBnZXQ6IEdldDtcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgb25TdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuICBsYWJlbDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGVlcjogV2ViUlRDLCBwcml2YXRlIG9wdDogUGFydGlhbDxPcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9uU3RyZWFtID0gXyA9PiB7fTtcbiAgICB0aGlzLmxhYmVsID0gb3B0LmxhYmVsIHx8IFwic3RyZWFtXCI7XG4gICAgdGhpcy5saXN0ZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbGlzdGVuKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJpbml0X1wiICsgdGhpcy5sYWJlbDtcbiAgICBsZXQgc3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZDtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHRoaXMucGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgIGlmIChyYXcubGFiZWwgPT09IGxhYmVsICYmIHJhdy5kYXRhID09PSBcImRvbmVcIikge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHN0cmVhbSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnQgc3RyZWFtaW5nXCIpO1xuICAgICAgICAgIHRoaXMuaW5pdChzdHJlYW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgbGFiZWwpO1xuICAgIGlmICh0aGlzLm9wdC5nZXQpIHtcbiAgICAgIHN0cmVhbSA9IChhd2FpdCB0aGlzLm9wdC5nZXQuY2F0Y2goY29uc29sZS5sb2cpKSBhcyBhbnk7XG4gICAgfVxuICAgIGlmIChkb25lKSB7XG4gICAgICB0aGlzLmluaXQoc3RyZWFtKTtcbiAgICB9XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGRvbmVcIik7XG4gICAgICB0aGlzLnBlZXIuc2VuZChcImRvbmVcIiwgbGFiZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdChzdHJlYW06IE1lZGlhU3RyZWFtIHwgdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgcGVlciA9IHRoaXMucGVlcjtcbiAgICBjb25zdCBydGMgPSBuZXcgV2ViUlRDKHsgc3RyZWFtIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHJ0Yy5tYWtlT2ZmZXIoKTtcbiAgICAgIHJ0Yy5zaWduYWwgPSBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpO1xuICAgICAgfTtcbiAgICAgIHBlZXIuYWRkT25EYXRhKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIikge1xuICAgICAgICAgIHJ0Yy5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJsYWJlbFwiLCB0aGlzLmxhYmVsKTtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gdGhpcy5sYWJlbCArIFwiX29mZmVyXCIpIHtcbiAgICAgICAgICBydGMuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgICBydGMuc2lnbmFsID0gc2RwID0+IHtcbiAgICAgICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMubGFiZWwpO1xuICAgIH1cbiAgICBydGMuYWRkT25BZGRUcmFjayhzdHJlYW0gPT4ge1xuICAgICAgY29uc29sZS5sb2coeyBzdHJlYW0gfSk7XG4gICAgICB0aGlzLm9uU3RyZWFtKHN0cmVhbSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==