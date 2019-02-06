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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmlja2xlLnRzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJleGN1dGVFdmVudCIsImV2IiwidiIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiZnVuYyIsImFkZEV2ZW50IiwiZXZlbnQiLCJfdGFnIiwidGFnIiwiZ2VuIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiaW5jbHVkZXMiLCJjb25zb2xlIiwiZXJyb3IiLCJXZWJSVEMiLCJvcHQiLCJvbkRhdGEiLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwibm9kZUlkIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsIm9uaWNlY2FuZGlkYXRlIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsInRyaWNrbGUiLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsImhhbmdVcCIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib25zaWduYWxpbmdzdGF0ZWNoYW5nZSIsImUiLCJuZWdvdGlhdGluZyIsInNpZ25hbGluZ1N0YXRlIiwib250cmFjayIsInN0cmVhbSIsInN0cmVhbXMiLCJhZGRTdHJlYW0iLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwid2FybiIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJsb2ciLCJvZmZlciIsInNldExvY2FsRGVzY3JpcHRpb24iLCJpc09mZmVyIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZGF0YSIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwiZ2V0VHJhY2tzIiwidHJhY2siLCJhZGRUcmFjayIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwiaXNNYWRlQW5zd2VyIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwidHlwZSIsIm1ha2VBbnN3ZXIiLCJzZXRBbnN3ZXIiLCJhZGRJY2VDYW5kaWRhdGUiLCJzZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBOEJPLFNBQVNDLFdBQVQsQ0FBcUJDLEVBQXJCLEVBQWdDQyxDQUFoQyxFQUF5QztBQUM5Q0MsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlILEVBQVosRUFBZ0JJLE9BQWhCLENBQXdCLFVBQUFDLEdBQUcsRUFBSTtBQUM3QixRQUFNQyxJQUFTLEdBQUdOLEVBQUUsQ0FBQ0ssR0FBRCxDQUFwQjs7QUFDQSxRQUFJSixDQUFKLEVBQU87QUFDTEssTUFBQUEsSUFBSSxDQUFDTCxDQUFELENBQUo7QUFDRCxLQUZELE1BRU87QUFDTEssTUFBQUEsSUFBSTtBQUNMO0FBQ0YsR0FQRDtBQVFEOztBQUVNLFNBQVNDLFFBQVQsQ0FDTEMsS0FESyxFQUVMRixJQUZLLEVBR0xHLElBSEssRUFJTDtBQUNBLE1BQU1DLEdBQUcsR0FDUEQsSUFBSSxJQUNILFlBQU07QUFDTCxRQUFJRSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsTUFBTCxHQUFjQyxRQUFkLEVBQVY7O0FBQ0EsV0FBT1osTUFBTSxDQUFDQyxJQUFQLENBQVlLLEtBQVosRUFBbUJPLFFBQW5CLENBQTRCSixHQUE1QixDQUFQLEVBQXlDO0FBQ3ZDQSxNQUFBQSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsTUFBTCxHQUFjQyxRQUFkLEVBQU47QUFDRDs7QUFDRCxXQUFPSCxHQUFQO0FBQ0QsR0FORCxFQUZGOztBQVNBLE1BQUlULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZ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LEcsRUFBVTtBQUNmLGNBQVFBLEdBQUcsQ0FBQ3FELElBQVo7QUFDRSxhQUFLLE9BQUw7QUFDRSxlQUFLQyxVQUFMLENBQWdCdEQsR0FBaEI7QUFDQTs7QUFDRixhQUFLLFFBQUw7QUFDRSxlQUFLdUQsU0FBTCxDQUFldkQsR0FBZjtBQUNBOztBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUtULEdBQUwsQ0FBU2lFLGVBQVQsQ0FBeUJ4RCxHQUF6QjtBQUNBO0FBVEo7QUFXRDs7O3lCQUVJeUMsSSxFQUFXeEIsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDOUMsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS3FCLFlBQWpCLEVBQStCVCxRQUEvQixDQUF3Q2lDLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS2tCLGlCQUFMLENBQXVCbEIsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBS3hCLFlBQUwsQ0FBa0J3QixLQUFsQixFQUF5QndDLElBQXpCLENBQThCaEIsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT3ZELEtBQVAsRUFBYztBQUNkLGFBQUsyQixNQUFMO0FBQ0Q7QUFDRjs7OytCQUVVakIsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IHtcbiAgUlRDUGVlckNvbm5lY3Rpb24sXG4gIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbixcbiAgUlRDSWNlQ2FuZGlkYXRlXG59IGZyb20gXCJ3cnRjXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW46IGJvb2xlYW47XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIG5vZGVJZDogc3RyaW5nO1xuICB0cmlja2xlOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YSB7XG4gIFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG59XG5pbnRlcmZhY2UgT25BZGRUcmFjayB7XG4gIFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xufVxuXG50eXBlIEV2ZW50ID0gT25EYXRhIHwgT25BZGRUcmFjaztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBFdmVudCwgdj86IGFueSkge1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IGZ1bmM6IGFueSA9IGV2W2tleV07XG4gICAgaWYgKHYpIHtcbiAgICAgIGZ1bmModik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQ8VCBleHRlbmRzIEV2ZW50PihcbiAgZXZlbnQ6IFQsXG4gIGZ1bmM6IFRba2V5b2YgVF0sXG4gIF90YWc/OiBzdHJpbmdcbikge1xuICBjb25zdCB0YWcgPVxuICAgIF90YWcgfHxcbiAgICAoKCkgPT4ge1xuICAgICAgbGV0IGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXMoZ2VuKSkge1xuICAgICAgICBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuO1xuICAgIH0pKCk7XG4gIGlmIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXModGFnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpbmNsdWRlIHRhZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudFt0YWddID0gZnVuYztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogb2JqZWN0KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogT25EYXRhID0ge307XG4gIGFkZE9uRGF0YSA9IChmdW5jOiBPbkRhdGFba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25EYXRhPih0aGlzLm9uRGF0YSwgZnVuYywgdGFnKTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiBPbkFkZFRyYWNrID0ge307XG4gIGFkZE9uQWRkVHJhY2sgPSAoZnVuYzogT25BZGRUcmFja1trZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkFkZFRyYWNrPih0aGlzLm9uQWRkVHJhY2ssIGZ1bmMsIHRhZyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuXG4gIG9wdDogUGFydGlhbDxvcHRpb24+O1xuXG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgaXNNYWRlQW5zd2VyID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob3B0OiBQYXJ0aWFsPG9wdGlvbj4gPSB7fSkge1xuICAgIHRoaXMub3B0ID0gb3B0O1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTmV3Q29ubmVjdGlvbigpIHtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKHRoaXMub3B0Lm5vZGVJZCkgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQ7XG4gICAgaWYgKHRoaXMub3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxzOiBcInN0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDJcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKHBlZXIubG9jYWxEZXNjcmlwdGlvbiAmJiAhdGhpcy5vcHQudHJpY2tsZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm9wdC50cmlja2xlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwoZXZ0LmNhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBwZWVyLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCI7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBoYW5nVXAoKSB7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgbWFrZU9mZmVyKCkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG5cbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZHVwbGlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24gJiYgdGhpcy5vcHQudHJpY2tsZSkge1xuICAgICAgICB0aGlzLnNpZ25hbCh0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuaXNPZmZlciA9IHRydWU7XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHt9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwub25tZXNzYWdlID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm47XG4gICAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJ3ZWJydGNcIikge1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7fTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmdVcCgpO1xuICAgIH07XG4gIH1cblxuICBhZGRTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMub3B0LnN0cmVhbSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy5vcHQuc3RyZWFtO1xuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdGhpcy5ydGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0QW5zd2VyKHNkcDogYW55LCBub2RlSWQ/OiBzdHJpbmcpIHtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCB0aGlzLm5vZGVJZDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSkge1xuICAgIGlmICh0aGlzLmlzTWFkZUFuc3dlcikgcmV0dXJuO1xuICAgIHRoaXMuaXNNYWRlQW5zd2VyID0gdHJ1ZTtcblxuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG5cbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAodGhpcy5vcHQudHJpY2tsZSAmJiB0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNpZ25hbCh0aGlzLnJ0Yy5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzZXRTZHAoc2RwOiBhbnkpIHtcbiAgICBzd2l0Y2ggKHNkcC50eXBlKSB7XG4gICAgICBjYXNlIFwib2ZmZXJcIjpcbiAgICAgICAgdGhpcy5tYWtlQW5zd2VyKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFuc3dlclwiOlxuICAgICAgICB0aGlzLnNldEFuc3dlcihzZHApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgdGhpcy5ydGMuYWRkSWNlQ2FuZGlkYXRlKHNkcCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5nVXAoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==