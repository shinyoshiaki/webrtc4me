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

    _defineProperty(this, "isMadeAnswer", false);

    _defineProperty(this, "remoteStream", void 0);

    this.dataChannels = {};
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (_) {};

    this.rtc = this.prepareNewConnection();

    if (opt.stream) {
      var _stream = opt.stream;

      _stream.getTracks().forEach(function (track) {
        return _this.rtc.addTrack(track, _stream);
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
            _this2.hangUp();

            break;

          case "disconnected":
            _this2.hangUp();

            break;

          case "connected":
            break;

          case "closed":
            break;

          case "completed":
            break;
        }
      };

      peer.onicecandidate = function (evt) {
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
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this2.dataChannels[dataChannel.label] = dataChannel;

        _this2.dataChannelEvents(dataChannel);
      };

      peer.onsignalingstatechange = function (e) {};

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
                _context.next = 2;
                return _this3.rtc.createOffer().catch(console.log);

              case 2:
                sdp = _context.sent;

                if (sdp) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                _context.next = 7;
                return _this3.rtc.setLocalDescription(sdp).catch(function (err) {
                  return JSON.stringify(err) + "err";
                });

              case 7:
                result = _context.sent;

                if (!(typeof result === "string")) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return");

              case 10:
                local = _this3.rtc.localDescription;

                if (trickle && local) {
                  _this3.signal(local);
                }

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }
  }, {
    key: "setAnswer",
    value: function () {
      var _setAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(sdp) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.isOffer) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
      regeneratorRuntime.mark(function _callee3(offer) {
        var trickle, result, answer, local;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                trickle = this.opt.trickle;

                if (!this.isMadeAnswer) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                this.isMadeAnswer = true;
                _context3.next = 6;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(offer)).catch(function (err) {
                  return JSON.stringify(err) + "err";
                });

              case 6:
                result = _context3.sent;

                if (!(typeof result === "string")) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return");

              case 9:
                _context3.next = 11;
                return this.rtc.createAnswer().catch(console.log);

              case 11:
                answer = _context3.sent;

                if (answer) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt("return");

              case 14:
                _context3.next = 16;
                return this.rtc.setLocalDescription(answer).catch(function (err) {
                  return JSON.stringify(err) + "err";
                });

              case 16:
                result = _context3.sent;

                if (!(typeof result === "string")) {
                  _context3.next = 19;
                  break;
                }

                return _context3.abrupt("return");

              case 19:
                local = this.rtc.localDescription;

                if (trickle && local) {
                  this.signal(local);
                }

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
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
      regeneratorRuntime.mark(function _callee4(sdp) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.t0 = sdp.type;
                _context4.next = _context4.t0 === "offer" ? 3 : _context4.t0 === "answer" ? 5 : _context4.t0 === "candidate" ? 7 : 10;
                break;

              case 3:
                this.makeAnswer(sdp);
                return _context4.abrupt("break", 10);

              case 5:
                this.setAnswer(sdp);
                return _context4.abrupt("break", 10);

              case 7:
                _context4.next = 9;
                return this.rtc.addIceCandidate(new _wrtc.RTCIceCandidate(sdp.ice)).catch(console.log);

              case 9:
                return _context4.abrupt("break", 10);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function setSdp(_x3) {
        return _setSdp.apply(this, arguments);
      }

      return setSdp;
    }()
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
          regeneratorRuntime.mark(function _callee5(event) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (event) {
                      _context5.next = 2;
                      break;
                    }

                    return _context5.abrupt("return");

                  case 2:
                    _this4.onData.excute({
                      label: channel.label,
                      data: event.data,
                      nodeId: _this4.nodeId
                    });

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          return function (_x4) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJFdmVudCIsImRhdGFDaGFubmVscyIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwiXyIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwic3RyZWFtIiwiZ2V0VHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwiYWRkVHJhY2siLCJkaXNhYmxlX3N0dW4iLCJ0cmlja2xlIiwicGVlciIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbnRyYWNrIiwiZXZ0Iiwic3RyZWFtcyIsIm9uQWRkVHJhY2siLCJleGN1dGUiLCJyZW1vdGVTdHJlYW0iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsImhhbmdVcCIsIm9uaWNlY2FuZGlkYXRlIiwiY2FuZGlkYXRlIiwidHlwZSIsImljZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UiLCJlIiwiaXNEaXNjb25uZWN0ZWQiLCJpc0Nvbm5lY3RlZCIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsInNkcCIsInNldExvY2FsRGVzY3JpcHRpb24iLCJlcnIiLCJKU09OIiwic3RyaW5naWZ5IiwicmVzdWx0IiwibG9jYWwiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsIm9mZmVyIiwiaXNNYWRlQW5zd2VyIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwibWFrZUFuc3dlciIsInNldEFuc3dlciIsImFkZEljZUNhbmRpZGF0ZSIsIlJUQ0ljZUNhbmRpZGF0ZSIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm9uRGF0YSIsImRhdGEiLCJlcnJvciIsIm9uZXJyb3IiLCJvbmNsb3NlIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7O0FBTkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztJQXFCcUJDLE07OztBQW1CbkIsb0JBQThDO0FBQUE7O0FBQUEsUUFBM0JDLEdBQTJCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsb0NBYnJDLElBQUlDLGNBQUosRUFhcUM7O0FBQUEsd0NBWmpDLElBQUlBLGNBQUosRUFZaUM7O0FBQUE7O0FBQUE7O0FBQUEseUNBUGhDLEtBT2dDOztBQUFBLDRDQU43QixLQU02Qjs7QUFBQSxxQ0FMcEMsS0FLb0M7O0FBQUEsMENBSi9CLEtBSStCOztBQUFBOztBQUM1QyxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEtBQUtILEdBQUwsQ0FBU0csTUFBVCxJQUFtQixNQUFqQzs7QUFFQSxTQUFLQyxPQUFMLEdBQWUsWUFBTSxDQUFFLENBQXZCOztBQUNBLFNBQUtDLFVBQUwsR0FBa0IsWUFBTSxDQUFFLENBQTFCOztBQUNBLFNBQUtDLE1BQUwsR0FBYyxVQUFBQyxDQUFDLEVBQUksQ0FBRSxDQUFyQjs7QUFFQSxTQUFLQyxHQUFMLEdBQVcsS0FBS0Msb0JBQUwsRUFBWDs7QUFFQSxRQUFJVCxHQUFHLENBQUNVLE1BQVIsRUFBZ0I7QUFDZCxVQUFNQSxPQUFNLEdBQUdWLEdBQUcsQ0FBQ1UsTUFBbkI7O0FBQ0FBLE1BQUFBLE9BQU0sQ0FBQ0MsU0FBUCxHQUFtQkMsT0FBbkIsQ0FBMkIsVUFBQUMsS0FBSztBQUFBLGVBQUksS0FBSSxDQUFDTCxHQUFMLENBQVNNLFFB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QUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxhQUFqQjs7QUFDQSxVQUFJLENBQUN5QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLOUUsWUFBakIsRUFBK0IrRSxRQUEvQixDQUF3QzNDLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS08saUJBQUwsQ0FBdUJQLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUtwQyxZQUFMLENBQWtCb0MsS0FBbEIsRUFBeUI0QyxJQUF6QixDQUE4QlAsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT0MsS0FBUCxFQUFjO0FBQ2QsYUFBSy9DLE1BQUw7QUFDRDtBQUNGOzs7K0JBRVUxQixNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHtcbiAgUlRDUGVlckNvbm5lY3Rpb24sXG4gIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbixcbiAgUlRDSWNlQ2FuZGlkYXRlXG59IGZyb20gXCJ3cnRjXCI7XG5pbXBvcnQgRXZlbnQgZnJvbSBcIi4vdXRpbGwvZXZlbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBtZXNzYWdlIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgZGF0YTogYW55O1xuICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIG9wdGlvbiB7XG4gIGRpc2FibGVfc3R1bjogYm9vbGVhbjtcbiAgc3RyZWFtOiBNZWRpYVN0cmVhbTtcbiAgbm9kZUlkOiBzdHJpbmc7XG4gIHRyaWNrbGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgc2lnbmFsOiAoc2RwOiBvYmplY3QpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIG9uRGF0YSA9IG5ldyBFdmVudDxtZXNzYWdlPigpO1xuICBvbkFkZFRyYWNrID0gbmV3IEV2ZW50PE1lZGlhU3RyZWFtPigpO1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIGlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgaXNNYWRlQW5zd2VyID0gZmFsc2U7XG5cbiAgcmVtb3RlU3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IF8gPT4ge307XG5cbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcblxuICAgIGlmIChvcHQuc3RyZWFtKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBvcHQuc3RyZWFtO1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgeyBkaXNhYmxlX3N0dW4sIHRyaWNrbGUgfSA9IHRoaXMub3B0O1xuXG4gICAgY29uc3QgcGVlcjogUlRDUGVlckNvbm5lY3Rpb24gPSBkaXNhYmxlX3N0dW5cbiAgICAgID8gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgICB9KVxuICAgICAgOiBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgdGhpcy5vbkFkZFRyYWNrLmV4Y3V0ZShzdHJlYW0pO1xuICAgICAgdGhpcy5yZW1vdGVTdHJlYW0gPSBzdHJlYW07XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICBpZiAodHJpY2tsZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHsgdHlwZTogXCJjYW5kaWRhdGVcIiwgaWNlOiBldnQuY2FuZGlkYXRlIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRyaWNrbGUgJiYgcGVlci5sb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub25zaWduYWxpbmdzdGF0ZWNoYW5nZSA9IGUgPT4ge307XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIGhhbmdVcCgpIHtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBtYWtlT2ZmZXIoKSB7XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICBjb25zdCB7IHRyaWNrbGUgfSA9IHRoaXMub3B0O1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcblxuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzZHAgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgICAgaWYgKCFzZHApIHJldHVybjtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgLnNldExvY2FsRGVzY3JpcHRpb24oc2RwKVxuICAgICAgICAuY2F0Y2goZXJyID0+IEpTT04uc3RyaW5naWZ5KGVycikgKyBcImVyclwiKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uO1xuXG4gICAgICBpZiAodHJpY2tsZSAmJiBsb2NhbCkge1xuICAgICAgICB0aGlzLnNpZ25hbChsb2NhbCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0QW5zd2VyKHNkcDogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNPZmZlcikge1xuICAgICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIob2ZmZXI6IGFueSkge1xuICAgIGNvbnN0IHsgdHJpY2tsZSB9ID0gdGhpcy5vcHQ7XG5cbiAgICBpZiAodGhpcy5pc01hZGVBbnN3ZXIpIHJldHVybjtcbiAgICB0aGlzLmlzTWFkZUFuc3dlciA9IHRydWU7XG5cbiAgICBsZXQgcmVzdWx0OiB2b2lkIHwgc3RyaW5nO1xuXG4gICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKG9mZmVyKSlcbiAgICAgIC5jYXRjaChlcnIgPT4gSlNPTi5zdHJpbmdpZnkoZXJyKSArIFwiZXJyXCIpO1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKCFhbnN3ZXIpIHJldHVybjtcblxuICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpXG4gICAgICAuY2F0Y2goZXJyID0+IEpTT04uc3RyaW5naWZ5KGVycikgKyBcImVyclwiKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgbG9jYWwgPSB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uO1xuICAgIGlmICh0cmlja2xlICYmIGxvY2FsKSB7XG4gICAgICB0aGlzLnNpZ25hbChsb2NhbCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2V0U2RwKHNkcDogYW55KSB7XG4gICAgc3dpdGNoIChzZHAudHlwZSkge1xuICAgICAgY2FzZSBcIm9mZmVyXCI6XG4gICAgICAgIHRoaXMubWFrZUFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcbiAgICAgICAgdGhpcy5zZXRBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2FuZGlkYXRlXCI6XG4gICAgICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAgICAgLmFkZEljZUNhbmRpZGF0ZShuZXcgUlRDSWNlQ2FuZGlkYXRlKHNkcC5pY2UpKVxuICAgICAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm9uRGF0YS5leGN1dGUoe1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHt9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==