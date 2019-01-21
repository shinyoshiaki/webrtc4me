"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function addEvent(event, func, tag) {
  tag = tag || function () {
    var gen = Math.random().toString();

    while (Object.keys({}).includes(gen)) {
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
            urls: "stun:stun.webrtc.ecl.ntt.com:3478"
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
            _this2.isConnected = false;

            _this2.disconnect();

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

      channel.onmessage = function (event) {
        excuteEvent(_this4.onData, {
          label: channel.label,
          data: event.data,
          nodeId: _this4.nodeId
        });
      };

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
      regeneratorRuntime.mark(function _callee2(sdp, opt) {
        var answer;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.rtc = this.prepareNewConnection(opt);
                _context2.next = 3;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 3:
                _context2.next = 5;
                return this.rtc.createAnswer().catch(console.log);

              case 5:
                answer = _context2.sent;

                if (!answer) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 9;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function makeAnswer(_x, _x2) {
        return _makeAnswer.apply(this, arguments);
      };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiZXJyb3IiLCJXZWJSVEMiLCJvcHQiLCJvbkRhdGEiLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJzdHJlYW0iLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnRyYWNrIiwic3RyZWFtcyIsIm9uYWRkdHJhY2siLCJ0cmFjayIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsImNhdGNoIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJkYXRhIiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlw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S0FBS25ELEdBQUwsQ0FBU21DLG1CQUFULENBQTZCZ0IsTUFBN0IsRUFBcUNsQixLQUFyQyxDQUEyQ3JELE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZitELEksRUFBV25CLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzNDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUttQixZQUFqQixFQUErQlIsUUFBL0IsQ0FBd0MrQixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtZLGlCQUFMLENBQXVCWixLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLdkIsWUFBTCxDQUFrQnVCLEtBQWxCLEVBQXlCMkIsSUFBekIsQ0FBOEJSLElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU9qRCxLQUFQLEVBQWM7QUFDZGYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmMsS0FBN0I7QUFDQSxhQUFLUyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsYUFBS0ssVUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVUgsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IHsgbWVzc2FnZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjtcbiAgbm9kZUlkPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgT25EYXRhIHtcbiAgW2tleTogc3RyaW5nXTogKHJhdzogbWVzc2FnZSkgPT4gdm9pZDtcbn1cbmludGVyZmFjZSBPbkFkZFRyYWNrIHtcbiAgW2tleTogc3RyaW5nXTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG59XG5cbnR5cGUgRXZlbnQgPSBPbkRhdGEgfCBPbkFkZFRyYWNrO1xuXG5mdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgY29uc29sZS5sb2coXCJleGN1dGVFdmVudFwiLCB7IGV2IH0pO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IGZ1bmM6IGFueSA9IGV2W2tleV07XG4gICAgaWYgKHYpIHtcbiAgICAgIGZ1bmModik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudDxUIGV4dGVuZHMgRXZlbnQ+KGV2ZW50OiBULCBmdW5jOiBUW2tleW9mIFRdLCB0YWc/OiBzdHJpbmcpIHtcbiAgdGFnID1cbiAgICB0YWcgfHxcbiAgICAoKCkgPT4ge1xuICAgICAgbGV0IGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChPYmplY3Qua2V5cyh7fSkuaW5jbHVkZXMoZ2VuKSkge1xuICAgICAgICBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuO1xuICAgIH0pKCk7XG4gIGlmIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXModGFnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpbmNsdWRlIHRhZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudFt0YWddID0gZnVuYztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogT25EYXRhID0ge307XG4gIGFkZE9uRGF0YSA9IChmdW5jOiBPbkRhdGFba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25EYXRhPih0aGlzLm9uRGF0YSwgZnVuYywgdGFnKTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiBPbkFkZFRyYWNrID0ge307XG4gIGFkZE9uQWRkVHJhY2sgPSAoZnVuYzogT25BZGRUcmFja1trZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkFkZFRyYWNrPih0aGlzLm9uQWRkVHJhY2ssIGZ1bmMsIHRhZyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgc3RyZWFtPzogTWVkaWFTdHJlYW07XG5cbiAgaXNPZmZlciA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihvcHQ/OiB7IG5vZGVJZD86IHN0cmluZzsgc3RyZWFtPzogTWVkaWFTdHJlYW0gfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IG9wdGlvbikge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAoIW9wdCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIndlYnJ0YzRtZSBkaXNjb25uZWN0ZWRcIik7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICAgIHN0cmVhbS5vbmFkZHRyYWNrID0gdHJhY2sgPT4ge1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHRyYWNrKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbWFrZU9mZmVyKG9wdD86IG9wdGlvbikge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvZmZlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKG9mZmVyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHRoaXMuY29ubmVjdCgpO1xuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkIHx8IHRoaXMubm9kZUlkO1xuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSwgb3B0Pzogb3B0aW9uKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoYW5zd2VyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCBcImRhdGFjaGFubmVsXCI7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIHNlbmQgZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==