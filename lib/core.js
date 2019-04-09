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

    _defineProperty(this, "signal", void 0);

    _defineProperty(this, "connect", void 0);

    _defineProperty(this, "disconnect", void 0);

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
        stream = opt.stream;
    this.dataChannels = {};
    this.nodeId = nodeId || "peer";

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (_) {};

    this.rtc = this.prepareNewConnection();

    if (stream) {
      stream.getTracks().forEach(function (track) {
        return _this.rtc.addTrack(track, stream);
      });
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
              _this2.signal({
                type: "candidate",
                ice: evt.candidate
              });
            }
          } else {
            if (!trickle && peer.localDescription) {
              _this2.signal(peer.localDescription);
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
      this.disconnect();
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
                  _this3.signal(local);
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
                  this.signal(local);
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

          _this5.connect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJFdmVudCIsIm5vZGVJZCIsInN0cmVhbSIsImRhdGFDaGFubmVscyIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwiXyIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZ2V0VHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwiYWRkVHJhY2siLCJkaXNhYmxlX3N0dW4iLCJ0cmlja2xlIiwicGVlciIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbnRyYWNrIiwiZXZ0Iiwic3RyZWFtcyIsIm9uQWRkVHJhY2siLCJleGN1dGUiLCJyZW1vdGVTdHJlYW0iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsInRpbWVvdXRQaW5nIiwic2V0VGltZW91dCIsImhhbmdVcCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJvbmljZWNhbmRpZGF0ZSIsImlzQ29ubmVjdGVkIiwiY2FuZGlkYXRlIiwidHlwZSIsImljZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UiLCJlIiwibmVnb3RpYXRpbmciLCJzaWduYWxpbmdTdGF0ZSIsImlzRGlzY29ubmVjdGVkIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJzZHAiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiZXJyIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3VsdCIsImxvY2FsIiwibmVnb3RpYXRpb24iLCJvcHRpb25zIiwic2Vzc2lvbkRlc2NyaXB0aW9uIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJvZmZlciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsIm1ha2VBbnN3ZXIiLCJzZXRBbnN3ZXIiLCJhZGRJY2VDYW5kaWRhdGUiLCJSVENJY2VDYW5kaWRhdGUiLCJPYmplY3QiLCJrZXlzIiwiaW5jbHVkZXMiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZXZlbnQiLCJwYXJzZSIsImRhdGEiLCJzZXRTZHAiLCJvbkRhdGEiLCJvbmVycm9yIiwib25jbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7O0FBTkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQXFCcUJDLE07OztBQW1CbkIsb0JBQThDO0FBQUE7O0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsb0NBYnJDLElBQUlDLGNBQUosRUFhcUM7O0FBQUEsd0NBWmpDLElBQUlBLGNBQUosRUFZaUM7O0FBQUE7O0FBQUE7O0FBQUEseUNBUGhDLEtBT2dDOztBQUFBLDRDQU43QixLQU02Qjs7QUFBQSxxQ0FMcEMsS0FLb0M7O0FBQUE7O0FBQUE7O0FBQUEseUNBZ0loQyxLQWhJZ0M7O0FBQUEsUUFDcENDLE1BRG9DLEdBQ2pCRixHQURpQixDQUNwQ0UsTUFEb0M7QUFBQSxRQUM1QkMsTUFENEIsR0FDakJILEdBRGlCLENBQzVCRyxNQUQ0QjtBQUc1QyxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0YsTUFBTCxHQUFjQSxNQUFNLElBQUksTUFBeEI7O0FBRUEsU0FBS0csT0FBTCxHQUFlLFlBQU0sQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLFlBQU0sQ0FBRSxDQUExQjs7QUFDQSxTQUFLQyxNQUFMLEdBQWMsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBckI7O0FBRUEs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RUFBRSxNQUFJLENBQUNBO0FBSEksdUJBQW5CO0FBS0Q7O0FBZmlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXBCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaUJELE9BbEJELENBa0JFLE9BQU9pQyxLQUFQLEVBQWMsQ0FBRTs7QUFDbEJVLE1BQUFBLE9BQU8sQ0FBQzZDLE9BQVIsR0FBa0IsVUFBQTlCLEdBQUcsRUFBSSxDQUFFLENBQTNCOztBQUNBZixNQUFBQSxPQUFPLENBQUM4QyxPQUFSLEdBQWtCLFlBQU0sQ0FBRSxDQUExQjtBQUNEOzs7eUJBRUlKLEksRUFBV3pDLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQytCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUsxRSxZQUFqQixFQUErQjJFLFFBQS9CLENBQXdDakMsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLUSxpQkFBTCxDQUF1QlIsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBSzFDLFlBQUwsQ0FBa0IwQyxLQUFsQixFQUF5QlosSUFBekIsQ0FBOEJxRCxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPcEQsS0FBUCxFQUFjLENBQUU7QUFDbkI7Ozs2QkFFUXRCLEssRUFBeUJWLE0sRUFBcUI7QUFDckQsV0FBS00sR0FBTCxDQUFTSyxRQUFULENBQWtCRCxLQUFsQixFQUF5QlYsTUFBekI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7XG4gIFJUQ1BlZXJDb25uZWN0aW9uLFxuICBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gIFJUQ0ljZUNhbmRpZGF0ZVxufSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCIuL3V0aWxsL2V2ZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW46IGJvb2xlYW47XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIG5vZGVJZDogc3RyaW5nO1xuICB0cmlja2xlOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogb2JqZWN0KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBvbkRhdGEgPSBuZXcgRXZlbnQ8bWVzc2FnZT4oKTtcbiAgb25BZGRUcmFjayA9IG5ldyBFdmVudDxNZWRpYVN0cmVhbT4oKTtcblxuICBwcml2YXRlIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuXG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICBpc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICBpc09mZmVyID0gZmFsc2U7XG5cbiAgcmVtb3RlU3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZDtcbiAgdGltZW91dFBpbmc6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHQ6IFBhcnRpYWw8b3B0aW9uPiA9IHt9KSB7XG4gICAgY29uc3QgeyBub2RlSWQsIHN0cmVhbSB9ID0gb3B0O1xuXG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gXyA9PiB7fTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuXG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgeyBkaXNhYmxlX3N0dW4sIHRyaWNrbGUgfSA9IHRoaXMub3B0O1xuXG4gICAgY29uc3QgcGVlcjogUlRDUGVlckNvbm5lY3Rpb24gPSBkaXNhYmxlX3N0dW5cbiAgICAgID8gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgICB9KVxuICAgICAgOiBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgdGhpcy5vbkFkZFRyYWNrLmV4Y3V0ZShzdHJlYW0pO1xuICAgICAgdGhpcy5yZW1vdGVTdHJlYW0gPSBzdHJlYW07XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRQaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGluZ1wiKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZChcInBpbmdcIiwgXCJsaXZlXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7IGVycm9yIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRQaW5nKSBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0UGluZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlZFwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICBpZiAoZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICAgIGlmICh0cmlja2xlKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbCh7IHR5cGU6IFwiY2FuZGlkYXRlXCIsIGljZTogZXZ0LmNhbmRpZGF0ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0cmlja2xlICYmIHBlZXIubG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBwZWVyLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCI7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgaGFuZ1VwKCkge1xuICAgIGNvbnNvbGUubG9nKFwiaGFuZ3VwXCIpO1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIG1ha2VPZmZlcigpIHtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIGNvbnN0IHsgdHJpY2tsZSB9ID0gdGhpcy5vcHQ7XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuXG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5lZ290aWF0aW5nIHx8IHRoaXMucnRjLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCIpIHJldHVybjtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuXG4gICAgICBjb25zdCBzZHAgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgICAgaWYgKCFzZHApIHJldHVybjtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgLnNldExvY2FsRGVzY3JpcHRpb24oc2RwKVxuICAgICAgICAuY2F0Y2goZXJyID0+IEpTT04uc3RyaW5naWZ5KGVycikgKyBcImVyclwiKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uO1xuXG4gICAgICBpZiAodHJpY2tsZSAmJiBsb2NhbCkge1xuICAgICAgICB0aGlzLnNpZ25hbChsb2NhbCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmVnb3RpYXRpb24oKTtcbiAgICB9O1xuICB9XG5cbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBuZWdvdGlhdGlvbigpIHtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSByZXR1cm47XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLm5lZ290aWF0aW5nIHx8IHRoaXMucnRjLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCIpIHJldHVybjtcbiAgICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbkRlc2NyaXB0aW9uID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIob3B0aW9ucykuY2F0Y2goKTtcbiAgICAgICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihzZXNzaW9uRGVzY3JpcHRpb24pLmNhdGNoKCk7XG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKGxvY2FsKSB7XG4gICAgICAgICAgdGhpcy5zZW5kKEpTT04uc3RyaW5naWZ5KGxvY2FsKSwgXCJ1cGRhdGVcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXRBbnN3ZXIoc2RwOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc09mZmVyKSB7XG4gICAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbWFrZUFuc3dlcihvZmZlcjogYW55KSB7XG4gICAgY29uc3QgeyB0cmlja2xlIH0gPSB0aGlzLm9wdDtcblxuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihvZmZlcikpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmICghYW5zd2VyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vIGFuc3dlclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgY29uc3QgbG9jYWwgPSB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uO1xuXG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VuZChKU09OLnN0cmluZ2lmeShsb2NhbCksIFwidXBkYXRlXCIpO1xuICAgIH0gZWxzZSBpZiAodHJpY2tsZSAmJiBsb2NhbCkge1xuICAgICAgdGhpcy5zaWduYWwobG9jYWwpO1xuICAgIH1cblxuICAgIHRoaXMubmVnb3RpYXRpb24oKTtcbiAgfVxuXG4gIGFzeW5jIHNldFNkcChzZHA6IGFueSkge1xuICAgIHN3aXRjaCAoc2RwLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJvZmZlclwiOlxuICAgICAgICB0aGlzLm1ha2VBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYW5zd2VyXCI6XG4gICAgICAgIHRoaXMuc2V0QW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNhbmRpZGF0ZVwiOlxuICAgICAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgICAgIC5hZGRJY2VDYW5kaWRhdGUobmV3IFJUQ0ljZUNhbmRpZGF0ZShzZHAuaWNlKSlcbiAgICAgICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgICB9IGNhdGNoIChkY2UpIHt9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29ubmVjdGVkXCIsIHRoaXMubm9kZUlkKTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwub25tZXNzYWdlID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm47XG5cbiAgICAgICAgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwidXBkYXRlXCIpIHtcbiAgICAgICAgICBjb25zdCBzZHAgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIHRoaXMuc2V0U2RwKHNkcCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJsaXZlXCIpIHtcbiAgICAgICAgICBpZiAoZXZlbnQuZGF0YSA9PT0gXCJwaW5nXCIpIHRoaXMuc2VuZChcInBvbmdcIiwgXCJsaXZlXCIpO1xuICAgICAgICAgIGVsc2UgaWYgKHRoaXMudGltZW91dFBpbmcpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRQaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YS5leGN1dGUoe1xuICAgICAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7fTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7fTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgfVxuXG4gIGFkZFRyYWNrKHRyYWNrOiBNZWRpYVN0cmVhbVRyYWNrLCBzdHJlYW06IE1lZGlhU3RyZWFtKSB7XG4gICAgdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSk7XG4gIH1cbn1cbiJdfQ==