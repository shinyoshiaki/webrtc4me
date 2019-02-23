"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wrtc = require("wrtc");

var _rxjs = require("rxjs");

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

    _defineProperty(this, "subjOnData", new _rxjs.Subject());

    _defineProperty(this, "onData", this.subjOnData.asObservable());

    _defineProperty(this, "subjOnAddTrack", new _rxjs.Subject());

    _defineProperty(this, "onAddTrack", this.subjOnAddTrack.asObservable());

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

        _this.subjOnAddTrack.next(stream);
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
                    _this3.subjOnData.next({
                      label: channel.label,
                      data: event.data,
                      nodeId: _this3.nodeId
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXZWJSVEMiLCJvcHQiLCJTdWJqZWN0Iiwic3Viak9uRGF0YSIsImFzT2JzZXJ2YWJsZSIsInN1YmpPbkFkZFRyYWNrIiwiZGF0YUNoYW5uZWxzIiwibm9kZUlkIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJydGMiLCJwcmVwYXJlTmV3Q29ubmVjdGlvbiIsImFkZFN0cmVhbSIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwib25pY2VjYW5kaWRhdGUiLCJldnQiLCJjYW5kaWRhdGUiLCJ0cmlja2xlIiwidHlwZSIsImljZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsImhhbmdVcCIsIm5lZ290aWF0aW5nIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnNpZ25hbGluZ3N0YXRlY2hhbmdlIiwiZSIsIm9udHJhY2siLCJzdHJlYW0iLCJzdHJlYW1zIiwibmV4dCIsImlzRGlzY29ubmVjdGVkIiwiaXNDb25uZWN0ZWQiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJvZmZlciIsInNldExvY2FsRGVzY3JpcHRpb24iLCJpc09mZmVyIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZXZlbnQiLCJkYXRhIiwiZXJyb3IiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImdldFRyYWNrcyIsImZvckVhY2giLCJ0cmFjayIsImFkZFRyYWNrIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJpc01hZGVBbnN3ZXIiLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJtYWtlQW5zd2VyIiwic2V0QW5zd2VyIiwiYWRkSWNlQ2FuZGlkYXRlIiwiUlRDSWNlQ2FuZGlkYXRlIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUtBOzs7Ozs7Ozs7Ozs7OztBQU5BQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFxQnFCQyxNOzs7QUFzQm5CLG9CQUF1QztBQUFBLFFBQTNCQyxHQUEyQix1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLHdDQWhCbEIsSUFBSUMsYUFBSixFQWdCa0I7O0FBQUEsb0NBZjlCLEtBQUtDLFVBQUwsQ0FBZ0JDLFlBQWhCLEVBZThCOztBQUFBLDRDQWRkLElBQUlGLGFBQUosRUFjYzs7QUFBQSx3Q0FiMUIsS0FBS0csY0FBTCxDQUFvQkQsWUFBcEIsRUFhMEI7O0FBQUE7O0FBQUE7O0FBQUEseUNBUnpCLEtBUXlCOztBQUFBLDRDQVB0QixLQU9zQjs7QUFBQSxxQ0FON0IsS0FNNkI7O0FBQUEsMENBTHhCLEtBS3dCOztBQUFBLHlDQUp6QixLQUl5Qjs7QUFBQTs7QUFDckMsU0FBS0gsR0FBTCxHQUFXQSxHQUFYO0FBQ0EsU0FBS0ssWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxLQUFLTixHQUFMLENBQVNNLE1BQVQsSUFBbUIsTUFBakM7O0FBRUEsU0FBS0MsT0FBTCxHQUFlLFlBQU0sQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLFlBQU0sQ0FBRSxDQUExQjs7QUFDQSxTQUFLQyxNQUFMLEdBQWMsVUFBQUMsR0FBRyxFQUFJLENBQUUsQ0FBdkI7O0FBRUEsU0FBS0MsR0FBTCxHQUFXLEtBQUtDLG9CQUFMLEVBQVg7QUFDQSxTQUFLQyxTQUFMO0FBQ0Q7Ozs7MkNBRThCO0FBQUE7O0FBQzdCLFVBQUlDLElBQUo7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V0Q7Ozt5QkFFSWtDLEksRUFBV3pCLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUt4RSxZQUFqQixFQUErQnlFLFFBQS9CLENBQXdDN0MsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLa0IsaUJBQUwsQ0FBdUJsQixLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLNUIsWUFBTCxDQUFrQjRCLEtBQWxCLEVBQXlCOEMsSUFBekIsQ0FBOEJyQixJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPQyxLQUFQLEVBQWM7QUFDZCxhQUFLL0IsTUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVXRCLE0sRUFBZ0I7QUFDekIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQge1xuICBSVENQZWVyQ29ubmVjdGlvbixcbiAgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uLFxuICBSVENJY2VDYW5kaWRhdGVcbn0gZnJvbSBcIndydGNcIjtcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIG1lc3NhZ2Uge1xuICBsYWJlbDogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuOiBib29sZWFuO1xuICBzdHJlYW06IE1lZGlhU3RyZWFtO1xuICBub2RlSWQ6IHN0cmluZztcbiAgdHJpY2tsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IG9iamVjdCkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBzdWJqT25EYXRhID0gbmV3IFN1YmplY3Q8bWVzc2FnZT4oKTtcbiAgb25EYXRhID0gdGhpcy5zdWJqT25EYXRhLmFzT2JzZXJ2YWJsZSgpO1xuICBwcml2YXRlIHN1YmpPbkFkZFRyYWNrID0gbmV3IFN1YmplY3Q8TWVkaWFTdHJlYW0+KCk7XG4gIG9uQWRkVHJhY2sgPSB0aGlzLnN1YmpPbkFkZFRyYWNrLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxzOiB7IFtrZXk6IHN0cmluZ106IFJUQ0RhdGFDaGFubmVsIH07XG5cbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIGlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgaXNNYWRlQW5zd2VyID0gZmFsc2U7XG4gIG5lZ290aWF0aW5nID0gZmFsc2U7XG5cbiAgb3B0OiBQYXJ0aWFsPG9wdGlvbj47XG5cbiAgY29uc3RydWN0b3Iob3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKCkge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAodGhpcy5vcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZDtcbiAgICBpZiAodGhpcy5vcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFwic3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMlwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmIChldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwoeyB0eXBlOiBcImNhbmRpZGF0ZVwiLCBpY2U6IGV2dC5jYW5kaWRhdGUgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5vcHQudHJpY2tsZSAmJiBwZWVyLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gZSA9PiB7fTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIHRoaXMuc3Viak9uQWRkVHJhY2submV4dChzdHJlYW0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZ1VwKCkge1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIG1ha2VPZmZlcigpIHtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHJldHVybjtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICghb2ZmZXIpIHJldHVybjtcbiAgICAgIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlICYmIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5zaWduYWwodGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7fVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN1YmpPbkRhdGEubmV4dCh7XG4gICAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJ3ZWJydGNcIikge1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7fTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFkZFN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5vcHQuc3RyZWFtKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLm9wdC5zdHJlYW07XG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0aGlzLnJ0Yy5hZGRUcmFjayh0cmFjaywgc3RyZWFtKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXRBbnN3ZXIoc2RwOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1ha2VBbnN3ZXIoc2RwOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc01hZGVBbnN3ZXIpIHJldHVybjtcbiAgICB0aGlzLmlzTWFkZUFuc3dlciA9IHRydWU7XG5cbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKCFhbnN3ZXIpIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGxvY2FsRGVzY3JpcHRpb24gPSB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uO1xuICAgIGlmICh0aGlzLm9wdC50cmlja2xlICYmIGxvY2FsRGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc2lnbmFsKGxvY2FsRGVzY3JpcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHNldFNkcChzZHA6IGFueSkge1xuICAgIHN3aXRjaCAoc2RwLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJvZmZlclwiOlxuICAgICAgICB0aGlzLm1ha2VBbnN3ZXIoc2RwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYW5zd2VyXCI6XG4gICAgICAgIHRoaXMuc2V0QW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNhbmRpZGF0ZVwiOlxuICAgICAgICB0aGlzLnJ0Yy5hZGRJY2VDYW5kaWRhdGUobmV3IFJUQ0ljZUNhbmRpZGF0ZShzZHAuaWNlKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==