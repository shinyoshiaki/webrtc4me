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

    _defineProperty(this, "isConnected", void 0);

    _defineProperty(this, "isDisconnected", void 0);

    _defineProperty(this, "opt", void 0);

    _defineProperty(this, "isOffer", false);

    _defineProperty(this, "isMadeAnswer", false);

    _defineProperty(this, "negotiating", false);

    this.opt = opt;
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};
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

      this.rtc = this.prepareNewConnection();
      this.addStream();
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
                this.rtc = this.prepareNewConnection();
                this.addStream();
                _context4.next = 7;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 7:
                _context4.next = 9;
                return this.rtc.createAnswer().catch(console.log);

              case 9:
                answer = _context4.sent;

                if (!answer) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 13;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 13:
                if (this.opt.trickle && this.rtc.localDescription) {
                  this.signal(this.rtc.localDescription);
                }

              case 14:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiY29uc29sZSIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicGVlciIsImRpc2FibGVfc3R1biIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbmljZWNhbmRpZGF0ZSIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJ0cmlja2xlIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJoYW5nVXAiLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UiLCJlIiwibmVnb3RpYXRpbmciLCJzaWduYWxpbmdTdGF0ZSIsIm9udHJhY2siLCJzdHJlYW0iLCJzdHJlYW1zIiwiYWRkU3RyZWFtIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsIndhcm4iLCJjcmVhdGVPZmZlciIsImNhdGNoIiwibG9nIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImdldFRyYWNrcyIsInRyYWNrIiwiYWRkVHJhY2siLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsImlzTWFkZUFuc3dlciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsInR5cGUiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQThCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxFQUFaLEVBQWdCSSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHTixFQUFFLENBQUNLLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSUosQ0FBSixFQUFPO0FBQ0xLLE1BQUFBLElBQUksQ0FBQ0wsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xLLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FBT0gsR0FBUDtBQUNELEdBTkQsRUFGRjs7QUFTQSxNQUFJVCxNQUFNLENBQUNDLElBQVAsQ0FBWUss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LEVBQVU7QUFDZixjQUFRQSxHQUFHLENBQUNxRCxJQUFaO0FBQ0UsYUFBSyxPQUFMO0FBQ0UsZUFBS0MsVUFBTCxDQUFnQnRELEdBQWhCO0FBQ0E7O0FBQ0YsYUFBSyxRQUFMO0FBQ0UsZUFBS3VELFNBQUwsQ0FBZXZELEdBQWY7QUFDQTs7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLVCxHQUFMLENBQVNpRSxlQUFULENBQXlCeEQsR0FBekI7QUFDQTtBQVRKO0FBV0Q7Ozt5QkFFSXlDLEksRUFBV3hCLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzlDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtxQixZQUFqQixFQUErQlQsUUFBL0IsQ0FBd0NpQyxLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtrQixpQkFBTCxDQUF1QmxCLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt4QixZQUFMLENBQWtCd0IsS0FBbEIsRUFBeUJ3QyxJQUF6QixDQUE4QmhCLElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU92RCxLQUFQLEVBQWM7QUFDZCxhQUFLMkIsTUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVWpCLE0sRUFBZ0I7QUFDekIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmltcG9ydCB7XG4gIFJUQ1BlZXJDb25uZWN0aW9uLFxuICBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gIFJUQ0ljZUNhbmRpZGF0ZVxufSBmcm9tIFwid3J0Y1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBub2RlSWQ6IHN0cmluZztcbiAgdHJpY2tsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPbkRhdGEge1xuICBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkO1xufVxuaW50ZXJmYWNlIE9uQWRkVHJhY2sge1xuICBba2V5OiBzdHJpbmddOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbn1cblxudHlwZSBFdmVudCA9IE9uRGF0YSB8IE9uQWRkVHJhY2s7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBmdW5jOiBhbnkgPSBldltrZXldO1xuICAgIGlmICh2KSB7XG4gICAgICBmdW5jKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50PFQgZXh0ZW5kcyBFdmVudD4oXG4gIGV2ZW50OiBULFxuICBmdW5jOiBUW2tleW9mIFRdLFxuICBfdGFnPzogc3RyaW5nXG4pIHtcbiAgY29uc3QgdGFnID1cbiAgICBfdGFnIHx8XG4gICAgKCgpID0+IHtcbiAgICAgIGxldCBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKGdlbikpIHtcbiAgICAgICAgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdlbjtcbiAgICB9KSgpO1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKHRhZykpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiaW5jbHVkZSB0YWdcIik7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRbdGFnXSA9IGZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IG9iamVjdCkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IE9uRGF0YSA9IHt9O1xuICBhZGRPbkRhdGEgPSAoZnVuYzogT25EYXRhW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uRGF0YT4odGhpcy5vbkRhdGEsIGZ1bmMsIHRhZyk7XG4gIH07XG4gIHByaXZhdGUgb25BZGRUcmFjazogT25BZGRUcmFjayA9IHt9O1xuICBhZGRPbkFkZFRyYWNrID0gKGZ1bmM6IE9uQWRkVHJhY2tba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25BZGRUcmFjaz4odGhpcy5vbkFkZFRyYWNrLCBmdW5jLCB0YWcpO1xuICB9O1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBpc0Rpc2Nvbm5lY3RlZDogYm9vbGVhbjtcblxuICBvcHQ6IFBhcnRpYWw8b3B0aW9uPjtcblxuICBpc09mZmVyID0gZmFsc2U7XG4gIGlzTWFkZUFuc3dlciA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9wdDogUGFydGlhbDxvcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9wdCA9IG9wdDtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmICh0aGlzLm9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gdGhpcy5vcHQubm9kZUlkO1xuICAgIGlmICh0aGlzLm9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmIChwZWVyLmxvY2FsRGVzY3JpcHRpb24gJiYgIXRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5vcHQudHJpY2tsZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKGV2dC5jYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gZSA9PiB7XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gcGVlci5zaWduYWxpbmdTdGF0ZSAhPSBcInN0YWJsZVwiO1xuICAgIH07XG5cbiAgICBwZWVyLm9udHJhY2sgPSBldnQgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gZXZ0LnN0cmVhbXNbMF07XG4gICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHN0cmVhbSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgaGFuZ1VwKCkge1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIG5lZ290aWF0aW5nID0gZmFsc2U7XG4gIG1ha2VPZmZlcigpIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmFkZFN0cmVhbSgpO1xuXG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5lZ290aWF0aW5nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcImR1cGxpXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uICYmIHRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwid2VicnRjXCIpIHtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge307XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9O1xuICB9XG5cbiAgYWRkU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLm9wdC5zdHJlYW0pIHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIoc2RwOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc01hZGVBbnN3ZXIpIHJldHVybjtcbiAgICB0aGlzLmlzTWFkZUFuc3dlciA9IHRydWU7XG5cbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmFkZFN0cmVhbSgpO1xuXG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKHRoaXMub3B0LnRyaWNrbGUgJiYgdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgc2V0U2RwKHNkcDogYW55KSB7XG4gICAgc3dpdGNoIChzZHAudHlwZSkge1xuICAgICAgY2FzZSBcIm9mZmVyXCI6XG4gICAgICAgIHRoaXMubWFrZUFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcbiAgICAgICAgdGhpcy5zZXRBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2FuZGlkYXRlXCI6XG4gICAgICAgIHRoaXMucnRjLmFkZEljZUNhbmRpZGF0ZShzZHApO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=