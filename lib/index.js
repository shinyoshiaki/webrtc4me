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
  console.log("excuteEvent", {
    ev: ev
  });
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
            urls: ["stun:stun.l.google.com:19302", "stun:stun.webrtc.ecl.ntt.com:3478"]
          }]
        });
      }

      peer.onicecandidate = function (evt) {
        if (!evt.candidate) {
          _this2.signal(peer.localDescription);

          if (_this2.isConnected && _this2.isOffer) {
            _this2.sendSdp("offer", _this2.rtc.localDescription);
          }
        }
      };

      peer.oniceconnectionstatechange = function () {
        console.log(_this2.nodeId, "ICE connection Status has changed to " + peer.iceConnectionState);

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
            console.log("webrtc4me disconnected");

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
      } catch (dce) {
        console.log("dc established error: " + dce.message);
      }
    }
  }, {
    key: "sendSdp",
    value: function sendSdp(type, local) {
      var sdp = local;

      if (!local.type) {
        sdp = new _wrtc.RTCSessionDescription({
          type: type,
          sdp: local.sdp
        });
      }

      this.send(JSON.stringify({
        sdp: sdp
      }), "webrtc");
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

                    if (channel.label === "webrtc") {// const obj = JSON.parse(event.data);
                      // console.log({ obj });
                      // if (!obj || !obj.sdp) return;
                      // if (obj.sdp.type === "offer") {
                      //   console.log("debug offer", { obj });
                      //   await this.rtc.setRemoteDescription(obj.sdp);
                      //   const create = await this.rtc.createAnswer().catch(console.warn);
                      //   if (!create) return;
                      //   await this.rtc.setLocalDescription(create).catch(console.warn);
                      //   this.sendSdp("answer", this.rtc.localDescription);
                      // } else {
                      //   console.log("debug answer", { obj });
                      //   await this.rtc.setRemoteDescription(obj.sdp);
                      // }
                    }

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
      } catch (error) {
        console.log(error);
      }

      channel.onerror = function (err) {
        console.log("Datachannel Error: " + err);
      };

      channel.onclose = function () {
        console.log("DataChannel is closed");

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
                this.rtc = this.prepareNewConnection();
                this.addStream();
                console.log({
                  sdp: sdp
                });
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
    key: "send",
    value: function send(data, label) {
      label = label || "datachannel";

      if (!Object.keys(this.dataChannels).includes(label)) {
        this.createDatachannel(label);
      }

      try {
        this.dataChannels[label].send(data);
      } catch (error) {
        console.log("dc send error", error);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsIl90YWciLCJ0YWciLCJnZW4iLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJpbmNsdWRlcyIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicGVlciIsImRpc2FibGVfc3R1biIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbmljZWNhbmRpZGF0ZSIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJpc09mZmVyIiwic2VuZFNkcCIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwiaGFuZ1VwIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnNpZ25hbGluZ3N0YXRlY2hhbmdlIiwiZSIsIm5lZ290aWF0aW5nIiwic2lnbmFsaW5nU3RhdGUiLCJvbnRyYWNrIiwic3RyZWFtIiwic3RyZWFtcyIsImFkZFN0cmVhbSIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJ3YXJuIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJ0eXBlIiwibG9jYWwiLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImdldFRyYWNrcyIsInRyYWNrIiwiYWRkVHJhY2siLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsImNyZWF0ZUFuc3dlciIsImFuc3dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQXlCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkI7QUFBRUgsSUFBQUEsRUFBRSxFQUFGQTtBQUFGLEdBQTNCO0FBQ0FJLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxFQUFaLEVBQWdCTSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHUixFQUFFLENBQUNPLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSU4sQ0FBSixFQUFPO0FBQ0xPLE1BQUFBLElBQUksQ0FBQ1AsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xPLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FB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XG5pbXBvcnQgeyBSVENQZWVyQ29ubmVjdGlvbiwgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSBcIndydGNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBtZXNzYWdlIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgZGF0YTogYW55O1xuICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIG9wdGlvbiB7XG4gIGRpc2FibGVfc3R1bjogYm9vbGVhbjtcbiAgc3RyZWFtOiBNZWRpYVN0cmVhbTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT25EYXRhIHtcbiAgW2tleTogc3RyaW5nXTogKHJhdzogbWVzc2FnZSkgPT4gdm9pZDtcbn1cbmludGVyZmFjZSBPbkFkZFRyYWNrIHtcbiAgW2tleTogc3RyaW5nXTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG59XG5cbnR5cGUgRXZlbnQgPSBPbkRhdGEgfCBPbkFkZFRyYWNrO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhjdXRlRXZlbnQoZXY6IEV2ZW50LCB2PzogYW55KSB7XG4gIGNvbnNvbGUubG9nKFwiZXhjdXRlRXZlbnRcIiwgeyBldiB9KTtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBmdW5jOiBhbnkgPSBldltrZXldO1xuICAgIGlmICh2KSB7XG4gICAgICBmdW5jKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50PFQgZXh0ZW5kcyBFdmVudD4oXG4gIGV2ZW50OiBULFxuICBmdW5jOiBUW2tleW9mIFRdLFxuICBfdGFnPzogc3RyaW5nXG4pIHtcbiAgY29uc3QgdGFnID1cbiAgICBfdGFnIHx8XG4gICAgKCgpID0+IHtcbiAgICAgIGxldCBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKGdlbikpIHtcbiAgICAgICAgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdlbjtcbiAgICB9KSgpO1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKHRhZykpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiaW5jbHVkZSB0YWdcIik7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRbdGFnXSA9IGZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IGFueSkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IE9uRGF0YSA9IHt9O1xuICBhZGRPbkRhdGEgPSAoZnVuYzogT25EYXRhW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uRGF0YT4odGhpcy5vbkRhdGEsIGZ1bmMsIHRhZyk7XG4gIH07XG4gIHByaXZhdGUgb25BZGRUcmFjazogT25BZGRUcmFjayA9IHt9O1xuICBhZGRPbkFkZFRyYWNrID0gKGZ1bmM6IE9uQWRkVHJhY2tba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25BZGRUcmFjaz4odGhpcy5vbkFkZFRyYWNrLCBmdW5jLCB0YWcpO1xuICB9O1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBpc0Rpc2Nvbm5lY3RlZDogYm9vbGVhbjtcblxuICBvcHQ6IFBhcnRpYWw8b3B0aW9uPjtcblxuICBpc09mZmVyID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTmV3Q29ubmVjdGlvbigpIHtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKHRoaXMub3B0Lm5vZGVJZCkgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQ7XG4gICAgaWYgKHRoaXMub3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxzOiBbXG4gICAgICAgICAgICAgIFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiLFxuICAgICAgICAgICAgICBcInN0dW46c3R1bi53ZWJydGMuZWNsLm50dC5jb206MzQ3OFwiXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCAmJiB0aGlzLmlzT2ZmZXIpIHtcbiAgICAgICAgICB0aGlzLnNlbmRTZHAoXCJvZmZlclwiLCB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIndlYnJ0YzRtZSBkaXNjb25uZWN0ZWRcIik7XG4gICAgICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBwZWVyLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCI7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBoYW5nVXAoKSB7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgbWFrZU9mZmVyKCkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG5cbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZHVwbGlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBlc3RhYmxpc2hlZCBlcnJvcjogXCIgKyBkY2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgc2VuZFNkcCh0eXBlOiBzdHJpbmcsIGxvY2FsOiBhbnkpIHtcbiAgICBsZXQgc2RwID0gbG9jYWw7XG4gICAgaWYgKCFsb2NhbC50eXBlKSB7XG4gICAgICBzZHAgPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHsgdHlwZTogdHlwZSBhcyBhbnksIHNkcDogbG9jYWwuc2RwIH0pO1xuICAgIH1cbiAgICB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzZHAgfSksIFwid2VicnRjXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwid2VicnRjXCIpIHtcbiAgICAgICAgICAvLyBjb25zdCBvYmogPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHsgb2JqIH0pO1xuICAgICAgICAgIC8vIGlmICghb2JqIHx8ICFvYmouc2RwKSByZXR1cm47XG4gICAgICAgICAgLy8gaWYgKG9iai5zZHAudHlwZSA9PT0gXCJvZmZlclwiKSB7XG4gICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImRlYnVnIG9mZmVyXCIsIHsgb2JqIH0pO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24ob2JqLnNkcCk7XG4gICAgICAgICAgLy8gICBjb25zdCBjcmVhdGUgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLndhcm4pO1xuICAgICAgICAgIC8vICAgaWYgKCFjcmVhdGUpIHJldHVybjtcbiAgICAgICAgICAvLyAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oY3JlYXRlKS5jYXRjaChjb25zb2xlLndhcm4pO1xuICAgICAgICAgIC8vICAgdGhpcy5zZW5kU2RwKFwiYW5zd2VyXCIsIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImRlYnVnIGFuc3dlclwiLCB7IG9iaiB9KTtcbiAgICAgICAgICAvLyAgIGF3YWl0IHRoaXMucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG9iai5zZHApO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhY2hhbm5lbCBFcnJvcjogXCIgKyBlcnIpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhQ2hhbm5lbCBpcyBjbG9zZWRcIik7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH07XG4gIH1cblxuICBhZGRTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMub3B0LnN0cmVhbSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy5vcHQuc3RyZWFtO1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuICBhc3luYyBzZXRBbnN3ZXIoc2RwOiBhbnksIG5vZGVJZD86IHN0cmluZykge1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkIHx8IHRoaXMubm9kZUlkO1xuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG4gICAgY29uc29sZS5sb2coeyBzZHAgfSk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19