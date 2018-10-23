"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wrtc = require("wrtc");

var _stream = _interopRequireDefault(require("./stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

function excuteEvent(ev, v) {
  console.log("excuteEvent", ev);
  Object.keys(ev).forEach(function (key) {
    ev[key](v);
  });
}

var WebRTC =
/*#__PURE__*/
function () {
  function WebRTC(opt) {
    _classCallCheck(this, WebRTC);

    _defineProperty(this, "rtc", void 0);

    _defineProperty(this, "signal", void 0);

    _defineProperty(this, "connect", void 0);

    _defineProperty(this, "disconnect", void 0);

    _defineProperty(this, "onData", {});

    _defineProperty(this, "onAddTrack", {});

    _defineProperty(this, "events", {
      data: this.onData,
      track: this.onAddTrack
    });

    _defineProperty(this, "dataChannels", void 0);

    _defineProperty(this, "nodeId", void 0);

    _defineProperty(this, "isConnected", void 0);

    _defineProperty(this, "isDisconnected", void 0);

    _defineProperty(this, "onicecandidate", void 0);

    _defineProperty(this, "stream", void 0);

    _defineProperty(this, "streamManager", void 0);

    opt = opt || {};
    this.streamManager = new _stream.default(this);
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
      var _this = this;

      if (opt) if (opt.nodeId) this.nodeId = opt.nodeId;
      var peer;
      if (opt === undefined) opt = {};

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
          if (!_this.onicecandidate) {
            _this.signal(peer.localDescription);

            _this.onicecandidate = true;
          }
        }
      };

      peer.oniceconnectionstatechange = function () {
        console.log(_this.nodeId, "ICE connection Status has changed to " + peer.iceConnectionState);

        switch (peer.iceConnectionState) {
          case "closed":
            _this.disconnect();

            _this.isDisconnected = true;
            _this.isConnected = false;
            break;

          case "failed":
            break;

          case "connected":
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

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];
        excuteEvent(_this.onAddTrack, stream);
      };

      return peer;
    }
  }, {
    key: "makeOffer",
    value: function makeOffer(opt) {
      var _this2 = this;

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
                return _this2.rtc.createOffer().catch(console.log);

              case 2:
                offer = _context.sent;

                if (!offer) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return _this2.rtc.setLocalDescription(offer).catch(console.log);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
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
      var _this3 = this;

      channel.onopen = function () {
        if (_this3.stream) {
          _this3.streamManager.addStream(_this3.stream);
        }

        _this3.isConnected = true;
        _this3.onicecandidate = false;

        _this3.connect();
      };

      channel.onmessage = function (event) {
        excuteEvent(_this3.onData, {
          label: channel.label,
          data: event.data,
          nodeId: _this3.nodeId
        });
      };

      channel.onerror = function (err) {
        console.log("Datachannel Error: " + err);
      };

      channel.onclose = function () {
        console.log("DataChannel is closed");
        _this3.isDisconnected = true;

        _this3.disconnect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJXZWJSVEMiLCJvcHQiLCJkYXRhIiwib25EYXRhIiwidHJhY2siLCJvbkFkZFRyYWNrIiwic3RyZWFtTWFuYWdlciIsIlN0cmVhbSIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwic3RyZWFtIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwidW5kZWZpbmVkIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib250cmFjayIsInN0cmVhbXMiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJhZGRTdHJlYW0iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJpbmNsdWRlcyIsInNlbmQiLCJl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RCxHQUFMLENBQVNrQyxtQkFBVCxDQUE2QmdCLE1BQTdCLEVBQXFDbEIsS0FBckMsQ0FBMkM5QyxPQUFPLENBQUNDLEdBQW5ELEM7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBR2ZPLEksRUFBV2dDLEssRUFBZ0I7QUFDOUJBLE1BQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLGFBQWpCOztBQUNBLFVBQUksQ0FBQ3RDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUthLFlBQWpCLEVBQStCaUQsUUFBL0IsQ0FBd0N6QixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtTLGlCQUFMLENBQXVCVCxLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLeEIsWUFBTCxDQUFrQndCLEtBQWxCLEVBQXlCMEIsSUFBekIsQ0FBOEIxRCxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPMkQsS0FBUCxFQUFjO0FBQ2RuRSxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCa0UsS0FBN0I7QUFDQSxhQUFLakQsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0Y7OzsrQkFFVUUsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IHsgbWVzc2FnZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9zdHJlYW1cIjtcblxuZnVuY3Rpb24gZXhjdXRlRXZlbnQoZXY6IGFueSwgdj86IGFueSkge1xuICBjb25zb2xlLmxvZyhcImV4Y3V0ZUV2ZW50XCIsIGV2KTtcbiAgT2JqZWN0LmtleXMoZXYpLmZvckVhY2goa2V5ID0+IHtcbiAgICBldltrZXldKHYpO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcblxuICBzaWduYWw6IChzZHA6IGFueSkgPT4gdm9pZDtcbiAgY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvbkRhdGE6IHsgW2tleTogc3RyaW5nXTogKHJhdzogbWVzc2FnZSkgPT4gdm9pZCB9ID0ge307XG4gIHByaXZhdGUgb25BZGRUcmFjazogeyBba2V5OiBzdHJpbmddOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZCB9ID0ge307XG4gIGV2ZW50cyA9IHtcbiAgICBkYXRhOiB0aGlzLm9uRGF0YSxcbiAgICB0cmFjazogdGhpcy5vbkFkZFRyYWNrXG4gIH07XG5cbiAgZGF0YUNoYW5uZWxzOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcbiAgc3RyZWFtTWFuYWdlcjogU3RyZWFtO1xuICBjb25zdHJ1Y3RvcihvcHQ/OiB7IG5vZGVJZD86IHN0cmluZzsgc3RyZWFtPzogTWVkaWFTdHJlYW0gfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLnN0cmVhbU1hbmFnZXIgPSBuZXcgU3RyZWFtKHRoaXMpO1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5ub2RlSWQgPSBvcHQubm9kZUlkIHx8IFwicGVlclwiO1xuICAgIHRoaXMuc3RyZWFtID0gb3B0LnN0cmVhbTtcbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0PzogYW55KSB7XG4gICAgaWYgKG9wdCkgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKG9wdCA9PT0gdW5kZWZpbmVkKSBvcHQgPSB7fTtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0PzogeyBkaXNhYmxlX3N0dW4/OiBib29sZWFuOyBub2RlSWQ/OiBzdHJpbmcgfSkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgZXN0YWJsaXNoZWQgZXJyb3I6IFwiICsgZGNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXIuYWRkU3RyZWFtKHRoaXMuc3RyZWFtKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkIHx8IHRoaXMubm9kZUlkO1xuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihcbiAgICBzZHA6IGFueSxcbiAgICBvcHQ/OiB7IGRpc2FibGVfc3R1bj86IGJvb2xlYW47IG5vZGVJZD86IHN0cmluZyB9XG4gICkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19