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
  function WebRTC(opt) {
    var _this = this;

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

    _defineProperty(this, "onicecandidate", void 0);

    _defineProperty(this, "stream", void 0);

    _defineProperty(this, "isOffer", false);

    opt = opt || {};
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;
    this.nodeId = opt.nodeId || "peer";
    this.stream = opt.stream;

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection(opt) {
      var _this2 = this;

      var peer;
      if (!opt) opt = {};
      if (opt.nodeId) this.nodeId = opt.nodeId;

      if (opt.disable_stun) {
        console.log("disable stun");
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
          if (!_this2.onicecandidate) {
            _this2.signal(peer.localDescription);

            _this2.onicecandidate = true;
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
            _this2.isDisconnected = true;
            _this2.isConnected = false; // this.disconnect();

            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this2.dataChannels[dataChannel.label] = dataChannel;

        _this2.dataChannelEvents(dataChannel);
      };

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];
        excuteEvent(_this2.onAddTrack, stream);

        stream.onaddtrack = function (track) {
          excuteEvent(_this2.onAddTrack, track);
        };
      };

      return peer;
    }
  }, {
    key: "makeOffer",
    value: function makeOffer(opt) {
      var _this3 = this;

      this.rtc = this.prepareNewConnection(opt);
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
                _context.next = 2;
                return _this3.rtc.createOffer().catch(console.log);

              case 2:
                offer = _context.sent;

                if (!offer) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return _this3.rtc.setLocalDescription(offer).catch(console.log);

              case 6:
                if (_this3.isConnected) {
                  _this3.send(JSON.stringify({
                    sdp: _this3.rtc.localDescription
                  }), "webrtc");
                }

              case 7:
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
    key: "dataChannelEvents",
    value: function dataChannelEvents(channel) {
      var _this4 = this;

      channel.onopen = function () {
        if (!_this4.isConnected) _this4.connect();
        _this4.isConnected = true;
        _this4.onicecandidate = false;
      };

      channel.onmessage =
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(event) {
          var obj, sdp, _sdp;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  excuteEvent(_this4.onData, {
                    label: channel.label,
                    data: event.data,
                    nodeId: _this4.nodeId
                  });

                  if (!(channel.label === "webrtc")) {
                    _context2.next = 19;
                    break;
                  }

                  obj = JSON.parse(event.data);

                  if (!(obj.sdp.type === "offer")) {
                    _context2.next = 15;
                    break;
                  }

                  console.log("debug offer");
                  _context2.next = 7;
                  return _this4.rtc.setRemoteDescription(obj.sdp);

                case 7:
                  _context2.next = 9;
                  return _this4.rtc.createAnswer();

                case 9:
                  sdp = _context2.sent;
                  _context2.next = 12;
                  return _this4.rtc.setLocalDescription(sdp);

                case 12:
                  _this4.send(JSON.stringify({
                    sdp: _this4.rtc.localDescription
                  }), "webrtc");

                  _context2.next = 19;
                  break;

                case 15:
                  console.log("debug answer");
                  _sdp = new _wrtc.RTCSessionDescription({
                    type: "answer",
                    sdp: obj.sdp
                  });
                  _context2.next = 19;
                  return _this4.rtc.setRemoteDescription(_sdp);

                case 19:
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

      channel.onerror = function (err) {
        console.log("Datachannel Error: " + err);
      };

      channel.onclose = function () {
        console.log("DataChannel is closed");
        _this4.isDisconnected = true;

        _this4.disconnect();
      };
    }
  }, {
    key: "setAnswer",
    value: function setAnswer(sdp, nodeId) {
      this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);
      this.nodeId = nodeId || this.nodeId;
    }
  }, {
    key: "makeAnswer",
    value: function () {
      var _makeAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(sdp, opt) {
        var answer;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.rtc = this.prepareNewConnection(opt);
                _context3.next = 3;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 3:
                _context3.next = 5;
                return this.rtc.createAnswer().catch(console.log);

              case 5:
                answer = _context3.sent;

                if (!answer) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 9;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function makeAnswer(_x2, _x3) {
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
        this.isDisconnected = true;
        this.disconnect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsIl90YWciLCJ0YWciLCJnZW4iLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJpbmNsdWRlcyIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwic3RyZWFtIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib250cmFjayIsInN0cmVhbXMiLCJvbmFkZHRyYWNrIiwidHJhY2siLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJkYXRhIiwib2JqIiwicGFyc2UiLCJ0eXBlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJjcmVhdGVBbnN3ZXIiLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImFuc3dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBREFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQWtCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkI7QUFBRUgsSUFBQUEsRUFBRSxFQUFGQTtBQUFGLEdBQTNCO0FBQ0FJLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxFQUFaLEVBQWdCTSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHUixFQUFFLENBQUNPLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSU4sQ0FBSixFQUFPO0FBQ0xPLE1BQUFBLElBQUksQ0FBQ1AsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xPLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FBT0gsR0FBUDtBQUNELEdBTkQsRUFGRjs7QUFTQSxNQUFJVCxNQUFNLENBQUNDLElBQVAsQ0FBWUssS0FBWixFQUFtQk8sUUFBbkIsQ0FBNEJMLEdBQTVCLENBQUosRUFBc0M7QUFD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RUFBVWQsRzs7Ozs7O0FBQ3pCLHFCQUFLRyxHQUFMLEdBQVcsS0FBS0Msb0JBQUwsQ0FBMEJKLEdBQTFCLENBQVg7O3VCQUNNLEtBQUtHLEdBQUwsQ0FDSG1ELG9CQURHLENBQ2tCLElBQUlFLDJCQUFKLENBQTBCMUMsR0FBMUIsQ0FEbEIsRUFFSHNCLEtBRkcsQ0FFR3RELE9BQU8sQ0FBQ0MsR0FGWCxDOzs7O3VCQUdlLEtBQUtvQixHQUFMLENBQVNvRCxZQUFULEdBQXdCbkIsS0FBeEIsQ0FBOEJ0RCxPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFmNkUsZ0JBQUFBLE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS3pELEdBQUwsQ0FBU21DLG1CQUFULENBQTZCc0IsTUFBN0IsRUFBcUN4QixLQUFyQyxDQUEyQ3RELE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUdmbUUsSSxFQUFXdEIsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDNUMsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS29CLFlBQWpCLEVBQStCUixRQUEvQixDQUF3QytCLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS2UsaUJBQUwsQ0FBdUJmLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt2QixZQUFMLENBQWtCdUIsS0FBbEIsRUFBeUJXLElBQXpCLENBQThCVyxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPcEQsS0FBUCxFQUFjO0FBQ2RoQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCZSxLQUE3QjtBQUNBLGFBQUtTLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxhQUFLSyxVQUFMO0FBQ0Q7QUFDRjs7OytCQUVVSCxNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5pbXBvcnQgeyBtZXNzYWdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW4/OiBib29sZWFuO1xuICBub2RlSWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT25EYXRhIHtcbiAgW2tleTogc3RyaW5nXTogKHJhdzogbWVzc2FnZSkgPT4gdm9pZDtcbn1cbmludGVyZmFjZSBPbkFkZFRyYWNrIHtcbiAgW2tleTogc3RyaW5nXTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG59XG5cbnR5cGUgRXZlbnQgPSBPbkRhdGEgfCBPbkFkZFRyYWNrO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhjdXRlRXZlbnQoZXY6IEV2ZW50LCB2PzogYW55KSB7XG4gIGNvbnNvbGUubG9nKFwiZXhjdXRlRXZlbnRcIiwgeyBldiB9KTtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBmdW5jOiBhbnkgPSBldltrZXldO1xuICAgIGlmICh2KSB7XG4gICAgICBmdW5jKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50PFQgZXh0ZW5kcyBFdmVudD4oXG4gIGV2ZW50OiBULFxuICBmdW5jOiBUW2tleW9mIFRdLFxuICBfdGFnPzogc3RyaW5nXG4pIHtcbiAgY29uc3QgdGFnID1cbiAgICBfdGFnIHx8XG4gICAgKCgpID0+IHtcbiAgICAgIGxldCBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKGdlbikpIHtcbiAgICAgICAgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdlbjtcbiAgICB9KSgpO1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnQpLmluY2x1ZGVzKHRhZykpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiaW5jbHVkZSB0YWdcIik7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRbdGFnXSA9IGZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IGFueSkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IE9uRGF0YSA9IHt9O1xuICBhZGRPbkRhdGEgPSAoZnVuYzogT25EYXRhW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uRGF0YT4odGhpcy5vbkRhdGEsIGZ1bmMsIHRhZyk7XG4gIH07XG4gIHByaXZhdGUgb25BZGRUcmFjazogT25BZGRUcmFjayA9IHt9O1xuICBhZGRPbkFkZFRyYWNrID0gKGZ1bmM6IE9uQWRkVHJhY2tba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25BZGRUcmFjaz4odGhpcy5vbkFkZFRyYWNrLCBmdW5jLCB0YWcpO1xuICB9O1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBpc0Rpc2Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgb25pY2VjYW5kaWRhdGU6IGJvb2xlYW47XG4gIHN0cmVhbT86IE1lZGlhU3RyZWFtO1xuXG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgY29uc3RydWN0b3Iob3B0PzogeyBub2RlSWQ/OiBzdHJpbmc7IHN0cmVhbT86IE1lZGlhU3RyZWFtIH0pIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IG9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG4gICAgdGhpcy5zdHJlYW0gPSBvcHQuc3RyZWFtO1xuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQ/OiBvcHRpb24pIHtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKCFvcHQpIG9wdCA9IHt9O1xuICAgIGlmIChvcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IG9wdC5ub2RlSWQ7XG4gICAgaWYgKG9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGlzYWJsZSBzdHVuXCIpO1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxzOiBbXG4gICAgICAgICAgICAgIFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiLFxuICAgICAgICAgICAgICBcInN0dW46c3R1bi53ZWJydGMuZWNsLm50dC5jb206MzQ3OFwiXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICBpZiAoIXRoaXMub25pY2VjYW5kaWRhdGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgdGhpcy5ub2RlSWQsXG4gICAgICAgIFwiSUNFIGNvbm5lY3Rpb24gU3RhdHVzIGhhcyBjaGFuZ2VkIHRvIFwiICsgcGVlci5pY2VDb25uZWN0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIGNvbnNvbGUubG9nKFwid2VicnRjNG1lIGRpc2Nvbm5lY3RlZFwiKTtcbiAgICAgICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgLy8gdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCBzdHJlYW0pO1xuICAgICAgc3RyZWFtLm9uYWRkdHJhY2sgPSB0cmFjayA9PiB7XG4gICAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgdHJhY2spO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0Pzogb3B0aW9uKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VuZChKU09OLnN0cmluZ2lmeSh7IHNkcDogdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbiB9KSwgXCJ3ZWJydGNcIik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHRoaXMuY29ubmVjdCgpO1xuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICAgIGlmIChjaGFubmVsLmxhYmVsID09PSBcIndlYnJ0Y1wiKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgIGlmIChvYmouc2RwLnR5cGUgPT09IFwib2ZmZXJcIikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVidWcgb2ZmZXJcIik7XG4gICAgICAgICAgYXdhaXQgdGhpcy5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24ob2JqLnNkcCk7XG4gICAgICAgICAgY29uc3Qgc2RwID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihzZHApO1xuICAgICAgICAgIHRoaXMuc2VuZChcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgc2RwOiB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uIH0pLFxuICAgICAgICAgICAgXCJ3ZWJydGNcIlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJkZWJ1ZyBhbnN3ZXJcIik7XG4gICAgICAgICAgY29uc3Qgc2RwID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbih7XG4gICAgICAgICAgICB0eXBlOiBcImFuc3dlclwiLFxuICAgICAgICAgICAgc2RwOiBvYmouc2RwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YWNoYW5uZWwgRXJyb3I6IFwiICsgZXJyKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YUNoYW5uZWwgaXMgY2xvc2VkXCIpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0QW5zd2VyKHNkcDogYW55LCBub2RlSWQ/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55LCBvcHQ/OiBvcHRpb24pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19