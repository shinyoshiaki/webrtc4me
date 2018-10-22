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
  console.log("excuteEvent", ev);
  Object.keys(ev).forEach(function (key) {
    ev[key](v);
  });
}

var WebRTC =
/*#__PURE__*/
function () {
  function WebRTC(nodeId) {
    _classCallCheck(this, WebRTC);

    _defineProperty(this, "rtc", void 0);

    _defineProperty(this, "signal", void 0);

    _defineProperty(this, "connect", void 0);

    _defineProperty(this, "disconnect", void 0);

    _defineProperty(this, "data", {});

    _defineProperty(this, "events", {
      data: this.data
    });

    _defineProperty(this, "dataChannels", void 0);

    _defineProperty(this, "nodeId", void 0);

    _defineProperty(this, "isConnected", void 0);

    _defineProperty(this, "isDisconnected", void 0);

    _defineProperty(this, "onicecandidate", void 0);

    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;
    this.nodeId = nodeId || "peer";

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
            _this.isConnected = true;
            _this.onicecandidate = false;

            _this.connect();

            break;

          case "completed":
            if (!_this.isConnected) {
              _this.isConnected = true;
              _this.onicecandidate = false;

              _this.connect();
            }

            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this.dataChannels[dataChannel.label] = dataChannel;

        _this.dataChannelEvents(dataChannel);
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

      channel.onopen = function () {};

      channel.onmessage = function (event) {
        excuteEvent(_this3.data, {
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
      try {
        this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp));
        if (nodeId) this.nodeId = nodeId;
      } catch (err) {
        console.error("setRemoteDescription(answer) ERROR: ", err);
      }
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
      if (!label) label = "datachannel";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJXZWJSVEMiLCJub2RlSWQiLCJkYXRhIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsIm9wdCIsInBlZXIiLCJ1bmRlZmluZWQiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJlcnJvciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsImluY2x1ZGVzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQURBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFJQSxTQUFTQyxXQUFULENBQXFCQyxF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OEMsS0FBUCxFQUFjO0FBQ2R0RCxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCcUQsS0FBN0I7QUFDQSxhQUFLekMsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0Y7OzsrQkFFVU4sTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IHsgbWVzc2FnZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG5mdW5jdGlvbiBleGN1dGVFdmVudChldjogYW55LCB2PzogYW55KSB7XG4gIGNvbnNvbGUubG9nKFwiZXhjdXRlRXZlbnRcIiwgZXYpO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGV2W2tleV0odik7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkOyAgXG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgZGF0YTogeyBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkIH0gPSB7fTtcbiAgZXZlbnRzID0ge1xuICAgIGRhdGE6IHRoaXMuZGF0YVxuICB9O1xuXG4gIGRhdGFDaGFubmVsczogYW55O1xuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgY29uc3RydWN0b3Iobm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0PzogYW55KSB7XG4gICAgaWYgKG9wdCkgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKG9wdCA9PT0gdW5kZWZpbmVkKSBvcHQgPSB7fTtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbWFrZU9mZmVyKG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9O1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7fTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMuZGF0YSwge1xuICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhY2hhbm5lbCBFcnJvcjogXCIgKyBlcnIpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhQ2hhbm5lbCBpcyBjbG9zZWRcIik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH07XG4gIH1cblxuICBzZXRBbnN3ZXIoc2RwOiBhbnksIG5vZGVJZD86IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpO1xuICAgICAgaWYgKG5vZGVJZCkgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwic2V0UmVtb3RlRGVzY3JpcHRpb24oYW5zd2VyKSBFUlJPUjogXCIsIGVycik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihcbiAgICBzZHA6IGFueSxcbiAgICBvcHQ/OiB7IGRpc2FibGVfc3R1bj86IGJvb2xlYW47IG5vZGVJZD86IHN0cmluZyB9XG4gICkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGlmICghbGFiZWwpIGxhYmVsID0gXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19