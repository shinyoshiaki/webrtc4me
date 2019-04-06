"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wrtc = require("wrtc");

var _event = _interopRequireDefault(require("./lib/event"));

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
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebRTC);

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
      var _this = this;

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
          if (_this.opt.trickle) {
            _this.signal({
              type: "candidate",
              ice: evt.candidate
            });
          }
        } else {
          if (!_this.opt.trickle && peer.localDescription) {
            _this.signal(peer.localDescription);
          }
        }
      };

      peer.oniceconnectionstatechange = function () {
        switch (peer.iceConnectionState) {
          case "failed":
            _this.hangUp();

            break;

          case "disconnected":
            _this.hangUp();

            break;

          case "connected":
            _this.negotiating = false;
            break;

          case "closed":
            break;

          case "completed":
            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this.dataChannels[dataChannel.label] = dataChannel;

        _this.dataChannelEvents(dataChannel);
      };

      peer.onsignalingstatechange = function (e) {};

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];

        _this.onAddTrack.excute(stream);
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
      var _this2 = this;

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
                if (!_this2.negotiating) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this2.negotiating = true;
                _context.next = 5;
                return _this2.rtc.createOffer().catch(console.log);

              case 5:
                offer = _context.sent;

                if (offer) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return");

              case 8:
                _context.next = 10;
                return _this2.rtc.setLocalDescription(offer).catch(console.log);

              case 10:
                if (_this2.opt.trickle && _this2.rtc.localDescription) {
                  _this2.signal(_this2.rtc.localDescription);
                }

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
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
      var _this3 = this;

      channel.onopen = function () {
        if (!_this3.isConnected) {
          _this3.connect();

          _this3.isConnected = true;
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
                    _this3.onData.excute({
                      label: channel.label,
                      data: event.data,
                      nodeId: _this3.nodeId
                    });

                  case 3:
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
      } catch (error) {}

      channel.onerror = function (err) {};

      channel.onclose = function () {
        _this3.hangUp();
      };
    }
  }, {
    key: "addStream",
    value: function addStream() {
      var _this4 = this;

      if (this.opt.stream) {
        var _stream = this.opt.stream;

        _stream.getTracks().forEach(function (track) {
          return _this4.rtc.addTrack(track, _stream);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJFdmVudCIsImRhdGFDaGFubmVscyIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJhZGRTdHJlYW0iLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsIm9uaWNlY2FuZGlkYXRlIiwiZXZ0IiwiY2FuZGlkYXRlIiwidHJpY2tsZSIsInR5cGUiLCJpY2UiLCJsb2NhbERlc2NyaXB0aW9uIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJoYW5nVXAiLCJuZWdvdGlhdGluZyIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJvbnRyYWNrIiwic3RyZWFtIiwic3RyZWFtcyIsIm9uQWRkVHJhY2siLCJleGN1dGUiLCJpc0Rpc2Nvbm5lY3RlZCIsImlzQ29ubmVjdGVkIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImV2ZW50Iiwib25EYXRhIiwiZGF0YSIsImVycm9yIiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJnZXRUcmFja3MiLCJmb3JFYWNoIiwidHJhY2siLCJhZGRUcmFjayIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwiaXNNYWRlQW5zd2VyIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwibWFrZUFuc3dlciIsInNldEFuc3dlciIsImFkZEljZUNhbmRpZGF0ZSIsIlJUQ0ljZUNhbmRpZGF0ZSIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7OztBQU5BQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFxQnFCQyxNOzs7QUFvQm5CLG9CQUF1QztBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLG9DQWQ5QixJQUFJQyxjQUFKLEVBYzhCOztBQUFBLHdDQWIxQixJQUFJQSxjQUFKLEVBYTBCOztBQUFBOztBQUFBOztBQUFBLHlDQVJ6QixLQVF5Qjs7QUFBQSw0Q0FQdEIsS0FPc0I7O0FBQUEscUNBTjdCLEtBTTZCOztBQUFBLDBDQUx4QixLQUt3Qjs7QUFBQSx5Q0FKekIsS0FJeUI7O0FBQUE7O0FBQ3JDLFNBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtFLFlBQUwsR0FBb0IsRUFBcEI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsS0FBS0gsR0FBTCxDQUFTRyxNQUFULElBQW1CLE1BQWpDOztBQUVBLFNBQUtDLE9BQUwsR0FBZSxZQUFNLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixZQUFNLENBQUUsQ0FBMUI7O0FBQ0EsU0FBS0MsTUFBTCxHQUFjLFVBQUFDLEdBQUcsRUFBSSxDQUFFLENBQXZCOztBQUVBLFNBQUtDLEdBQUwsR0FBVyxLQUFLQyxvQkFBTCxFQUFYO0FBQ0EsU0FBS0MsU0FBTDtBQUNEOzs7OzJDQUU4QjtBQUFBOztBQUM3QixVQUFJQyxJQUFKO0FBQ0EsVUFBSSxLQUFLWCxHQUFMLENBQVNHLE1BQWIsRUFBcUIsS0FBS0EsTUFBTCxHQUFjLEtBQUtILEdBQUwsQ0FBU0csTUFBdkI7O0FBQ3JCLFVBQUksS0FBS0gsR0FBTCxDQUFTWSxZ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LGFBQUttQixpQkFBTCxDQUF1Qm5CLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUs1QixZQUFMLENBQWtCNEIsS0FBbEIsRUFBeUJnRCxJQUF6QixDQUE4QnJCLElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU9DLEtBQVAsRUFBYztBQUNkLGFBQUtqQyxNQUFMO0FBQ0Q7QUFDRjs7OytCQUVVdEIsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7XG4gIFJUQ1BlZXJDb25uZWN0aW9uLFxuICBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gIFJUQ0ljZUNhbmRpZGF0ZVxufSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCIuL2xpYi9ldmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBub2RlSWQ6IHN0cmluZztcbiAgdHJpY2tsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IG9iamVjdCkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgb25EYXRhID0gbmV3IEV2ZW50PG1lc3NhZ2U+KCk7XG4gIG9uQWRkVHJhY2sgPSBuZXcgRXZlbnQ8TWVkaWFTdHJlYW0+KCk7XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgaXNPZmZlciA9IGZhbHNlO1xuICBpc01hZGVBbnN3ZXIgPSBmYWxzZTtcbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcblxuICBvcHQ6IFBhcnRpYWw8b3B0aW9uPjtcblxuICBjb25zdHJ1Y3RvcihvcHQ6IFBhcnRpYWw8b3B0aW9uPiA9IHt9KSB7XG4gICAgdGhpcy5vcHQgPSBvcHQ7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuXG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5hZGRTdHJlYW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmICh0aGlzLm9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gdGhpcy5vcHQubm9kZUlkO1xuICAgIGlmICh0aGlzLm9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsczogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKGV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0LnRyaWNrbGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbCh7IHR5cGU6IFwiY2FuZGlkYXRlXCIsIGljZTogZXZ0LmNhbmRpZGF0ZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdC50cmlja2xlICYmIHBlZXIubG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHt9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgdGhpcy5vbkFkZFRyYWNrLmV4Y3V0ZShzdHJlYW0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZ1VwKCkge1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIG1ha2VPZmZlcigpIHtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHJldHVybjtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICghb2ZmZXIpIHJldHVybjtcbiAgICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlICYmIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm9uRGF0YS5leGN1dGUoe1xuICAgICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHt9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLm9wdC5zdHJlYW0pIHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRoaXMucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSkge1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSkge1xuICAgIGlmICh0aGlzLmlzTWFkZUFuc3dlcikgcmV0dXJuO1xuICAgIHRoaXMuaXNNYWRlQW5zd2VyID0gdHJ1ZTtcblxuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoIWFuc3dlcikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgbG9jYWxEZXNjcmlwdGlvbiA9IHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb247XG4gICAgaWYgKHRoaXMub3B0LnRyaWNrbGUgJiYgbG9jYWxEZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zaWduYWwobG9jYWxEZXNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgc2V0U2RwKHNkcDogYW55KSB7XG4gICAgc3dpdGNoIChzZHAudHlwZSkge1xuICAgICAgY2FzZSBcIm9mZmVyXCI6XG4gICAgICAgIHRoaXMubWFrZUFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcbiAgICAgICAgdGhpcy5zZXRBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2FuZGlkYXRlXCI6XG4gICAgICAgIHRoaXMucnRjLmFkZEljZUNhbmRpZGF0ZShuZXcgUlRDSWNlQ2FuZGlkYXRlKHNkcC5pY2UpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCBcImRhdGFjaGFubmVsXCI7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19