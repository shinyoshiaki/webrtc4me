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
              }, 5000);
              console.log("ping");

              _this2.send("ping", "live");
            } catch (error) {
              console.log({
                error: error
              });
            }

            break;

          case "connected":
            console.log("connected");
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
        if (_this2.isConnected) {
          if (!evt.candidate) {
            _this2.send(JSON.stringify(_this2.rtc.localDescription), "update");
          }
        } else {
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

      peer.onsignalingstatechange = function (e) {};

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

                _this3.negotiation();

              case 13:
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
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(ev) {
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
                  options = {};
                  _context2.next = 5;
                  return _this4.rtc.createOffer(options).catch();

                case 5:
                  sessionDescription = _context2.sent;
                  _context2.next = 8;
                  return _this4.rtc.setLocalDescription(sessionDescription).catch();

                case 8:
                  local = _this4.rtc.localDescription;

                  if (local) {
                    _this4.send(JSON.stringify(local), "update");
                  }

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }();
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

      function makeAnswer(_x3) {
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

      function setSdp(_x4) {
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
                      console.log("update", {
                        event: event
                      });
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

          return function (_x5) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJFdmVudCIsIm5vZGVJZCIsInN0cmVhbSIsImRhdGFDaGFubmVscyIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwiXyIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZ2V0VHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwiYWRkVHJhY2siLCJkaXNhYmxlX3N0dW4iLCJ0cmlja2xlIiwicGVlciIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbnRyYWNrIiwiZXZ0Iiwic3RyZWFtcyIsIm9uQWRkVHJhY2siLCJleGN1dGUiLCJyZW1vdGVTdHJlYW0iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsInRpbWVvdXRQaW5nIiwic2V0VGltZW91dCIsImhhbmdVcCIsImNvbnNvbGUiLCJsb2ciLCJzZW5kIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJvbmljZWNhbmRpZGF0ZSIsImlzQ29ubmVjdGVkIiwiY2FuZGlkYXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2FsRGVzY3JpcHRpb24iLCJ0eXBlIiwiaWNlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnNpZ25hbGluZ3N0YXRlY2hhbmdlIiwiZSIsImlzRGlzY29ubmVjdGVkIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJzZHAiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiZXJyIiwicmVzdWx0IiwibG9jYWwiLCJuZWdvdGlhdGlvbiIsImV2Iiwib3B0aW9ucyIsInNlc3Npb25EZXNjcmlwdGlvbiIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwib2ZmZXIiLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwiUlRDSWNlQ2FuZGlkYXRlIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImV2ZW50IiwicGFyc2UiLCJkYXRhIiwic2V0U2RwIiwib25EYXRhIiwib25lcnJvciIsIm9uY2xvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7OztBQU5BQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFxQnFCQyxNOzs7QUFtQm5CLG9CQUE4QztBQUFBOztBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLG9DQWJyQyxJQUFJQyxjQUFKLEVBYXFDOztBQUFBLHdDQVpqQyxJQUFJQSxjQUFKLEVBWWlDOztBQUFBOztBQUFBOztBQUFBLHlDQVBoQyxLQU9nQzs7QUFBQSw0Q0FON0IsS0FNNkI7O0FBQUEscUNBTHBDLEtBS29DOztBQUFBOztBQUFBOztBQUFBLFFBQ3BDQyxNQURvQyxHQUNqQkYsR0FEaUIsQ0FDcENFLE1BRG9DO0FBQUEsUUFDNUJDLE1BRDRCLEdBQ2pCSCxHQURpQixDQUM1QkcsTUFENEI7QUFHNUMsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtGLE1BQUwsR0FBY0EsTUFBTSxJQUFJLE1BQXhCOztBQUVBLFNBQUtHLE9BQUwsR0FBZSxZQUFNLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixZQUFNLENBQUUsQ0FBMUI7O0FBQ0EsU0FBS0MsTUFBTCxHQUFjLFVBQUFDLENBQUMsRUFBSSxDQUFFLENBQXJCOztBQUVBLFNBQUtDLEdBQUwsR0FBVyxLQUFLQyxvQkFBTCxFQUFYOztBQUVBLFFBQUlQLE1BQUosRUFBWTtBQUNWQSxNQUFBQSxNQUFNLENBQUNRLFNBQVAsR0FBbUJDLE9BQW5CLENBQTJCLFVBQUFDLEtBQUs7QUFBQSxlQUFJLEtBQUksQ0FBQ0osR0FBTCxDQUFTSyxRQUFULENBQWtCRCxLQUFsQixFQUF5QlYsTUFBekIsQ0FBSjtBQUFBLE9BQWhDO0FBQ0Q7QUFDRjs7OzsyQ0FFOEI7QUFBQTs7QUFBQSxzQkFDSyxLQUFLSCxHQURWO0FBQUEsVUFDckJlLFlBRHFCLGFBQ3JCQSxZQURxQjtBQUFBLFVBQ1BDLE9BRE8sYUFDUEEsT0FETztBQUc3QixVQUFNQyxJQUF1QixHQUFHRixZQUFZLEdBQ3hDLElBQUlHLHVCQUFKLENBQXNCO0FBQ3BCQyxRQUFBQSxVQUFVLEVBQUU7QUFEUSxPQUF0QixDQUR3QyxHQUl4QyxJQUFJRCx1QkFBSixDQUFzQjtBQUNwQkMsUUFBQUEsVUFBVSxFQUFFLENBQ1Y7QUFDRUMsVUFBQUEsSUFBSSxFQUFFO0FBRFIsU0FEVTtBQURRLE9BQXRCLENBSko7O0FBWUFILE1BQUFBLElBQUksQ0FBQ0ksT0FBTCxHQUFlLFVBQUFDLEdBQUcsRUFBSTtBQUNwQixZQUFNbkIsTUFBTSxHQUFHbUIsR0FBRyxDQUFDQyxPQUFKLENBQVksQ0FBWixDQUFmOztBQUNBLFFBQUEsTUFBSSxDQUFDQyxVQUFMLENBQWdCQyxNQUFoQixDQUF1QnRCLE1BQXZCOztBQUNBLFFBQUEsTUFBSSxDQUFDdUIsWUFBTCxHQUFvQnZCLE1BQXBCO0FBQ0QsT0FKRDs7QUFNQWMsTUFBQUEsSUFBSSxDQUFDVSwwQkFBTCxHQUFrQyxZQUFNO0FBQ3RDLGdCQUFRVixJQUFJLENBQUNXLGtCQUFiO0FBQ0UsZUFBSyxRQUFMO0FBQ0U7O0FBQ0YsZUFBSyxjQUFMO0FBQ0UsZ0JBQUk7QUFDRixjQUFBLE1BQUksQ0FBQ0MsV0FBTCxHQUFtQkMsVUFBVSxDQUFDLFlBQU07QUFDbEMsZ0JBQUEsTUFBSSxDQUFDQyxNQUFMO0FBQ0QsZUFGNEIsRUFFMUIsSUFGMEIsQ0FBN0I7QUFJQUMsY0FBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWjs7QUFDQSxjQUFBLE1BQUksQ0FBQ0MsSUFBTCxDQUFVLE1BQVYsRUFBa0IsTUFBbEI7QUFDRCxhQVBELENBT0UsT0FBT0MsS0FBUCxFQUFjO0FBQ2RILGNBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZO0FBQUVFLGdCQUFBQSxLQUFLLEVBQUxBO0FBQUYsZUFBWjtBQUNEOztBQUVEOztBQUNGLGVBQUssV0FBTDtBQUNFSCxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsZ0JBQUksTUFBSSxDQUFDSixXQUFULEVBQXNCTyxZQUFZLENBQUMsTUFBSSxDQUFDUCxXQUFOLENBQVo7QUFDdEI7O0FBQ0YsZUFBSyxRQUFMO0FBQ0VHLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFFBQVo7QUFDQTs7QUFDRixlQUFLLFdBQUw7QUFDRTtBQXhCSjtBQTBCRCxPQTNCRDs7QUE2QkFoQixNQUFBQSxJQUFJLENBQUNvQixjQUFMLEdBQXNCLFVBQUFmLEdBQUcsRUFBSTtBQUMzQixZQUFJLE1BQUksQ0FBQ2dCLFdBQVQsRUFBc0I7QUFDcEIsY0FBSSxDQUFDaEIsR0FBRyxDQUFDaUIsU0FBVCxFQUFvQjtBQUNsQixZQUFBLE1BQUksQ0FBQ0wsSUFBTCxDQUFVTSxJQUFJLENBQUNDLFNBQUwsQ0FBZSxNQUFJLENBQUNoQyxHQUFMLENBQVNpQyxnQkFBeEIsQ0FBVixFQUFxRCxRQUFyRDtBQUNEO0FBQ0YsU0FKRCxNQUlPO0FBQ0wsY0FBSXBCLEdBQUcsQ0FBQ2lCLFNBQVIsRUFBbUI7QUFDakIsZ0JBQUl2QixPQUFKLEVBQWE7QUFDWCxjQUFBLE1BQUksQ0FBQ1QsTUFBTCxDQUFZO0FBQUVvQyxnQkFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJDLGdCQUFBQSxHQUFHLEVBQUV0QixHQUFHLENBQUNpQjtBQUE5QixlQUFaO0FBQ0Q7QUFDRixXQUpELE1BSU87QUFDTCxnQkFBSSxDQUFDdkIsT0FBRCxJQUFZQyxJQUFJLENBQUN5QixnQkFBckIsRUFBdUM7QUFDckMsY0FBQSxNQUFJLENBQUNuQyxNQUFMLENBQVlVLElBQUksQ0FBQ3lCLGdCQUFqQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLE9BaEJEOztBQWtCQXpCLE1BQUFBLElBQUksQ0FBQzRCLGFBQUwsR0FBcUIsVUFBQXZCLEdBQUcsRUFBSTtBQUMxQixZQUFNd0IsV0FBVyxHQUFHeEIsR0FBRyxDQUFDeUIsT0FBeEI7QUFDQSxRQUFBLE1BQUksQ0FBQzNDLFlBQUwsQ0FBa0IwQyxXQUFXLENBQUNFLEtBQTlCLElBQXVDRixXQUF2Qzs7QUFDQSxRQUFBLE1BQUksQ0FBQ0csaUJBQUwsQ0FBdUJILFdBQXZCO0FBQ0QsT0FKRDs7QUFNQTdCLE1BQUFBLElBQUksQ0FBQ2lDLHNCQUFMLEdBQThCLFVBQUFDLENBQUMsRUFBSSxDQUFFLENBQXJDOztBQUVBLGFBQU9sQyxJQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQZSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFaO0FBQ0EsV0FBS21CLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxXQUFLZCxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsV0FBS2hDLFVBQUw7QUFDRDs7O2dDQUVXO0FBQUE7O0FBQ1YsV0FBSytDLE9BQUwsR0FBZSxJQUFmO0FBRFUsVUFFRnJDLE9BRkUsR0FFVSxLQUFLaEIsR0FGZixDQUVGZ0IsT0FGRTtBQUdWLFdBQUtzQyxpQkFBTCxDQUF1QixhQUF2QjtBQUVBLFdBQUs3QyxHQUFMLENBQVM4QyxtQkFBVDtBQUFBO0FBQUE7QUFBQTtBQUFBLDhCQUErQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUNYLE1BQUksQ0FBQzlDLEdBQUwsQ0FBUytDLFdBQVQsR0FBdUJDLEtBQXZCLENBQTZCekIsT0FBTyxDQUFDQyxHQUFyQyxDQURXOztBQUFBO0FBQ3ZCeUIsZ0JBQUFBLEdBRHVCOztBQUFBLG9CQUd4QkEsR0FId0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBLHVCQUtSLE1BQUksQ0FBQ2pELEdBQUwsQ0FDbEJrRCxtQkFEa0IsQ0FDRUQsR0FERixFQUVsQkQsS0FGa0IsQ0FFWixVQUFBRyxHQUFHO0FBQUEseUJBQUlwQixJQUFJLENBQUNDLFNBQUwsQ0FBZW1CLEdBQWYsSUFBc0IsS0FBMUI7QUFBQSxpQkFGUyxDQUxROztBQUFBO0FBS3ZCQyxnQkFBQUEsTUFMdUI7O0FBQUEsc0JBUXpCLE9BQU9BLE1BQVAsS0FBa0IsUUFSTztBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQVl2QkMsZ0JBQUFBLEtBWnVCLEdBWWYsTUFBSSxDQUFDckQsR0FBTCxDQUFTaUMsZ0JBWk07O0FBYzdCLG9CQUFJMUIsT0FBTyxJQUFJOEMsS0FBZixFQUFzQjtBQUNwQixrQkFBQSxNQUFJLENBQUN2RCxNQUFMLENBQVl1RCxLQUFaO0FBQ0Q7O0FBRUQsZ0JBQUEsTUFBSSxDQUFDQyxXQUFMOztBQWxCNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBL0I7QUFvQkQ7OztrQ0FFcUI7QUFBQTs7QUFDcEIsV0FBS3RELEdBQUwsQ0FBUzhDLG1CQUFUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQ0FBK0Isa0JBQU1TLEVBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQ3hCLE1BQUksQ0FBQzFCLFdBRG1CO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBR3ZCMkIsa0JBQUFBLE9BSHVCLEdBR2IsRUFIYTtBQUFBO0FBQUEseUJBSUksTUFBSSxDQUFDeEQsR0FBTCxDQUFTK0MsV0FBVCxDQUFxQlMsT0FBckIsRUFBOEJSLEtBQTlCLEVBSko7O0FBQUE7QUFJdkJTLGtCQUFBQSxrQkFKdUI7QUFBQTtBQUFBLHlCQUt2QixNQUFJLENBQUN6RCxHQUFMLENBQVNrRCxtQkFBVCxDQUE2Qk8sa0JBQTdCLEVBQWlEVCxLQUFqRCxFQUx1Qjs7QUFBQTtBQU12Qkssa0JBQUFBLEtBTnVCLEdBTWYsTUFBSSxDQUFDckQsR0FBTCxDQUFTaUMsZ0JBTk07O0FBTzdCLHNCQUFJb0IsS0FBSixFQUFXO0FBQ1Qsb0JBQUEsTUFBSSxDQUFDNUIsSUFBTCxDQUFVTSxJQUFJLENBQUNDLFNBQUwsQ0FBZXFCLEtBQWYsQ0FBVixFQUFpQyxRQUFqQztBQUNEOztBQVQ0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUEvQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdEOzs7Ozs7Z0RBRXVCSixHOzs7OztxQkFDbEIsS0FBS0wsTzs7Ozs7O3VCQUNELEtBQUs1QyxHQUFMLENBQ0gwRCxvQkFERyxDQUNrQixJQUFJQywyQkFBSixDQUEwQlYsR0FBMUIsQ0FEbEIsRUFFSEQsS0FGRyxDQUVHekIsT0FBTyxDQUFDQyxHQUZYLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFNZW9DLEs7Ozs7OztBQUNmckQsZ0JBQUFBLE8sR0FBWSxLQUFLaEIsRyxDQUFqQmdCLE87O3VCQUVGLEtBQUtQLEdBQUwsQ0FDSDBELG9CQURHLENBQ2tCLElBQUlDLDJCQUFKLENBQTBCQyxLQUExQixDQURsQixFQUVIWixLQUZHLENBRUd6QixPQUFPLENBQUNDLEdBRlgsQzs7Ozt1QkFJZSxLQUFLeEIsR0FBTCxDQUFTNkQsWUFBVCxHQUF3QmIsS0FBeEIsQ0FBOEJ6QixPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFmc0MsZ0JBQUFBLE07O29CQUNEQSxNOzs7OztBQUNIdkMsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVo7Ozs7O3VCQUlJLEtBQUt4QixHQUFMLENBQVNrRCxtQkFBVCxDQUE2QlksTUFBN0IsRUFBcUNkLEtBQXJDLENBQTJDekIsT0FBTyxDQUFDQyxHQUFuRCxDOzs7QUFFQTZCLGdCQUFBQSxLLEdBQVEsS0FBS3JELEdBQUwsQ0FBU2lDLGdCOztBQUV2QixvQkFBSSxLQUFLSixXQUFULEVBQXNCO0FBQ3BCLHVCQUFLSixJQUFMLENBQVVNLElBQUksQ0FBQ0MsU0FBTCxDQUFlcUIsS0FBZixDQUFWLEVBQWlDLFFBQWpDO0FBQ0QsaUJBRkQsTUFFTyxJQUFJOUMsT0FBTyxJQUFJOEMsS0FBZixFQUFzQjtBQUMzQix1QkFBS3ZELE1BQUwsQ0FBWXVELEtBQVo7QUFDRDs7QUFFRCxxQkFBS0MsV0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUdXTCxHOzs7OzsrQkFDSEEsR0FBRyxDQUFDZixJO2tEQUNMLE8sd0JBR0EsUSx3QkFHQSxXOzs7O0FBTEgscUJBQUs2QixVQUFMLENBQWdCZCxHQUFoQjs7OztBQUdBLHFCQUFLZSxTQUFMLENBQWVmLEdBQWY7Ozs7O3VCQUdNLEtBQUtqRCxHQUFMLENBQ0hpRSxlQURHLENBQ2EsSUFBSUMscUJBQUosQ0FBb0JqQixHQUFHLENBQUNkLEdBQXhCLENBRGIsRUFFSGEsS0FGRyxDQUVHekIsT0FBTyxDQUFDQyxHQUZYLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQ0FPY2UsSyxFQUFlO0FBQ3ZDLFVBQUksQ0FBQzRCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUt6RSxZQUFqQixFQUErQjBFLFFBQS9CLENBQXdDOUIsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxZQUFJO0FBQ0YsY0FBTStCLEVBQUUsR0FBRyxLQUFLdEUsR0FBTCxDQUFTdUUsaUJBQVQsQ0FBMkJoQyxLQUEzQixDQUFYO0FBQ0EsZUFBS0MsaUJBQUwsQ0FBdUI4QixFQUF2QjtBQUNBLGVBQUszRSxZQUFMLENBQWtCNEMsS0FBbEIsSUFBMkIrQixFQUEzQjtBQUNELFNBSkQsQ0FJRSxPQUFPRSxHQUFQLEVBQVksQ0FBRTtBQUNqQjtBQUNGOzs7c0NBRXlCbEMsTyxFQUF5QjtBQUFBOztBQUNqREEsTUFBQUEsT0FBTyxDQUFDbUMsTUFBUixHQUFpQixZQUFNO0FBQ3JCLFlBQUksQ0FBQyxNQUFJLENBQUM1QyxXQUFWLEVBQXVCO0FBQ3JCLFVBQUEsTUFBSSxDQUFDQSxXQUFMLEdBQW1CLElBQW5COztBQUNBLFVBQUEsTUFBSSxDQUFDakMsT0FBTDtBQUNEO0FBQ0YsT0FMRDs7QUFNQSxVQUFJO0FBQ0YwQyxRQUFBQSxPQUFPLENBQUNvQyxTQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQ0FBb0Isa0JBQU1DLEtBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0JBQ2JBLEtBRGE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFHbEIsd0JBQUlyQyxPQUFPLENBQUNDLEtBQVIsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUJoQixzQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksUUFBWixFQUFzQjtBQUFFbUQsd0JBQUFBLEtBQUssRUFBTEE7QUFBRix1QkFBdEI7QUFDTTFCLHNCQUFBQSxHQUZ3QixHQUVsQmxCLElBQUksQ0FBQzZDLEtBQUwsQ0FBV0QsS0FBSyxDQUFDRSxJQUFqQixDQUZrQjs7QUFHOUIsc0JBQUEsTUFBSSxDQUFDQyxNQUFMLENBQVk3QixHQUFaO0FBQ0QscUJBSkQsTUFJTyxJQUFJWCxPQUFPLENBQUNDLEtBQVIsS0FBa0IsTUFBdEIsRUFBOEI7QUFDbkMsMEJBQUlvQyxLQUFLLENBQUNFLElBQU4sS0FBZSxNQUFuQixFQUEyQixNQUFJLENBQUNwRCxJQUFMLENBQVUsTUFBVixFQUFrQixNQUFsQixFQUEzQixLQUNLLElBQUksTUFBSSxDQUFDTCxXQUFULEVBQXNCTyxZQUFZLENBQUMsTUFBSSxDQUFDUCxXQUFOLENBQVo7QUFDNUIscUJBSE0sTUFHQTtBQUNMLHNCQUFBLE1BQUksQ0FBQzJELE1BQUwsQ0FBWS9ELE1BQVosQ0FBbUI7QUFDakJ1Qix3QkFBQUEsS0FBSyxFQUFFRCxPQUFPLENBQUNDLEtBREU7QUFFakJzQyx3QkFBQUEsSUFBSSxFQUFFRixLQUFLLENBQUNFLElBRks7QUFHakJwRix3QkFBQUEsTUFBTSxFQUFFLE1BQUksQ0FBQ0E7QUFISSx1QkFBbkI7QUFLRDs7QUFoQmlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXBCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JELE9BbkJELENBbUJFLE9BQU9pQyxLQUFQLEVBQWMsQ0FBRTs7QUFDbEJZLE1BQUFBLE9BQU8sQ0FBQzBDLE9BQVIsR0FBa0IsVUFBQTdCLEdBQUcsRUFBSSxDQUFFLENBQTNCOztBQUNBYixNQUFBQSxPQUFPLENBQUMyQyxPQUFSLEdBQWtCLFlBQU0sQ0FBRSxDQUExQjtBQUNEOzs7eUJBRUlKLEksRUFBV3RDLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzRCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUt6RSxZQUFqQixFQUErQjBFLFFBQS9CLENBQXdDOUIsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLTSxpQkFBTCxDQUF1Qk4sS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBSzVDLFlBQUwsQ0FBa0I0QyxLQUFsQixFQUF5QmQsSUFBekIsQ0FBOEJvRCxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPbkQsS0FBUCxFQUFjLENBQUU7QUFDbkI7Ozs2QkFFUXRCLEssRUFBeUJWLE0sRUFBcUI7QUFDckQsV0FBS00sR0FBTCxDQUFTSyxRQUFULENBQWtCRCxLQUFsQixFQUF5QlYsTUFBekI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7XG4gIFJUQ1BlZXJDb25uZWN0aW9uLFxuICBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gIFJUQ0ljZUNhbmRpZGF0ZVxufSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCIuL3V0aWxsL2V2ZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW46IGJvb2xlYW47XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIG5vZGVJZDogc3RyaW5nO1xuICB0cmlja2xlOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogb2JqZWN0KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBvbkRhdGEgPSBuZXcgRXZlbnQ8bWVzc2FnZT4oKTtcbiAgb25BZGRUcmFjayA9IG5ldyBFdmVudDxNZWRpYVN0cmVhbT4oKTtcblxuICBwcml2YXRlIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuXG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICBpc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICBpc09mZmVyID0gZmFsc2U7XG5cbiAgcmVtb3RlU3RyZWFtOiBNZWRpYVN0cmVhbSB8IHVuZGVmaW5lZDtcbiAgdGltZW91dFBpbmc6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHQ6IFBhcnRpYWw8b3B0aW9uPiA9IHt9KSB7XG4gICAgY29uc3QgeyBub2RlSWQsIHN0cmVhbSB9ID0gb3B0O1xuXG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gXyA9PiB7fTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuXG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgeyBkaXNhYmxlX3N0dW4sIHRyaWNrbGUgfSA9IHRoaXMub3B0O1xuXG4gICAgY29uc3QgcGVlcjogUlRDUGVlckNvbm5lY3Rpb24gPSBkaXNhYmxlX3N0dW5cbiAgICAgID8gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgICB9KVxuICAgICAgOiBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgdGhpcy5vbkFkZFRyYWNrLmV4Y3V0ZShzdHJlYW0pO1xuICAgICAgdGhpcy5yZW1vdGVTdHJlYW0gPSBzdHJlYW07XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRQaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgICAgICAgICB9LCA1MDAwKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwaW5nXCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKFwicGluZ1wiLCBcImxpdmVcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgZXJyb3IgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3RlZFwiKTtcbiAgICAgICAgICBpZiAodGhpcy50aW1lb3V0UGluZykgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFBpbmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZWRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgICB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbiksIFwidXBkYXRlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICAgIGlmICh0cmlja2xlKSB7XG4gICAgICAgICAgICB0aGlzLnNpZ25hbCh7IHR5cGU6IFwiY2FuZGlkYXRlXCIsIGljZTogZXZ0LmNhbmRpZGF0ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0cmlja2xlICYmIHBlZXIubG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHt9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBoYW5nVXAoKSB7XG4gICAgY29uc29sZS5sb2coXCJoYW5ndXBcIik7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgbWFrZU9mZmVyKCkge1xuICAgIHRoaXMuaXNPZmZlciA9IHRydWU7XG4gICAgY29uc3QgeyB0cmlja2xlIH0gPSB0aGlzLm9wdDtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG5cbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc2RwID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICAgIGlmICghc2RwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucnRjXG4gICAgICAgIC5zZXRMb2NhbERlc2NyaXB0aW9uKHNkcClcbiAgICAgICAgLmNhdGNoKGVyciA9PiBKU09OLnN0cmluZ2lmeShlcnIpICsgXCJlcnJcIik7XG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcblxuICAgICAgaWYgKHRyaWNrbGUgJiYgbG9jYWwpIHtcbiAgICAgICAgdGhpcy5zaWduYWwobG9jYWwpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5lZ290aWF0aW9uKCk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbmVnb3RpYXRpb24oKSB7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jIGV2ID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0ge307XG4gICAgICBjb25zdCBzZXNzaW9uRGVzY3JpcHRpb24gPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcihvcHRpb25zKS5jYXRjaCgpO1xuICAgICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihzZXNzaW9uRGVzY3JpcHRpb24pLmNhdGNoKCk7XG4gICAgICBjb25zdCBsb2NhbCA9IHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb247XG4gICAgICBpZiAobG9jYWwpIHtcbiAgICAgICAgdGhpcy5zZW5kKEpTT04uc3RyaW5naWZ5KGxvY2FsKSwgXCJ1cGRhdGVcIik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0QW5zd2VyKHNkcDogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNPZmZlcikge1xuICAgICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIob2ZmZXI6IGFueSkge1xuICAgIGNvbnN0IHsgdHJpY2tsZSB9ID0gdGhpcy5vcHQ7XG5cbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24ob2ZmZXIpKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoIWFuc3dlcikge1xuICAgICAgY29uc29sZS5sb2coXCJubyBhbnN3ZXJcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGxvY2FsID0gdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbjtcblxuICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkobG9jYWwpLCBcInVwZGF0ZVwiKTtcbiAgICB9IGVsc2UgaWYgKHRyaWNrbGUgJiYgbG9jYWwpIHtcbiAgICAgIHRoaXMuc2lnbmFsKGxvY2FsKTtcbiAgICB9XG5cbiAgICB0aGlzLm5lZ290aWF0aW9uKCk7XG4gIH1cblxuICBhc3luYyBzZXRTZHAoc2RwOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHNkcC50eXBlKSB7XG4gICAgICBjYXNlIFwib2ZmZXJcIjpcbiAgICAgICAgdGhpcy5tYWtlQW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFuc3dlclwiOlxuICAgICAgICB0aGlzLnNldEFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgICAgICAuYWRkSWNlQ2FuZGlkYXRlKG5ldyBSVENJY2VDYW5kaWRhdGUoc2RwLmljZSkpXG4gICAgICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgICAgfSBjYXRjaCAoZGNlKSB7fVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBhc3luYyBldmVudCA9PiB7XG4gICAgICAgIGlmICghZXZlbnQpIHJldHVybjtcblxuICAgICAgICBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJ1cGRhdGVcIikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlXCIsIHsgZXZlbnQgfSk7XG4gICAgICAgICAgY29uc3Qgc2RwID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB0aGlzLnNldFNkcChzZHApO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYW5uZWwubGFiZWwgPT09IFwibGl2ZVwiKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT09IFwicGluZ1wiKSB0aGlzLnNlbmQoXCJwb25nXCIsIFwibGl2ZVwiKTtcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLnRpbWVvdXRQaW5nKSBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0UGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkRhdGEuZXhjdXRlKHtcbiAgICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge307XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge307XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gIH1cblxuICBhZGRUcmFjayh0cmFjazogTWVkaWFTdHJlYW1UcmFjaywgc3RyZWFtOiBNZWRpYVN0cmVhbSkge1xuICAgIHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pO1xuICB9XG59XG4iXX0=