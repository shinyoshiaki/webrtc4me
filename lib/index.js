"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excuteEvent = excuteEvent;
exports.addEvent = addEvent;
exports.default = void 0;

var _wrtc = require("wrtc");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

function excuteEvent(ev, v) {
  Object.keys(ev).forEach(function (key) {
    var func = ev[key];

    if (v) {
      func(v);
    } else {
      func();
    }
  });
}

function addEvent(event, func, _tag) {
  var tag = _tag || function () {
    var gen = Math.random().toString();

    while (Object.keys(event).includes(gen)) {
      gen = Math.random().toString();
    }

    return gen;
  }();

  if (Object.keys(event).includes(tag)) {
    console.error("include tag");
  } else {
    event[tag] = func;
  }
}

var WebRTC =
/*#__PURE__*/
function () {
  function WebRTC() {
    var _this = this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebRTC);

    _defineProperty(this, "rtc", void 0);

    _defineProperty(this, "signal", void 0);

    _defineProperty(this, "connect", void 0);

    _defineProperty(this, "disconnect", void 0);

    _defineProperty(this, "onData", {});

    _defineProperty(this, "addOnData", function (func, tag) {
      addEvent(_this.onData, func, tag);
    });

    _defineProperty(this, "onAddTrack", {});

    _defineProperty(this, "addOnAddTrack", function (func, tag) {
      addEvent(_this.onAddTrack, func, tag);
    });

    _defineProperty(this, "dataChannels", void 0);

    _defineProperty(this, "nodeId", void 0);

    _defineProperty(this, "isConnected", false);

    _defineProperty(this, "isDisconnected", false);

    _defineProperty(this, "isOffer", false);

    _defineProperty(this, "isMadeAnswer", false);

    _defineProperty(this, "negotiating", false);

    _defineProperty(this, "opt", void 0);

    this.opt = opt;
    this.dataChannels = {};
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};

    this.rtc = this.prepareNewConnection();
    this.addStream();
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection() {
      var _this2 = this;

      var peer;
      if (this.opt.nodeId) this.nodeId = this.opt.nodeId;

      if (this.opt.disable_stun) {
        peer = new _wrtc.RTCPeerConnection({
          iceServers: []
        });
      } else {
        peer = new _wrtc.RTCPeerConnection({
          iceServers: [{
            urls: "stun:stun.l.google.com:19302"
          }]
        });
      }

      peer.onicecandidate = function (evt) {
        if (evt.candidate) {
          if (_this2.opt.trickle) {
            _this2.signal({
              type: "candidate",
              sdp: evt.candidate
            });
          }
        } else {
          if (!_this2.opt.trickle && peer.localDescription) {
            _this2.signal(peer.localDescription);
          }
        }
      };

      peer.oniceconnectionstatechange = function () {
        switch (peer.iceConnectionState) {
          case "failed":
            _this2.hangUp();

            break;

          case "disconnected":
            _this2.hangUp();

            break;

          case "connected":
            _this2.negotiating = false;
            break;

          case "closed":
            break;

          case "completed":
            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this2.dataChannels[dataChannel.label] = dataChannel;

        _this2.dataChannelEvents(dataChannel);
      };

      peer.onsignalingstatechange = function (e) {};

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];
        excuteEvent(_this2.onAddTrack, stream);
      };

      return peer;
    }
  }, {
    key: "hangUp",
    value: function hangUp() {
      this.isDisconnected = true;
      this.isConnected = false;
      this.disconnect();
    }
  }, {
    key: "makeOffer",
    value: function makeOffer() {
      var _this3 = this;

      this.rtc.onnegotiationneeded =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var offer;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this3.negotiating) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this3.negotiating = true;
                _context.next = 5;
                return _this3.rtc.createOffer().catch(console.log);

              case 5:
                offer = _context.sent;

                if (offer) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return");

              case 8:
                _context.next = 10;
                return _this3.rtc.setLocalDescription(offer).catch(console.log);

              case 10:
                if (_this3.opt.trickle && _this3.rtc.localDescription) {
                  _this3.signal(_this3.rtc.localDescription);
                }

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      this.isOffer = true;
      this.createDatachannel("datachannel");
    }
  }, {
    key: "createDatachannel",
    value: function createDatachannel(label) {
      try {
        var dc = this.rtc.createDataChannel(label);
        this.dataChannelEvents(dc);
        this.dataChannels[label] = dc;
      } catch (dce) {}
    }
  }, {
    key: "dataChannelEvents",
    value: function dataChannelEvents(channel) {
      var _this4 = this;

      channel.onopen = function () {
        if (!_this4.isConnected) {
          _this4.connect();

          _this4.isConnected = true;
        }
      };

      try {
        channel.onmessage =
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(event) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (event) {
                      _context2.next = 2;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 2:
                    excuteEvent(_this4.onData, {
                      label: channel.label,
                      data: event.data,
                      nodeId: _this4.nodeId
                    });

                    if (channel.label === "webrtc") {}

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }();
      } catch (error) {}

      channel.onerror = function (err) {};

      channel.onclose = function () {
        _this4.hangUp();
      };
    }
  }, {
    key: "addStream",
    value: function addStream() {
      var _this5 = this;

      if (this.opt.stream) {
        var _stream = this.opt.stream;

        _stream.getTracks().forEach(function (track) {
          return _this5.rtc.addTrack(track, _stream);
        });
      }
    }
  }, {
    key: "setAnswer",
    value: function () {
      var _setAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(sdp) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setAnswer(_x2) {
        return _setAnswer.apply(this, arguments);
      }

      return setAnswer;
    }()
  }, {
    key: "makeAnswer",
    value: function () {
      var _makeAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(sdp) {
        var answer, localDescription;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.isMadeAnswer) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return");

              case 2:
                this.isMadeAnswer = true;
                _context4.next = 5;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 5:
                _context4.next = 7;
                return this.rtc.createAnswer().catch(console.log);

              case 7:
                answer = _context4.sent;

                if (answer) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return");

              case 10:
                _context4.next = 12;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 12:
                localDescription = this.rtc.localDescription;

                if (this.opt.trickle && localDescription) {
                  this.signal(localDescription);
                }

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function makeAnswer(_x3) {
        return _makeAnswer.apply(this, arguments);
      }

      return makeAnswer;
    }()
  }, {
    key: "setSdp",
    value: function setSdp(sdp) {
      switch (sdp.type) {
        case "offer":
          this.makeAnswer(sdp);
          break;

        case "answer":
          this.setAnswer(sdp);
          break;

        case "candidate":
          this.rtc.addIceCandidate(sdp);
          break;
      }
    }
  }, {
    key: "send",
    value: function send(data, label) {
      label = label || "datachannel";

      if (!Object.keys(this.dataChannels).includes(label)) {
        this.createDatachannel(label);
      }

      try {
        this.dataChannels[label].send(data);
      } catch (error) {
        this.hangUp();
      }
    }
  }, {
    key: "connecting",
    value: function connecting(nodeId) {
      this.nodeId = nodeId;
    }
  }]);

  return WebRTC;
}();

exports.default = WebRTC;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiY29uc29sZSIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsImRhdGFDaGFubmVscyIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJhZGRTdHJlYW0iLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsIm9uaWNlY2FuZGlkYXRlIiwiZXZ0IiwiY2FuZGlkYXRlIiwidHJpY2tsZSIsInR5cGUiLCJsb2NhbERlc2NyaXB0aW9uIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJoYW5nVXAiLCJuZWdvdGlhdGluZyIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJvbnRyYWNrIiwic3RyZWFtIiwic3RyZWFtcyIsImlzRGlzY29ubmVjdGVkIiwiaXNDb25uZWN0ZWQiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsImxvZyIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJkYXRhIiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJnZXRUcmFja3MiLCJ0cmFjayIsImFkZFRyYWNrIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJpc01hZGVBbnN3ZXIiLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQTBCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxFQUFaLEVBQWdCSSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHTixFQUFFLENBQUNLLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSUosQ0FBSixFQUFPO0FBQ0xLLE1BQUFBLElBQUksQ0FBQ0wsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xLLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FBT0gsR0FBUDtBQUNELEdBTkQsRUFGRjs7QUFTQSxNQUFJVCxNQUFNLENBQUNDLElBQVAsQ0FBWUssS0FBWixFQUFtQk8sUUFBbkIsQ0FBNEJM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RCxlQUFULENBQXlCMUQsR0FBekI7QUFDQTtBQVRKO0FBV0Q7Ozt5QkFFSTRDLEksRUFBV3RCLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQy9DLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUttQixZQUFqQixFQUErQlAsUUFBL0IsQ0FBd0NrQyxLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtnQixpQkFBTCxDQUF1QmhCLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUszQixZQUFMLENBQWtCMkIsS0FBbEIsRUFBeUJxQyxJQUF6QixDQUE4QmYsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT3RELEtBQVAsRUFBYztBQUNkLGFBQUsyQixNQUFMO0FBQ0Q7QUFDRjs7OytCQUVVckIsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW46IGJvb2xlYW47XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIG5vZGVJZDogc3RyaW5nO1xuICB0cmlja2xlOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YSB7XG4gIFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG59XG5pbnRlcmZhY2UgT25BZGRUcmFjayB7XG4gIFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xufVxuXG50eXBlIEV2ZW50ID0gT25EYXRhIHwgT25BZGRUcmFjaztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBFdmVudCwgdj86IGFueSkge1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IGZ1bmM6IGFueSA9IGV2W2tleV07XG4gICAgaWYgKHYpIHtcbiAgICAgIGZ1bmModik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQ8VCBleHRlbmRzIEV2ZW50PihcbiAgZXZlbnQ6IFQsXG4gIGZ1bmM6IFRba2V5b2YgVF0sXG4gIF90YWc/OiBzdHJpbmdcbikge1xuICBjb25zdCB0YWcgPVxuICAgIF90YWcgfHxcbiAgICAoKCkgPT4ge1xuICAgICAgbGV0IGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXMoZ2VuKSkge1xuICAgICAgICBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuO1xuICAgIH0pKCk7XG4gIGlmIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXModGFnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpbmNsdWRlIHRhZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudFt0YWddID0gZnVuYztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogb2JqZWN0KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogT25EYXRhID0ge307XG4gIGFkZE9uRGF0YSA9IChmdW5jOiBPbkRhdGFba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25EYXRhPih0aGlzLm9uRGF0YSwgZnVuYywgdGFnKTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiBPbkFkZFRyYWNrID0ge307XG4gIGFkZE9uQWRkVHJhY2sgPSAoZnVuYzogT25BZGRUcmFja1trZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkFkZFRyYWNrPih0aGlzLm9uQWRkVHJhY2ssIGZ1bmMsIHRhZyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgaXNPZmZlciA9IGZhbHNlO1xuICBpc01hZGVBbnN3ZXIgPSBmYWxzZTtcbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcblxuICBvcHQ6IFBhcnRpYWw8b3B0aW9uPjtcblxuICBjb25zdHJ1Y3RvcihvcHQ6IFBhcnRpYWw8b3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuXG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5hZGRTdHJlYW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmICh0aGlzLm9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gdGhpcy5vcHQubm9kZUlkO1xuICAgIGlmICh0aGlzLm9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKGV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbCh7IHR5cGU6IFwiY2FuZGlkYXRlXCIsIHNkcDogZXZ0LmNhbmRpZGF0ZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdC50cmlja2xlICYmIHBlZXIubG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHt9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCBzdHJlYW0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZ1VwKCkge1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIG1ha2VPZmZlcigpIHtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHJldHVybjtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICghb2ZmZXIpIHJldHVybjtcbiAgICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlICYmIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwid2VicnRjXCIpIHtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge307XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMub3B0LnN0cmVhbSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy5vcHQuc3RyZWFtO1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0QW5zd2VyKHNkcDogYW55KSB7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNNYWRlQW5zd2VyKSByZXR1cm47XG4gICAgdGhpcy5pc01hZGVBbnN3ZXIgPSB0cnVlO1xuXG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmICghYW5zd2VyKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBjb25zdCBsb2NhbERlc2NyaXB0aW9uID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcbiAgICBpZiAodGhpcy5vcHQudHJpY2tsZSAmJiBsb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNpZ25hbChsb2NhbERlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzZXRTZHAoc2RwOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHNkcC50eXBlKSB7XG4gICAgICBjYXNlIFwib2ZmZXJcIjpcbiAgICAgICAgdGhpcy5tYWtlQW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFuc3dlclwiOlxuICAgICAgICB0aGlzLnNldEFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgdGhpcy5ydGMuYWRkSWNlQ2FuZGlkYXRlKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==