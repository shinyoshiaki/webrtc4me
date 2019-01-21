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

      function makeAnswer(_x, _x2) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiZXJyb3IiLCJXZWJSVEMiLCJvcHQiLCJvbkRhdGEiLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJzdHJlYW0iLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnRyYWNrIiwic3RyZWFtcyIsIm9uYWRkdHJhY2siLCJ0cmFjayIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsImNhdGNoIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiaXNPZmZlciIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJkYXRhIiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlw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OztxQkFDRkEsTTs7Ozs7O3VCQUFjLEtBQUtuRCxHQUFMLENBQVNtQyxtQkFBVCxDQUE2QmdCLE1BQTdCLEVBQXFDbEIsS0FBckMsQ0FBMkNyRCxPQUFPLENBQUNDLEdBQW5ELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZitELEksRUFBV25CLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQzNDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUttQixZQUFqQixFQUErQlIsUUFBL0IsQ0FBd0MrQixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtZLGlCQUFMLENBQXVCWixLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLdkIsWUFBTCxDQUFrQnVCLEtBQWxCLEVBQXlCMkIsSUFBekIsQ0FBOEJSLElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU9qRCxLQUFQLEVBQWM7QUFDZGYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmMsS0FBN0I7QUFDQSxhQUFLUyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsYUFBS0ssVUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVUgsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IHsgbWVzc2FnZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjtcbiAgbm9kZUlkPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgT25EYXRhIHtcbiAgW2tleTogc3RyaW5nXTogKHJhdzogbWVzc2FnZSkgPT4gdm9pZDtcbn1cbmludGVyZmFjZSBPbkFkZFRyYWNrIHtcbiAgW2tleTogc3RyaW5nXTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG59XG5cbnR5cGUgRXZlbnQgPSBPbkRhdGEgfCBPbkFkZFRyYWNrO1xuXG5mdW5jdGlvbiBleGN1dGVFdmVudChldjogRXZlbnQsIHY/OiBhbnkpIHtcbiAgY29uc29sZS5sb2coXCJleGN1dGVFdmVudFwiLCB7IGV2IH0pO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IGZ1bmM6IGFueSA9IGV2W2tleV07XG4gICAgaWYgKHYpIHtcbiAgICAgIGZ1bmModik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudDxUIGV4dGVuZHMgRXZlbnQ+KGV2ZW50OiBULCBmdW5jOiBUW2tleW9mIFRdLCB0YWc/OiBzdHJpbmcpIHtcbiAgdGFnID1cbiAgICB0YWcgfHxcbiAgICAoKCkgPT4ge1xuICAgICAgbGV0IGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChPYmplY3Qua2V5cyh7fSkuaW5jbHVkZXMoZ2VuKSkge1xuICAgICAgICBnZW4gPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuO1xuICAgIH0pKCk7XG4gIGlmIChPYmplY3Qua2V5cyhldmVudCkuaW5jbHVkZXModGFnKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJpbmNsdWRlIHRhZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudFt0YWddID0gZnVuYztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogT25EYXRhID0ge307XG4gIGFkZE9uRGF0YSA9IChmdW5jOiBPbkRhdGFba2V5b2YgT25EYXRhXSwgdGFnPzogc3RyaW5nKSA9PiB7XG4gICAgYWRkRXZlbnQ8T25EYXRhPih0aGlzLm9uRGF0YSwgZnVuYywgdGFnKTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiBPbkFkZFRyYWNrID0ge307XG4gIGFkZE9uQWRkVHJhY2sgPSAoZnVuYzogT25BZGRUcmFja1trZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkFkZFRyYWNrPih0aGlzLm9uQWRkVHJhY2ssIGZ1bmMsIHRhZyk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbHM6IHsgW2tleTogc3RyaW5nXTogUlRDRGF0YUNoYW5uZWwgfTtcblxuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgc3RyZWFtPzogTWVkaWFTdHJlYW07XG5cbiAgaXNPZmZlciA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihvcHQ/OiB7IG5vZGVJZD86IHN0cmluZzsgc3RyZWFtPzogTWVkaWFTdHJlYW0gfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IG9wdGlvbikge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAoIW9wdCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFtcbiAgICAgICAgICAgICAgXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCIsXG4gICAgICAgICAgICAgIFwic3R1bjpzdHVuLndlYnJ0Yy5lY2wubnR0LmNvbTozNDc4XCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5vbmljZWNhbmRpZGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICB0aGlzLm5vZGVJZCxcbiAgICAgICAgXCJJQ0UgY29ubmVjdGlvbiBTdGF0dXMgaGFzIGNoYW5nZWQgdG8gXCIgKyBwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZVxuICAgICAgKTtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJydGM0bWUgZGlzY29ubmVjdGVkXCIpO1xuICAgICAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmRhdGFjaGFubmVsID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IGRhdGFDaGFubmVsID0gZXZ0LmNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tkYXRhQ2hhbm5lbC5sYWJlbF0gPSBkYXRhQ2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGF0YUNoYW5uZWwpO1xuICAgIH07XG5cbiAgICBwZWVyLm9udHJhY2sgPSBldnQgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gZXZ0LnN0cmVhbXNbMF07XG4gICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHN0cmVhbSk7XG4gICAgICBzdHJlYW0ub25hZGR0cmFjayA9IHRyYWNrID0+IHtcbiAgICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCB0cmFjayk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIG1ha2VPZmZlcihvcHQ/OiBvcHRpb24pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBlc3RhYmxpc2hlZCBlcnJvcjogXCIgKyBkY2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhY2hhbm5lbCBFcnJvcjogXCIgKyBlcnIpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhQ2hhbm5lbCBpcyBjbG9zZWRcIik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH07XG4gIH1cblxuICBzZXRBbnN3ZXIoc2RwOiBhbnksIG5vZGVJZD86IHN0cmluZykge1xuICAgIHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCB0aGlzLm5vZGVJZDtcbiAgfVxuXG4gIGFzeW5jIG1ha2VBbnN3ZXIoc2RwOiBhbnksIG9wdD86IG9wdGlvbikge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=