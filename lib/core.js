"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wrtc = require("wrtc");

var _event = _interopRequireDefault(require("./utill/event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

var WebRTC =
/*#__PURE__*/
function () {
  function WebRTC() {
    var _this = this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebRTC);

    this.opt = opt;

    _defineProperty(this, "rtc", void 0);

    _defineProperty(this, "onSignal", new _event.default());

    _defineProperty(this, "onConnect", new _event.default());

    _defineProperty(this, "onDisconnect", new _event.default());

    _defineProperty(this, "onData", new _event.default());

    _defineProperty(this, "onAddTrack", new _event.default());

    _defineProperty(this, "dataChannels", void 0);

    _defineProperty(this, "nodeId", void 0);

    _defineProperty(this, "isConnected", false);

    _defineProperty(this, "isDisconnected", false);

    _defineProperty(this, "isOffer", false);

    _defineProperty(this, "remoteStream", void 0);

    _defineProperty(this, "timeoutPing", void 0);

    _defineProperty(this, "negotiating", false);

    var nodeId = opt.nodeId,
        stream = opt.stream,
        track = opt.track;
    this.dataChannels = {};
    this.nodeId = nodeId || "peer";
    this.rtc = this.prepareNewConnection();

    if (stream) {
      stream.getTracks().forEach(function (track) {
        return _this.rtc.addTrack(track, stream);
      });
    } else if (track) {
      this.rtc.addTrack(track);
    }
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection() {
      var _this2 = this;

      var _this$opt = this.opt,
          disable_stun = _this$opt.disable_stun,
          trickle = _this$opt.trickle;
      var peer = disable_stun ? new _wrtc.RTCPeerConnection({
        iceServers: []
      }) : new _wrtc.RTCPeerConnection({
        iceServers: [{
          urls: "stun:stun.l.google.com:19302"
        }]
      });

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];

        _this2.onAddTrack.excute(stream);

        _this2.remoteStream = stream;
      };

      peer.oniceconnectionstatechange = function () {
        switch (peer.iceConnectionState) {
          case "failed":
            break;

          case "disconnected":
            try {
              _this2.timeoutPing = setTimeout(function () {
                _this2.hangUp();
              }, 2000);
              console.log("ping");

              _this2.send("ping", "live");
            } catch (error) {
              console.log({
                error: error
              });
            }

            break;

          case "connected":
            if (_this2.timeoutPing) clearTimeout(_this2.timeoutPing);
            break;

          case "closed":
            console.log("closed");
            break;

          case "completed":
            break;
        }
      };

      peer.onicecandidate = function (evt) {
        if (!_this2.isConnected) {
          if (evt.candidate) {
            if (trickle) {
              _this2.onSignal.excute({
                type: "candidate",
                ice: evt.candidate
              });
            }
          } else {
            if (!trickle && peer.localDescription) {
              _this2.onSignal.excute(peer.localDescription);
            }
          }
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

      return peer;
    }
  }, {
    key: "hangUp",
    value: function hangUp() {
      console.log("hangup");
      this.isDisconnected = true;
      this.isConnected = false;
      this.onDisconnect.excute();
    }
  }, {
    key: "makeOffer",
    value: function makeOffer() {
      var _this3 = this;

      this.isOffer = true;
      var trickle = this.opt.trickle;
      this.createDatachannel("datachannel");
      this.rtc.onnegotiationneeded =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var sdp, result, local;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(_this3.negotiating || _this3.rtc.signalingState != "stable")) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this3.negotiating = true;
                _context.next = 5;
                return _this3.rtc.createOffer().catch(console.log);

              case 5:
                sdp = _context.sent;

                if (sdp) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return");

              case 8:
                _context.next = 10;
                return _this3.rtc.setLocalDescription(sdp).catch(function (err) {
                  return JSON.stringify(err) + "err";
                });

              case 10:
                result = _context.sent;

                if (!(typeof result === "string")) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return");

              case 13:
                local = _this3.rtc.localDescription;

                if (trickle && local) {
                  _this3.onSignal.excute(local);
                }

                _this3.negotiation();

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }
  }, {
    key: "negotiation",
    value: function negotiation() {
      var _this4 = this;

      this.rtc.onnegotiationneeded =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var options, sessionDescription, local;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_this4.isConnected) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.prev = 2;

                if (!(_this4.negotiating || _this4.rtc.signalingState != "stable")) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                _this4.negotiating = true;
                options = {};
                _context2.next = 9;
                return _this4.rtc.createOffer(options).catch();

              case 9:
                sessionDescription = _context2.sent;
                _context2.next = 12;
                return _this4.rtc.setLocalDescription(sessionDescription).catch();

              case 12:
                local = _this4.rtc.localDescription;

                if (local) {
                  _this4.send(JSON.stringify(local), "update");
                }

              case 14:
                _context2.prev = 14;
                _this4.negotiating = false;
                return _context2.finish(14);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2,, 14, 17]]);
      }));
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
                if (!this.isOffer) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setAnswer(_x) {
        return _setAnswer.apply(this, arguments);
      }

      return setAnswer;
    }()
  }, {
    key: "makeAnswer",
    value: function () {
      var _makeAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(offer) {
        var trickle, answer, local;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                trickle = this.opt.trickle;
                _context4.next = 3;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(offer)).catch(console.log);

              case 3:
                _context4.next = 5;
                return this.rtc.createAnswer().catch(console.log);

              case 5:
                answer = _context4.sent;

                if (answer) {
                  _context4.next = 9;
                  break;
                }

                console.log("no answer");
                return _context4.abrupt("return");

              case 9:
                _context4.next = 11;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 11:
                local = this.rtc.localDescription;

                if (this.isConnected) {
                  this.send(JSON.stringify(local), "update");
                } else if (trickle && local) {
                  this.onSignal.excute(local);
                }

                this.negotiation();

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function makeAnswer(_x2) {
        return _makeAnswer.apply(this, arguments);
      }

      return makeAnswer;
    }()
  }, {
    key: "setSdp",
    value: function () {
      var _setSdp = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(sdp) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.t0 = sdp.type;
                _context5.next = _context5.t0 === "offer" ? 3 : _context5.t0 === "answer" ? 5 : _context5.t0 === "candidate" ? 7 : 10;
                break;

              case 3:
                this.makeAnswer(sdp);
                return _context5.abrupt("break", 10);

              case 5:
                this.setAnswer(sdp);
                return _context5.abrupt("break", 10);

              case 7:
                _context5.next = 9;
                return this.rtc.addIceCandidate(new _wrtc.RTCIceCandidate(sdp.ice)).catch(console.log);

              case 9:
                return _context5.abrupt("break", 10);

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function setSdp(_x3) {
        return _setSdp.apply(this, arguments);
      }

      return setSdp;
    }()
  }, {
    key: "createDatachannel",
    value: function createDatachannel(label) {
      if (!Object.keys(this.dataChannels).includes(label)) {
        try {
          var dc = this.rtc.createDataChannel(label);
          this.dataChannelEvents(dc);
          this.dataChannels[label] = dc;
        } catch (dce) {}
      }
    }
  }, {
    key: "dataChannelEvents",
    value: function dataChannelEvents(channel) {
      var _this5 = this;

      channel.onopen = function () {
        if (!_this5.isConnected) {
          console.log("connected", _this5.nodeId);
          _this5.isConnected = true;

          _this5.onConnect.excute();
        }
      };

      try {
        channel.onmessage =
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee6(event) {
            var sdp;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (event) {
                      _context6.next = 2;
                      break;
                    }

                    return _context6.abrupt("return");

                  case 2:
                    if (channel.label === "update") {
                      sdp = JSON.parse(event.data);

                      _this5.setSdp(sdp);
                    } else if (channel.label === "live") {
                      if (event.data === "ping") _this5.send("pong", "live");else if (_this5.timeoutPing) clearTimeout(_this5.timeoutPing);
                    } else {
                      _this5.onData.excute({
                        label: channel.label,
                        data: event.data,
                        nodeId: _this5.nodeId
                      });
                    }

                  case 3:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6);
          }));

          return function (_x4) {
            return _ref3.apply(this, arguments);
          };
        }();
      } catch (error) {}

      channel.onerror = function (err) {};

      channel.onclose = function () {};
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
      } catch (error) {}
    }
  }, {
    key: "addTrack",
    value: function addTrack(track, stream) {
      this.rtc.addTrack(track, stream);
    }
  }]);

  return WebRTC;
}();

exports.default = WebRTC;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJFdmVudCIsIm5vZGVJZCIsInN0cmVhbSIsInRyYWNrIiwiZGF0YUNoYW5uZWxzIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJnZXRUcmFja3MiLCJmb3JFYWNoIiwiYWRkVHJhY2siLCJkaXNhYmxlX3N0dW4iLCJ0cmlja2xlIiwicGVlciIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbnRyYWNrIiwiZXZ0Iiwic3RyZWFtcyIsIm9uQWRkVHJhY2siLCJleGN1dGUiLCJyZW1vdGVTdHJlYW0iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsInRpbWVvdXRQaW5nIiwic2V0VGltZW91dCIsImhhbmdVcCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJvbmljZWNhbmRpZGF0ZSIsImlzQ29ubmVjdGVkIiwiY2FuZGlkYXRlIiwib25TaWduYWwiLCJ0eXBlIiwiaWNlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJuZWdvdGlhdGluZyIsInNpZ25hbGluZ1N0YXRlIiwiaXNEaXNjb25uZWN0ZWQiLCJvbkRpc2Nvbm5lY3QiLCJpc09mZmVyIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsInNkcCIsInNldExvY2FsRGVzY3JpcHRpb24iLCJlcnIiLCJKU09OIiwic3RyaW5naWZ5IiwicmVzdWx0IiwibG9jYWwiLCJuZWdvdGlhdGlvbiIsIm9wdGlvbnMiLCJzZXNzaW9uRGVzY3JpcHRpb24iLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsIm9mZmVyIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwibWFrZUFuc3dlciIsInNldEFuc3dlciIsImFkZEljZUNhbmRpZGF0ZSIsIlJUQ0ljZUNhbmRpZGF0ZSIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJvbm9wZW4iLCJvbkNvbm5lY3QiLCJvbm1lc3NhZ2UiLCJldmVudCIsInBhcnNlIiwiZGF0YSIsInNldFNkcCIsIm9uRGF0YSIsIm9uZXJyb3IiLCJvbmNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFQQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0lBdUJxQkMsTTs7O0FBbUJuQixvQkFBOEM7QUFBQTs7QUFBQSxRQUEzQkMsR0FBMkIsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxzQ0FoQm5DLElBQUlDLGNBQUosRUFnQm1DOztBQUFBLHVDQWZsQyxJQUFJQSxjQUFKLEVBZWtDOztBQUFBLDBDQWQvQixJQUFJQSxjQUFKLEVBYytCOztBQUFBLG9DQWJyQyxJQUFJQSxjQUFKLEVBYXFDOztBQUFBLHdDQVpqQyxJQUFJQSxjQUFKLEVBWWlDOztBQUFBOztBQUFBOztBQUFBLHlDQVBoQyxLQU9nQzs7QUFBQSw0Q0FON0IsS0FNNkI7O0FBQUEscUNBTHBDLEtBS29DOztBQUFBOztBQUFBOztBQUFBLHlDQThIaEMsS0E5SGdDOztBQUFBLFFBQ3BDQyxNQURvQyxHQUNWRixHQURVLENBQ3BDRSxNQURvQztBQUFBLFFBQzVCQyxNQUQ0QixHQUNWSCxHQURVLENBQzVCRyxNQUQ0QjtBQUFBLFFBQ3BCQyxLQURvQixHQUNWSixHQURVLENBQ3BCSSxLQURvQjtBQUc1QyxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0gsTUFBTCxHQUFjQSxNQUFNLElBQUksTUFBeEI7QUFFQSxTQUFLSSxHQUFMLEdB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K0QsTUFBTCxDQUFZbkUsTUFBWixDQUFtQjtBQUNqQnNCLHdCQUFBQSxLQUFLLEVBQUVELE9BQU8sQ0FBQ0MsS0FERTtBQUVqQjJDLHdCQUFBQSxJQUFJLEVBQUVGLEtBQUssQ0FBQ0UsSUFGSztBQUdqQnBGLHdCQUFBQSxNQUFNLEVBQUUsTUFBSSxDQUFDQTtBQUhJLHVCQUFuQjtBQUtEOztBQWZpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWlCRCxPQWxCRCxDQWtCRSxPQUFPNkIsS0FBUCxFQUFjLENBQUU7O0FBQ2xCVyxNQUFBQSxPQUFPLENBQUMrQyxPQUFSLEdBQWtCLFVBQUEvQixHQUFHLEVBQUksQ0FBRSxDQUEzQjs7QUFDQWhCLE1BQUFBLE9BQU8sQ0FBQ2dELE9BQVIsR0FBa0IsWUFBTSxDQUFFLENBQTFCO0FBQ0Q7Ozt5QkFFSUosSSxFQUFXM0MsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDZ0MsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS3ZFLFlBQWpCLEVBQStCd0UsUUFBL0IsQ0FBd0NsQyxLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtTLGlCQUFMLENBQXVCVCxLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLdEMsWUFBTCxDQUFrQnNDLEtBQWxCLEVBQXlCYixJQUF6QixDQUE4QndELElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU92RCxLQUFQLEVBQWMsQ0FBRTtBQUNuQjs7OzZCQUVRM0IsSyxFQUF5QkQsTSxFQUFxQjtBQUNyRCxXQUFLRyxHQUFMLENBQVNJLFFBQVQsQ0FBa0JOLEtBQWxCLEVBQXlCRCxNQUF6QjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHtcbiAgUlRDUGVlckNvbm5lY3Rpb24sXG4gIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbixcbiAgUlRDSWNlQ2FuZGlkYXRlXG59IGZyb20gXCJ3cnRjXCI7XG5cbmltcG9ydCBFdmVudCBmcm9tIFwiLi91dGlsbC9ldmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICB0cmFjazogTWVkaWFTdHJlYW1UcmFjaztcbiAgbm9kZUlkOiBzdHJpbmc7XG4gIHRyaWNrbGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgb25TaWduYWwgPSBuZXcgRXZlbnQ8YW55PigpO1xuICBvbkNvbm5lY3QgPSBuZXcgRXZlbnQoKTtcbiAgb25EaXNjb25uZWN0ID0gbmV3IEV2ZW50KCk7XG4gIG9uRGF0YSA9IG5ldyBFdmVudDxtZXNzYWdlPigpO1xuICBvbkFkZFRyYWNrID0gbmV3IEV2ZW50PE1lZGlhU3RyZWFtPigpO1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIGlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIGlzT2ZmZXIgPSBmYWxzZTtcblxuICByZW1vdGVTdHJlYW06IE1lZGlhU3RyZWFtIHwgdW5kZWZpbmVkO1xuICB0aW1lb3V0UGluZzogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG9wdDogUGFydGlhbDxvcHRpb24+ID0ge30pIHtcbiAgICBjb25zdCB7IG5vZGVJZCwgc3RyZWFtLCB0cmFjayB9ID0gb3B0O1xuXG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuXG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH0gZWxzZSBpZiAodHJhY2spIHtcbiAgICAgIHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKCkge1xuICAgIGNvbnN0IHsgZGlzYWJsZV9zdHVuLCB0cmlja2xlIH0gPSB0aGlzLm9wdDtcblxuICAgIGNvbnN0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uID0gZGlzYWJsZV9zdHVuXG4gICAgICA/IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgICAgfSlcbiAgICAgIDogbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybHM6IFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIHRoaXMub25BZGRUcmFjay5leGN1dGUoc3RyZWFtKTtcbiAgICAgIHRoaXMucmVtb3RlU3RyZWFtID0gc3RyZWFtO1xuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0UGluZyA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBpbmdcIik7XG4gICAgICAgICAgICB0aGlzLnNlbmQoXCJwaW5nXCIsIFwibGl2ZVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coeyBlcnJvciB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBpZiAodGhpcy50aW1lb3V0UGluZykgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFBpbmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZWRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgaWYgKGV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgICBpZiAodHJpY2tsZSkge1xuICAgICAgICAgICAgdGhpcy5vblNpZ25hbC5leGN1dGUoeyB0eXBlOiBcImNhbmRpZGF0ZVwiLCBpY2U6IGV2dC5jYW5kaWRhdGUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghdHJpY2tsZSAmJiBwZWVyLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMub25TaWduYWwuZXhjdXRlKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gZSA9PiB7XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gcGVlci5zaWduYWxpbmdTdGF0ZSAhPSBcInN0YWJsZVwiO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIGhhbmdVcCgpIHtcbiAgICBjb25zb2xlLmxvZyhcImhhbmd1cFwiKTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbkRpc2Nvbm5lY3QuZXhjdXRlKCk7XG4gIH1cblxuICBtYWtlT2ZmZXIoKSB7XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICBjb25zdCB7IHRyaWNrbGUgfSA9IHRoaXMub3B0O1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcblxuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5uZWdvdGlhdGluZyB8fCB0aGlzLnJ0Yy5zaWduYWxpbmdTdGF0ZSAhPSBcInN0YWJsZVwiKSByZXR1cm47XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gdHJ1ZTtcblxuICAgICAgY29uc3Qgc2RwID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICAgIGlmICghc2RwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucnRjXG4gICAgICAgIC5zZXRMb2NhbERlc2NyaXB0aW9uKHNkcClcbiAgICAgICAgLmNhdGNoKGVyciA9PiBKU09OLnN0cmluZ2lmeShlcnIpICsgXCJlcnJcIik7XG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcblxuICAgICAgaWYgKHRyaWNrbGUgJiYgbG9jYWwpIHtcbiAgICAgICAgdGhpcy5vblNpZ25hbC5leGN1dGUobG9jYWwpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5lZ290aWF0aW9uKCk7XG4gICAgfTtcbiAgfVxuXG4gIG5lZ290aWF0aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgbmVnb3RpYXRpb24oKSB7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkgcmV0dXJuO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy5uZWdvdGlhdGluZyB8fCB0aGlzLnJ0Yy5zaWduYWxpbmdTdGF0ZSAhPSBcInN0YWJsZVwiKSByZXR1cm47XG4gICAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge307XG4gICAgICAgIGNvbnN0IHNlc3Npb25EZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKG9wdGlvbnMpLmNhdGNoKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oc2Vzc2lvbkRlc2NyaXB0aW9uKS5jYXRjaCgpO1xuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb247XG4gICAgICAgIGlmIChsb2NhbCkge1xuICAgICAgICAgIHRoaXMuc2VuZChKU09OLnN0cmluZ2lmeShsb2NhbCksIFwidXBkYXRlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLm5lZ290aWF0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0QW5zd2VyKHNkcDogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNPZmZlcikge1xuICAgICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIob2ZmZXI6IGFueSkge1xuICAgIGNvbnN0IHsgdHJpY2tsZSB9ID0gdGhpcy5vcHQ7XG5cbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24ob2ZmZXIpKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoIWFuc3dlcikge1xuICAgICAgY29uc29sZS5sb2coXCJubyBhbnN3ZXJcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGxvY2FsID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcblxuICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkobG9jYWwpLCBcInVwZGF0ZVwiKTtcbiAgICB9IGVsc2UgaWYgKHRyaWNrbGUgJiYgbG9jYWwpIHtcbiAgICAgIHRoaXMub25TaWduYWwuZXhjdXRlKGxvY2FsKTtcbiAgICB9XG5cbiAgICB0aGlzLm5lZ290aWF0aW9uKCk7XG4gIH1cblxuICBhc3luYyBzZXRTZHAoc2RwOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHNkcC50eXBlKSB7XG4gICAgICBjYXNlIFwib2ZmZXJcIjpcbiAgICAgICAgdGhpcy5tYWtlQW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFuc3dlclwiOlxuICAgICAgICB0aGlzLnNldEFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgICAuYWRkSWNlQ2FuZGlkYXRlKG5ldyBSVENJY2VDYW5kaWRhdGUoc2RwLmljZSkpXG4gICAgICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgICAgfSBjYXRjaCAoZGNlKSB7fVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3RlZFwiLCB0aGlzLm5vZGVJZCk7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdC5leGN1dGUoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjaGFubmVsLmxhYmVsID09PSBcInVwZGF0ZVwiKSB7XG4gICAgICAgICAgY29uc3Qgc2RwID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB0aGlzLnNldFNkcChzZHApO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwibGl2ZVwiKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT09IFwicGluZ1wiKSB0aGlzLnNlbmQoXCJwb25nXCIsIFwibGl2ZVwiKTtcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLnRpbWVvdXRQaW5nKSBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0UGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkRhdGEuZXhjdXRlKHtcbiAgICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge307XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge307XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gIH1cblxuICBhZGRUcmFjayh0cmFjazogTWVkaWFTdHJlYW1UcmFjaywgc3RyZWFtOiBNZWRpYVN0cmVhbSkge1xuICAgIHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pO1xuICB9XG59XG4iXX0=