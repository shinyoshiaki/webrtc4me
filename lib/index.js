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

    _defineProperty(this, "opt", void 0);

    _defineProperty(this, "negotiating", false);

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
        if (!evt.candidate) {
          if (peer.localDescription && !_this2.opt.trickle) {
            _this2.signal(peer.localDescription);
          }
        } else {
          if (_this2.opt.trickle) {
            _this2.signal(evt.candidate);
          }
        }
      };

      peer.oniceconnectionstatechange = function () {
        switch (peer.iceConnectionState) {
          case "closed":
            break;

          case "failed":
            break;

          case "connected":
            break;

          case "completed":
            break;

          case "disconnected":
            _this2.hangUp();

            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this2.dataChannels[dataChannel.label] = dataChannel;

        _this2.dataChannelEvents(dataChannel);
      };

      peer.onsignalingstatechange = function (e) {
        _this2.negotiating = peer.signalingState != "stable";
      };

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
                  _context.next = 3;
                  break;
                }

                console.warn("dupli");
                return _context.abrupt("return");

              case 3:
                _this3.negotiating = true;
                _context.next = 6;
                return _this3.rtc.createOffer().catch(console.log);

              case 6:
                offer = _context.sent;

                if (!offer) {
                  _context.next = 10;
                  break;
                }

                _context.next = 10;
                return _this3.rtc.setLocalDescription(offer).catch(console.log);

              case 10:
                if (_this3.rtc.localDescription && _this3.opt.trickle) {
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
      regeneratorRuntime.mark(function _callee3(sdp, nodeId) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 2:
                this.nodeId = nodeId || this.nodeId;

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setAnswer(_x2, _x3) {
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
        var answer;
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

                if (!answer) {
                  _context4.next = 11;
                  break;
                }

                _context4.next = 11;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 11:
                if (this.opt.trickle && this.rtc.localDescription) {
                  this.signal(this.rtc.localDescription);
                }

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function makeAnswer(_x4) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiY29uc29sZSIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsImRhdGFDaGFubmVscyIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJhZGRTdHJlYW0iLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsIm9uaWNlY2FuZGlkYXRlIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsInRyaWNrbGUiLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsImhhbmdVcCIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJuZWdvdGlhdGluZyIsInNpZ25hbGluZ1N0YXRlIiwib250cmFjayIsInN0cmVhbSIsInN0cmVhbXMiLCJpc0Rpc2Nvbm5lY3RlZCIsImlzQ29ubmVjdGVkIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsIndhcm4iLCJjcmVhdGVPZmZlciIsImNhdGNoIiwibG9nIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImdldFRyYWNrcyIsInRyYWNrIiwiYWRkVHJhY2siLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsImlzTWFkZUFuc3dlciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsInR5cGUiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQTBCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxFQUFaLEVBQWdCSSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHTixFQUFFLENBQUNLLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSUosQ0FBSixFQUFPO0FBQ0xLLE1BQUFBLElBQUksQ0FBQ0wsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xLLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FBT0gsR0FBUDtBQUNELEdBTkQsRUFGRjs7QUFTQSxNQUFJVCxNQUFNLENBQUNDLElBQVAsQ0FBWUss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QTs7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLQyxHQUFMLENBQVMyRCxlQUFULENBQXlCNUQsR0FBekI7QUFDQTtBQVRKO0FBV0Q7Ozt5QkFFSTZDLEksRUFBV3pCLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUttQixZQUFqQixFQUErQlAsUUFBL0IsQ0FBd0NnQyxLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUttQixpQkFBTCxDQUF1Qm5CLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt6QixZQUFMLENBQWtCeUIsS0FBbEIsRUFBeUJ5QyxJQUF6QixDQUE4QmhCLElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU92RCxLQUFQLEVBQWM7QUFDZCxhQUFLMEIsTUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVXBCLE0sRUFBZ0I7QUFDekIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBub2RlSWQ6IHN0cmluZztcbiAgdHJpY2tsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPbkRhdGEge1xuICBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkO1xufVxuaW50ZXJmYWNlIE9uQWRkVHJhY2sge1xuICBba2V5OiBzdHJpbmddOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbn1cblxudHlwZSBFdmVudCA9IE9uRGF0YSB8IE9uQWRkVHJhY2s7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBmdW5jOiBhbnkgPSBldltrZXldO1xuICAgIGlmICh2KSB7XG4gICAgICBmdW5jKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50PFQgZXh0ZW5kcyBFdmVudD4oXG4gIGV2ZW50OiBULFxuICBmdW5jOiBUW2tleW9mIFRdLFxuICBfdGFnPzogc3RyaW5nXG4pIHtcbiAgY29uc3QgdGFnID1cbiAgICBfdGFnIHx8XG4gICAgKCgpID0+IHtcbiAgICAgIGxldCBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKGdlbikpIHtcbiAgICAgICAgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdlbjtcbiAgICB9KSgpO1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKHRhZykpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiaW5jbHVkZSB0YWdcIik7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRbdGFnXSA9IGZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IG9iamVjdCkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IE9uRGF0YSA9IHt9O1xuICBhZGRPbkRhdGEgPSAoZnVuYzogT25EYXRhW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uRGF0YT4odGhpcy5vbkRhdGEsIGZ1bmMsIHRhZyk7XG4gIH07XG4gIHByaXZhdGUgb25BZGRUcmFjazogT25BZGRUcmFjayA9IHt9O1xuICBhZGRPbkFkZFRyYWNrID0gKGZ1bmM6IE9uQWRkVHJhY2tba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25BZGRUcmFjaz4odGhpcy5vbkFkZFRyYWNrLCBmdW5jLCB0YWcpO1xuICB9O1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIGlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgaXNNYWRlQW5zd2VyID0gZmFsc2U7XG5cbiAgb3B0OiBQYXJ0aWFsPG9wdGlvbj47XG5cbiAgY29uc3RydWN0b3Iob3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKCkge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAodGhpcy5vcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZDtcbiAgICBpZiAodGhpcy5vcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICBpZiAocGVlci5sb2NhbERlc2NyaXB0aW9uICYmICF0aGlzLm9wdC50cmlja2xlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChldnQuY2FuZGlkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub25zaWduYWxpbmdzdGF0ZWNoYW5nZSA9IGUgPT4ge1xuICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IHBlZXIuc2lnbmFsaW5nU3RhdGUgIT0gXCJzdGFibGVcIjtcbiAgICB9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCBzdHJlYW0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIGhhbmdVcCgpIHtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBuZWdvdGlhdGluZyA9IGZhbHNlO1xuICBtYWtlT2ZmZXIoKSB7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5lZ290aWF0aW5nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcImR1cGxpXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uICYmIHRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwid2VicnRjXCIpIHtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge307XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9O1xuICB9XG5cbiAgYWRkU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLm9wdC5zdHJlYW0pIHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIoc2RwOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc01hZGVBbnN3ZXIpIHJldHVybjtcbiAgICB0aGlzLmlzTWFkZUFuc3dlciA9IHRydWU7XG5cbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAodGhpcy5vcHQudHJpY2tsZSAmJiB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNpZ25hbCh0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzZXRTZHAoc2RwOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHNkcC50eXBlKSB7XG4gICAgICBjYXNlIFwib2ZmZXJcIjpcbiAgICAgICAgdGhpcy5tYWtlQW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFuc3dlclwiOlxuICAgICAgICB0aGlzLnNldEFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgdGhpcy5ydGMuYWRkSWNlQ2FuZGlkYXRlKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==