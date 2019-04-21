"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MediaType = void 0;

var _core = _interopRequireDefault(require("../core"));

var _event = _interopRequireDefault(require("../utill/event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

    _defineProperty(this, "onStream", new _event["default"]());

    _defineProperty(this, "onLocalStream", new _event["default"]());

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
                return get["catch"](console.log);

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
                newPeer = new _core["default"]({
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

exports["default"] = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL3N0cmVhbS50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiTWVkaWFUeXBlIiwiU3RyZWFtIiwicGVlciIsIm9wdCIsIkV2ZW50IiwibGFiZWwiLCJsaXN0ZW4iLCJnZXQiLCJzdHJlYW0iLCJpbW1pZGlhdGUiLCJ0cmFjayIsImxvY2FsU3RyZWFtIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJvbkxvY2FsU3RyZWFtIiwiZXhjdXRlIiwib25EYXRhIiwib25jZSIsInJhdyIsImRhdGEiLCJzZW5kIiwibWVkaWEiLCJpbml0RG9uZSIsIm5ld1BlZXIiLCJXZWJSVEMiLCJpc09mZmVyIiwibWFrZU9mZmVyIiwib25TaWduYWwiLCJzZHAiLCJKU09OIiwic3RyaW5naWZ5Iiwic2V0U2RwIiwicGFyc2UiLCJvbkFkZFRyYWNrIiwib25TdHJlYW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQUpBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFZWUMsUzs7O1dBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0FBQUFBLEVBQUFBLFMsQ0FBQUEsUztHQUFBQSxTLHlCQUFBQSxTOztJQWFTQyxNOzs7QUFPbkIsa0JBQW9CQyxJQUFwQixFQUFxRTtBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBO0FBQUE7O0FBQUEsc0NBTjFELElBQUlDLGlCQUFKLEVBTTBEOztBQUFBLDJDQUxyRCxJQUFJQSxpQkFBSixFQUtxRDs7QUFBQTs7QUFBQSxzQ0FGMUQsS0FFMEQ7O0FBQ25FLFNBQUtDLEtBQUwsR0FBYUYsR0FBRyxDQUFDRSxLQUFKLElBQWEsUUFBMUI7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHT0QsZ0JBQUFBLEssR0FBUSxVQUFVLEtBQUtBLEs7NEJBRWEsS0FBS0YsRyxFQUF2Q0ksRyxhQUFBQSxHLEVBQUtDLE0sYUFBQUEsTSxFQUFRQyxT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QixnQkFBQUEsT0FBTyxDQUFDVSxVQUFSLENBQW1CaEIsSUFBbkIsQ0FBd0IsVUFBQVYsTUFBTSxFQUFJO0FBQ2hDLGtCQUFBLE1BQUksQ0FBQzJCLFFBQUwsQ0FBY25CLE1BQWQsQ0FBcUJSLE1BQXJCO0FBQ0QsaUJBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4uL2NvcmVcIjtcbmltcG9ydCB7IGdldExvY2FsQXVkaW8sIGdldExvY2FsRGVza3RvcCwgZ2V0TG9jYWxWaWRlbyB9IGZyb20gXCIuLi91dGlsbC9tZWRpYVwiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCIuLi91dGlsbC9ldmVudFwiO1xuXG50eXBlIEdldCA9XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxBdWRpbz5cbiAgfCBSZXR1cm5UeXBlPHR5cGVvZiBnZXRMb2NhbERlc2t0b3A+XG4gIHwgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0TG9jYWxWaWRlbz5cbiAgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uIHtcbiAgaW1taWRpYXRlOiBib29sZWFuO1xuICBnZXQ6IEdldDtcbiAgc3RyZWFtOiBNZWRpYVN0cmVhbTtcbiAgdHJhY2s6IE1lZGlhU3RyZWFtVHJhY2s7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIG9uU3RyZWFtID0gbmV3IEV2ZW50PE1lZGlhU3RyZWFtPigpO1xuICBvbkxvY2FsU3RyZWFtID0gbmV3IEV2ZW50PE1lZGlhU3RyZWFtPigpO1xuXG4gIGxhYmVsOiBzdHJpbmc7XG4gIGluaXREb25lID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwZWVyOiBXZWJSVEMsIHByaXZhdGUgb3B0OiBQYXJ0aWFsPE9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMubGFiZWwgPSBvcHQubGFiZWwgfHwgXCJzdHJlYW1cIjtcbiAgICB0aGlzLmxpc3RlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsaXN0ZW4oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcImluaXRfXCIgKyB0aGlzLmxhYmVsO1xuXG4gICAgY29uc3QgeyBnZXQsIHN0cmVhbSwgaW1taWRpYXRlLCB0cmFjayB9ID0gdGhpcy5vcHQ7XG4gICAgbGV0IGxvY2FsU3RyZWFtID0gc3RyZWFtO1xuXG4gICAgaWYgKGltbWlkaWF0ZSkge1xuICAgICAgdGhpcy5pbml0KHsgc3RyZWFtOiBsb2NhbFN0cmVhbSwgdHJhY2sgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChnZXQpIHtcbiAgICAgICAgbG9jYWxTdHJlYW0gPSAoYXdhaXQgZ2V0LmNhdGNoKGNvbnNvbGUubG9nKSkgYXMgTWVkaWFTdHJlYW07XG4gICAgICAgIHRoaXMub25Mb2NhbFN0cmVhbS5leGN1dGUobG9jYWxTdHJlYW0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBlZXIub25EYXRhLm9uY2UocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gbGFiZWwgJiYgcmF3LmRhdGEgPT09IFwiZG9uZVwiKSB7XG4gICAgICAgICAgaWYgKCFnZXQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCh7IHN0cmVhbTogbG9jYWxTdHJlYW0sIHRyYWNrIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucGVlci5zZW5kKFwiZG9uZVwiLCBsYWJlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KG1lZGlhOiB7XG4gICAgc3RyZWFtPzogTWVkaWFTdHJlYW07XG4gICAgdHJhY2s/OiBNZWRpYVN0cmVhbVRyYWNrO1xuICB9KSB7XG4gICAgY29uc3QgeyBzdHJlYW0sIHRyYWNrIH0gPSBtZWRpYTtcblxuICAgIGlmICh0aGlzLmluaXREb25lKSByZXR1cm47XG4gICAgdGhpcy5pbml0RG9uZSA9IHRydWU7XG5cbiAgICBjb25zdCBwZWVyID0gdGhpcy5wZWVyO1xuICAgIGNvbnN0IG5ld1BlZXIgPSBuZXcgV2ViUlRDKHsgc3RyZWFtLCB0cmFjayB9KTtcbiAgICBpZiAocGVlci5pc09mZmVyKSB7XG4gICAgICBuZXdQZWVyLm1ha2VPZmZlcigpO1xuICAgICAgbmV3UGVlci5vblNpZ25hbC5vbmNlKHNkcCA9PiB7XG4gICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIik7XG4gICAgICB9KTtcbiAgICAgIHBlZXIub25EYXRhLm9uY2UocmF3ID0+IHtcbiAgICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gdGhpcy5sYWJlbCArIFwiX2Fuc3dlclwiKSB7XG4gICAgICAgICAgbmV3UGVlci5zZXRTZHAoSlNPTi5wYXJzZShyYXcuZGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlci5vbkRhdGEub25jZShyYXcgPT4ge1xuICAgICAgICBpZiAocmF3LmxhYmVsID09PSB0aGlzLmxhYmVsICsgXCJfb2ZmZXJcIikge1xuICAgICAgICAgIG5ld1BlZXIuc2V0U2RwKEpTT04ucGFyc2UocmF3LmRhdGEpKTtcbiAgICAgICAgICBuZXdQZWVyLm9uU2lnbmFsLm9uY2Uoc2RwID0+IHtcbiAgICAgICAgICAgIHBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShzZHApLCB0aGlzLmxhYmVsICsgXCJfYW5zd2VyXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgbmV3UGVlci5vbkFkZFRyYWNrLm9uY2Uoc3RyZWFtID0+IHtcbiAgICAgIHRoaXMub25TdHJlYW0uZXhjdXRlKHN0cmVhbSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==