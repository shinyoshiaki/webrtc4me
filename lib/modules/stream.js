"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaType = void 0;

var _core = _interopRequireDefault(require("../core"));

var _event = _interopRequireDefault(require("../utill/event"));

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

    _defineProperty(this, "onStream", new _event.default());

    _defineProperty(this, "onLocalStream", new _event.default());

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "initDone", false);

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

        var label, _this$opt, get, stream, immidiate, track, localStream;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                label = "init_" + this.label;
                _this$opt = this.opt, get = _this$opt.get, stream = _this$opt.stream, immidiate = _this$opt.immidiate, track = _this$opt.track;
                localStream = stream;

                if (!immidiate) {
                  _context.next = 7;
                  break;
                }

                this.init({
                  stream: localStream,
                  track: track
                });
                _context.next = 14;
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
                this.onLocalStream.excute(localStream);

              case 12:
                this.peer.onData.once(function (raw) {
                  if (raw.label === label && raw.data === "done") {
                    if (!get) {
                      _this.init({
                        stream: localStream,
                        track: track
                      });
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
      regeneratorRuntime.mark(function _callee2(media) {
        var _this2 = this;

        var stream, track, peer, newPeer;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                stream = media.stream, track = media.track;

                if (!this.initDone) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                this.initDone = true;
                peer = this.peer;
                newPeer = new _core.default({
                  stream: stream,
                  track: track
                });

                if (peer.isOffer) {
                  newPeer.makeOffer();
                  newPeer.onSignal.once(function (sdp) {
                    peer.send(JSON.stringify(sdp), _this2.label + "_offer");
                  });
                  peer.onData.once(function (raw) {
                    if (raw.label === _this2.label + "_answer") {
                      newPeer.setSdp(JSON.parse(raw.data));
                    }
                  });
                } else {
                  peer.onData.once(function (raw) {
                    if (raw.label === _this2.label + "_offer") {
                      newPeer.setSdp(JSON.parse(raw.data));
                      newPeer.onSignal.once(function (sdp) {
                        peer.send(JSON.stringify(sdp), _this2.label + "_answer");
                      });
                    }
                  });
                }

                newPeer.onAddTrack.once(function (stream) {
                  _this2.onStream.excute(stream);
                });

              case 8:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL3N0cmVhbS50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiTWVkaWFUeXBlIiwiU3RyZWFtIiwicGVlciIsIm9wdCIsIkV2ZW50IiwibGFiZWwiLCJsaXN0ZW4iLCJnZXQiLCJzdHJlYW0iLCJpbW1pZGlhdGUiLCJ0cmFjayIsImxvY2FsU3RyZWFtIiwiaW5pdCIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsIm9uTG9jYWxTdHJlYW0iLCJleGN1dGUiLCJvbkRhdGEiLCJvbmNlIiwicmF3IiwiZGF0YSIsInNlbmQiLCJtZWRpYSIsImluaXREb25lIiwibmV3UGVlciIsIldlYlJUQyIsImlzT2ZmZXIiLCJtYWtlT2ZmZXIiLCJvblNpZ25hbCIsInNkcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRTZHAiLCJwYXJzZSIsIm9uQWRkVHJhY2siLCJvblN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBSkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQVlZQyxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBYVNDLE07OztBQU9uQixrQkFBb0JDLElBQXBCLEVBQXFFO0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQSxzQ0FOMUQsSUFBSUMsY0FBSixFQU0wRDs7QUFBQSwyQ0FMckQsSUFBSUEsY0FBSixFQUtxRDs7QUFBQTs7QUFBQSxzQ0FGMUQsS0FFMEQ7O0FBQ25FLFNBQUtDLEtBQUwsR0FBYUYsR0FBRyxDQUFDRSxLQUFKLElBQWEsUUFBMUI7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7NEJBRWEsS0FBS0YsRyxFQUF2Q0ksRyxhQUFBQSxHLEVBQUtDLE0sYUFBQUEsTSxF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UEQ7QUFRRDs7QUFDRG9CLGdCQUFBQSxPQUFPLENBQUNVLFVBQVIsQ0FBbUJoQixJQUFuQixDQUF3QixVQUFBWCxNQUFNLEVBQUk7QUFDaEMsa0JBQUEsTUFBSSxDQUFDNEIsUUFBTCxDQUFjbkIsTUFBZCxDQUFxQlQsTUFBckI7QUFDRCxpQkFGRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi4vY29yZVwiO1xuaW1wb3J0IHsgZ2V0TG9jYWxBdWRpbywgZ2V0TG9jYWxEZXNrdG9wLCBnZXRMb2NhbFZpZGVvIH0gZnJvbSBcIi4uL3V0aWxsL21lZGlhXCI7XG5pbXBvcnQgRXZlbnQgZnJvbSBcIi4uL3V0aWxsL2V2ZW50XCI7XG5cbnR5cGUgR2V0ID1cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbEF1ZGlvPlxuICB8IFJldHVyblR5cGU8dHlwZW9mIGdldExvY2FsRGVza3RvcD5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbFZpZGVvPlxuICB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGVudW0gTWVkaWFUeXBlIHtcbiAgdmlkZW8sXG4gIGF1ZGlvXG59XG5cbmludGVyZmFjZSBPcHRpb24ge1xuICBpbW1pZGlhdGU6IGJvb2xlYW47XG4gIGdldDogR2V0O1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICB0cmFjazogTWVkaWFTdHJlYW1UcmFjaztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgb25TdHJlYW0gPSBuZXcgRXZlbnQ8TWVkaWFTdHJlYW0+KCk7XG4gIG9uTG9jYWxTdHJlYW0gPSBuZXcgRXZlbnQ8TWVkaWFTdHJlYW0+KCk7XG5cbiAgbGFiZWw6IHN0cmluZztcbiAgaW5pdERvbmUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlZXI6IFdlYlJUQywgcHJpdmF0ZSBvcHQ6IFBhcnRpYWw8T3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5sYWJlbCA9IG9wdC5sYWJlbCB8fCBcInN0cmVhbVwiO1xuICAgIHRoaXMubGlzdGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxpc3RlbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiaW5pdF9cIiArIHRoaXMubGFiZWw7XG5cbiAgICBjb25zdCB7IGdldCwgc3RyZWFtLCBpbW1pZGlhdGUsIHRyYWNrIH0gPSB0aGlzLm9wdDtcbiAgICBsZXQgbG9jYWxTdHJlYW0gPSBzdHJlYW07XG5cbiAgICBpZiAoaW1taWRpYXRlKSB7XG4gICAgICB0aGlzLmluaXQoeyBzdHJlYW06IGxvY2FsU3RyZWFtLCB0cmFjayB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGdldCkge1xuICAgICAgICBsb2NhbFN0cmVhbSA9IChhd2FpdCBnZXQuY2F0Y2goY29uc29sZS5sb2cpKSBhcyBNZWRpYVN0cmVhbTtcbiAgICAgICAgdGhpcy5vbkxvY2FsU3RyZWFtLmV4Y3V0ZShsb2NhbFN0cmVhbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGVlci5vbkRhdGEub25jZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSBsYWJlbCAmJiByYXcuZGF0YSA9PT0gXCJkb25lXCIpIHtcbiAgICAgICAgICBpZiAoIWdldCkge1xuICAgICAgICAgICAgdGhpcy5pbml0KHsgc3RyZWFtOiBsb2NhbFN0cmVhbSwgdHJhY2sgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5wZWVyLnNlbmQoXCJkb25lXCIsIGxhYmVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQobWVkaWE6IHtcbiAgICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcbiAgICB0cmFjaz86IE1lZGlhU3RyZWFtVHJhY2s7XG4gIH0pIHtcbiAgICBjb25zdCB7IHN0cmVhbSwgdHJhY2sgfSA9IG1lZGlhO1xuXG4gICAgaWYgKHRoaXMuaW5pdERvbmUpIHJldHVybjtcbiAgICB0aGlzLmluaXREb25lID0gdHJ1ZTtcblxuICAgIGNvbnN0IHBlZXIgPSB0aGlzLnBlZXI7XG4gICAgY29uc3QgbmV3UGVlciA9IG5ldyBXZWJSVEMoeyBzdHJlYW0sIHRyYWNrIH0pO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIG5ld1BlZXIubWFrZU9mZmVyKCk7XG4gICAgICBuZXdQZWVyLm9uU2lnbmFsLm9uY2Uoc2RwID0+IHtcbiAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9vZmZlclwiKTtcbiAgICAgIH0pO1xuICAgICAgcGVlci5vbkRhdGEub25jZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpIHtcbiAgICAgICAgICBuZXdQZWVyLnNldFNkcChKU09OLnBhcnNlKHJhdy5kYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyLm9uRGF0YS5vbmNlKHJhdyA9PiB7XG4gICAgICAgIGlmIChyYXcubGFiZWwgPT09IHRoaXMubGFiZWwgKyBcIl9vZmZlclwiKSB7XG4gICAgICAgICAgbmV3UGVlci5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICAgIG5ld1BlZXIub25TaWduYWwub25jZShzZHAgPT4ge1xuICAgICAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIHRoaXMubGFiZWwgKyBcIl9hbnN3ZXJcIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBuZXdQZWVyLm9uQWRkVHJhY2sub25jZShzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbS5leGN1dGUoc3RyZWFtKTtcbiAgICB9KTtcbiAgfVxufVxuIl19