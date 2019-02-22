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
    console.error("included tag", tag);
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
              ice: evt.candidate
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
          this.rtc.addIceCandidate(new _wrtc.RTCIceCandidate(sdp.ice));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiY29uc29sZSIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsImRhdGFDaGFubmVscyIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJhZGRTdHJlYW0iLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsIm9uaWNlY2FuZGlkYXRlIiwiZXZ0IiwiY2FuZGlkYXRlIiwidHJpY2tsZSIsInR5cGUiLCJpY2UiLCJsb2NhbERlc2NyaXB0aW9uIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJoYW5nVXAiLCJuZWdvdGlhdGluZyIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJvbnRyYWNrIiwic3RyZWFtIiwic3RyZWFtcyIsImlzRGlzY29ubmVjdGVkIiwiaXNDb25uZWN0ZWQiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsImxvZyIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJkYXRhIiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJnZXRUcmFja3MiLCJ0cmFjayIsImFkZFRyYWNrIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJpc01hZGVBbnN3ZXIiLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwiUlRDSWNlQ2FuZGlkYXRlIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBREFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQTZCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxFQUFaLEVBQWdCSSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHTixFQUFFLENBQUNLLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSUosQ0FBSixFQUFPO0FBQ0xLLE1BQUFBLElBQUksQ0FBQ0wsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xLLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FBT0gsR0FBUDtBQUNELEdBTkQsRUFGRjs7QUFTQSxNQUFJVCxNQUFNLENBQUNDLElBQVAsQ0FBWUss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QUFDQTs7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLQyxHQUFMLENBQVMwRCxlQUFULENBQXlCLElBQUlDLHFCQUFKLENBQW9CNUQsR0FBRyxDQUFDYyxHQUF4QixDQUF6QjtBQUNBO0FBVEo7QUFXRDs7O3lCQUVJK0IsSSxFQUFXdEIsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDaEQsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS21CLFlBQWpCLEVBQStCUCxRQUEvQixDQUF3Q21DLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS2dCLGlCQUFMLENBQXVCaEIsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBSzVCLFlBQUwsQ0FBa0I0QixLQUFsQixFQUF5QnNDLElBQXpCLENBQThCaEIsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT3ZELEtBQVAsRUFBYztBQUNkLGFBQUs0QixNQUFMO0FBQ0Q7QUFDRjs7OytCQUVVdEIsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7XG4gIFJUQ1BlZXJDb25uZWN0aW9uLFxuICBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gIFJUQ0ljZUNhbmRpZGF0ZVxufSBmcm9tIFwid3J0Y1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBub2RlSWQ6IHN0cmluZztcbiAgdHJpY2tsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPbkRhdGEge1xuICBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkO1xufVxuaW50ZXJmYWNlIE9uQWRkVHJhY2sge1xuICBba2V5OiBzdHJpbmddOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbn1cblxudHlwZSBFdmVudCA9IE9uRGF0YSB8IE9uQWRkVHJhY2s7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBmdW5jOiBhbnkgPSBldltrZXldO1xuICAgIGlmICh2KSB7XG4gICAgICBmdW5jKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50PFQgZXh0ZW5kcyBFdmVudD4oXG4gIGV2ZW50OiBULFxuICBmdW5jOiBUW2tleW9mIFRdLFxuICBfdGFnPzogc3RyaW5nXG4pIHtcbiAgY29uc3QgdGFnID1cbiAgICBfdGFnIHx8XG4gICAgKCgpID0+IHtcbiAgICAgIGxldCBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKGdlbikpIHtcbiAgICAgICAgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdlbjtcbiAgICB9KSgpO1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKHRhZykpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiaW5jbHVkZWQgdGFnXCIsIHRhZyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRbdGFnXSA9IGZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IG9iamVjdCkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IE9uRGF0YSA9IHt9O1xuICBhZGRPbkRhdGEgPSAoZnVuYzogT25EYXRhW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uRGF0YT4odGhpcy5vbkRhdGEsIGZ1bmMsIHRhZyk7XG4gIH07XG4gIHByaXZhdGUgb25BZGRUcmFjazogT25BZGRUcmFjayA9IHt9O1xuICBhZGRPbkFkZFRyYWNrID0gKGZ1bmM6IE9uQWRkVHJhY2tba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25BZGRUcmFjaz4odGhpcy5vbkFkZFRyYWNrLCBmdW5jLCB0YWcpO1xuICB9O1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIGlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgaXNNYWRlQW5zd2VyID0gZmFsc2U7XG4gIG5lZ290aWF0aW5nID0gZmFsc2U7XG5cbiAgb3B0OiBQYXJ0aWFsPG9wdGlvbj47XG5cbiAgY29uc3RydWN0b3Iob3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKCkge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAodGhpcy5vcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZDtcbiAgICBpZiAodGhpcy5vcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmIChldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwoeyB0eXBlOiBcImNhbmRpZGF0ZVwiLCBpY2U6IGV2dC5jYW5kaWRhdGUgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5vcHQudHJpY2tsZSAmJiBwZWVyLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gZSA9PiB7fTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBwcml2YXRlIGhhbmdVcCgpIHtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBtYWtlT2ZmZXIoKSB7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5lZ290aWF0aW5nKSByZXR1cm47XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAoIW9mZmVyKSByZXR1cm47XG4gICAgICBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAodGhpcy5vcHQudHJpY2tsZSAmJiB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsKHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge31cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBhc3luYyBldmVudCA9PiB7XG4gICAgICAgIGlmICghZXZlbnQpIHJldHVybjtcbiAgICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkRhdGEsIHtcbiAgICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjaGFubmVsLmxhYmVsID09PSBcIndlYnJ0Y1wiKSB7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHt9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLm9wdC5zdHJlYW0pIHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSkge1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSkge1xuICAgIGlmICh0aGlzLmlzTWFkZUFuc3dlcikgcmV0dXJuO1xuICAgIHRoaXMuaXNNYWRlQW5zd2VyID0gdHJ1ZTtcblxuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoIWFuc3dlcikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgbG9jYWxEZXNjcmlwdGlvbiA9IHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb247XG4gICAgaWYgKHRoaXMub3B0LnRyaWNrbGUgJiYgbG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zaWduYWwobG9jYWxEZXNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgc2V0U2RwKHNkcDogYW55KSB7XG4gICAgc3dpdGNoIChzZHAudHlwZSkge1xuICAgICAgY2FzZSBcIm9mZmVyXCI6XG4gICAgICAgIHRoaXMubWFrZUFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcbiAgICAgICAgdGhpcy5zZXRBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2FuZGlkYXRlXCI6XG4gICAgICAgIHRoaXMucnRjLmFkZEljZUNhbmRpZGF0ZShuZXcgUlRDSWNlQ2FuZGlkYXRlKHNkcC5pY2UpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCBcImRhdGFjaGFubmVsXCI7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19