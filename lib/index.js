"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excuteEvent = excuteEvent;
exports.addEvent = addEvent;
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    _defineProperty(this, "negotiating", false);

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
        peer = new RTCPeerConnection({
          iceServers: []
        });
      } else {
        peer = new RTCPeerConnection({
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
            // console.log("webrtc4me disconnected");
            // this.isDisconnected = true;
            // this.isConnected = false;
            // this.disconnect();
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
                if (_this3.isConnected) {
                  _this3.send(JSON.stringify({
                    sdp: _this3.rtc.localDescription
                  }), "webrtc");
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

      try {
        channel.onmessage =
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(event) {
            var obj, create, local;
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

                    if (!(channel.label === "webrtc")) {
                      _context2.next = 27;
                      break;
                    }

                    obj = JSON.parse(event.data);
                    console.log({
                      obj: obj
                    });

                    if (!(!obj || !obj.sdp)) {
                      _context2.next = 8;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 8:
                    if (!(obj.sdp.type === "offer")) {
                      _context2.next = 24;
                      break;
                    }

                    console.log("debug offer", {
                      obj: obj
                    });
                    _context2.next = 12;
                    return _this4.rtc.setRemoteDescription(obj.sdp);

                  case 12:
                    _context2.next = 14;
                    return _this4.rtc.createAnswer().catch(console.warn);

                  case 14:
                    create = _context2.sent;

                    if (create) {
                      _context2.next = 17;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 17:
                    _context2.next = 19;
                    return _this4.rtc.setLocalDescription(create).catch(console.warn);

                  case 19:
                    local = _this4.rtc.localDescription;

                    if (local && !local.type) {
                      console.log({
                        local: local
                      });
                      local = new RTCSessionDescription({
                        type: "answer",
                        sdp: local.sdp
                      });
                    }

                    _this4.send(JSON.stringify({
                      sdp: _this4.rtc.localDescription
                    }), "webrtc");

                    _context2.next = 27;
                    break;

                  case 24:
                    console.log("debug answer", {
                      obj: obj
                    });
                    _context2.next = 27;
                    return _this4.rtc.setRemoteDescription(obj.sdp);

                  case 27:
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
        _this4.isDisconnected = true;

        _this4.disconnect();
      };
    }
  }, {
    key: "setAnswer",
    value: function setAnswer(sdp, nodeId) {
      this.rtc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.log);
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
                return this.rtc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.log);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJleGN1dGVFdmVudCIsImV2IiwidiIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiZXJyb3IiLCJXZWJSVEMiLCJvcHQiLCJvbkRhdGEiLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJzdHJlYW0iLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnNpZ25hbGluZ3N0YXRlY2hhbmdlIiwiZSIsIm5lZ290aWF0aW5nIiwic2lnbmFsaW5nU3RhdGUiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwid2FybiIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJvZmZlciIsInNldExvY2FsRGVzY3JpcHRpb24iLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJtZXNzYWdlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZGF0YSIsIm9iaiIsInBhcnNlIiwidHlwZSIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiY3JlYXRlQW5zd2VyIiwiY3JlYXRlIiwibG9jYWwiLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImFuc3dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JPLFNBQVNBLFdBQVQsQ0FBcUJDLEVBQXJCLEVBQWdDQyxDQUFoQyxFQUF5QztBQUM5Q0MsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWixFQUEyQjtBQUFFSCxJQUFBQSxFQUFFLEVBQUZBO0FBQUYsR0FBM0I7QUFDQUksRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlMLEVBQVosRUFBZ0JNLE9BQWhCLENBQXdCLFVBQUFDLEdBQUcsRUFBSTtBQUM3QixRQUFNQyxJQUFTLEdBQUdSLEVBQUUsQ0FBQ08sR0FBRCxDQUFwQjs7QUFDQSxRQUFJTixDQUFKLEVBQU87QUFDTE8sTUFBQUEsSUFBSSxDQUFDUCxDQUFELENBQUo7QUFDRCxLQUZELE1BRU87QUFDTE8sTUFBQUEsSUFBSTtBQUNMO0FBQ0YsR0FQRDtBQVFEOztBQUVNLFNBQVNDLFFBQVQsQ0FDTEMsS0FESyxFQUVMRixJQUZLLEVBR0xHLElBSEssRUFJTDtBQUNBLE1BQU1DLEdBQUcsR0FDUEQsSUFBSSxJQUNILFlBQU07QUFDTCxRQUFJRSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsTUFBTCxHQUFjQyxRQUFkLEVBQVY7O0FBQ0EsV0FBT1osTUFBTSxDQUFDQyxJQUFQLENBQVlLLEtBQVosRUFBbUJPLFFBQW5CLENBQTRCSixHQUE1QixDQUFQLEVBQXlDO0FBQ3ZDQSxNQUFBQSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsTUFBTCxHQUFjQyxRQUFkLEVBQU47QUFDRDs7QUFDRCxXQUFPSCxHQUFQO0FBQ0QsR0FORCxFQUZGOztBQVNBLE1BQUlULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkwsR0FBNUIsQ0FBSixFQUFzQztBQUNw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LE1BQTdCLEVBQXFDMUIsS0FBckMsQ0FBMkN2RCxPQUFPLENBQUNDLEdBQW5ELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZm9FLEksRUFBV3ZCLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzVDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtvQixZQUFqQixFQUErQlIsUUFBL0IsQ0FBd0MrQixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtnQixpQkFBTCxDQUF1QmhCLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt2QixZQUFMLENBQWtCdUIsS0FBbEIsRUFBeUJZLElBQXpCLENBQThCVyxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPckQsS0FBUCxFQUFjO0FBQ2RoQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCZSxLQUE3QjtBQUNBLGFBQUtTLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxhQUFLSyxVQUFMO0FBQ0Q7QUFDRjs7OytCQUVVSCxNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBtZXNzYWdlIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgZGF0YTogYW55O1xuICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIG9wdGlvbiB7XG4gIGRpc2FibGVfc3R1bj86IGJvb2xlYW47XG4gIG5vZGVJZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPbkRhdGEge1xuICBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkO1xufVxuaW50ZXJmYWNlIE9uQWRkVHJhY2sge1xuICBba2V5OiBzdHJpbmddOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcbn1cblxudHlwZSBFdmVudCA9IE9uRGF0YSB8IE9uQWRkVHJhY2s7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgY29uc29sZS5sb2coXCJleGN1dGVFdmVudFwiLCB7IGV2IH0pO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IGZ1bmM6IGFueSA9IGV2W2tleV07XG4gICAgaWYgKHYpIHtcbiAgICAgIGZ1bmModik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQ8VCBleHRlbmRzIEV2ZW50PihcbiAgZXZlbnQ6IFQsXG4gIGZ1bmM6IFRba2V5b2YgVF0sXG4gIF90YWc/OiBzdHJpbmdcbikge1xuICBjb25zdCB0YWcgPVxuICAgIF90YWcgfHxcbiAgICAoKCkgPT4ge1xuICAgICAgbGV0IGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXMoZ2VuKSkge1xuICAgICAgICBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuO1xuICAgIH0pKCk7XG4gIGlmIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXModGFnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpbmNsdWRlIHRhZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudFt0YWddID0gZnVuYztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogT25EYXRhID0ge307XG4gIGFkZE9uRGF0YSA9IChmdW5jOiBPbkRhdGFba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25EYXRhPih0aGlzLm9uRGF0YSwgZnVuYywgdGFnKTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiBPbkFkZFRyYWNrID0ge307XG4gIGFkZE9uQWRkVHJhY2sgPSAoZnVuYzogT25BZGRUcmFja1trZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkFkZFRyYWNrPih0aGlzLm9uQWRkVHJhY2ssIGZ1bmMsIHRhZyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgc3RyZWFtPzogTWVkaWFTdHJlYW07XG5cbiAgaXNPZmZlciA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihvcHQ/OiB7IG5vZGVJZD86IHN0cmluZzsgc3RyZWFtPzogTWVkaWFTdHJlYW0gfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IG9wdGlvbikge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAoIW9wdCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFtcbiAgICAgICAgICAgICAgXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCIsXG4gICAgICAgICAgICAgIFwic3R1bjpzdHVuLndlYnJ0Yy5lY2wubnR0LmNvbTozNDc4XCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5vbmljZWNhbmRpZGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICB0aGlzLm5vZGVJZCxcbiAgICAgICAgXCJJQ0UgY29ubmVjdGlvbiBTdGF0dXMgaGFzIGNoYW5nZWQgdG8gXCIgKyBwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZVxuICAgICAgKTtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3ZWJydGM0bWUgZGlzY29ubmVjdGVkXCIpO1xuICAgICAgICAgIC8vIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIC8vIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAvLyB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBlID0+IHtcbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSBwZWVyLnNpZ25hbGluZ1N0YXRlICE9IFwic3RhYmxlXCI7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgbWFrZU9mZmVyKG9wdD86IG9wdGlvbikge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5uZWdvdGlhdGluZykge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJkdXBsaVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IHRydWU7XG4gICAgICBjb25zdCBvZmZlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKG9mZmVyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VuZChKU09OLnN0cmluZ2lmeSh7IHNkcDogdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbiB9KSwgXCJ3ZWJydGNcIik7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHRoaXMuY29ubmVjdCgpO1xuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBhc3luYyBldmVudCA9PiB7XG4gICAgICAgIGlmICghZXZlbnQpIHJldHVybjtcbiAgICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkRhdGEsIHtcbiAgICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjaGFubmVsLmxhYmVsID09PSBcIndlYnJ0Y1wiKSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh7IG9iaiB9KTtcbiAgICAgICAgICBpZiAoIW9iaiB8fCAhb2JqLnNkcCkgcmV0dXJuO1xuICAgICAgICAgIGlmIChvYmouc2RwLnR5cGUgPT09IFwib2ZmZXJcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWJ1ZyBvZmZlclwiLCB7IG9iaiB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG9iai5zZHApO1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS53YXJuKTtcbiAgICAgICAgICAgIGlmICghY3JlYXRlKSByZXR1cm47XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGNyZWF0ZSkuY2F0Y2goY29uc29sZS53YXJuKTtcbiAgICAgICAgICAgIGxldCBsb2NhbCA9IHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb247XG4gICAgICAgICAgICBpZiAobG9jYWwgJiYgIWxvY2FsLnR5cGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coeyBsb2NhbCB9KTtcbiAgICAgICAgICAgICAgbG9jYWwgPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFuc3dlclwiLFxuICAgICAgICAgICAgICAgIHNkcDogbG9jYWwuc2RwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kKFxuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IHNkcDogdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbiB9KSxcbiAgICAgICAgICAgICAgXCJ3ZWJydGNcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWJ1ZyBhbnN3ZXJcIiwgeyBvYmogfSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihvYmouc2RwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YWNoYW5uZWwgRXJyb3I6IFwiICsgZXJyKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YUNoYW5uZWwgaXMgY2xvc2VkXCIpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0QW5zd2VyKHNkcDogYW55LCBub2RlSWQ/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55LCBvcHQ/OiBvcHRpb24pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19