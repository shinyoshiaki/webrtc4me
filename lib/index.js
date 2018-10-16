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

var WebRTC =
/*#__PURE__*/
function () {
  function WebRTC() {
    _classCallCheck(this, WebRTC);

    _defineProperty(this, "rtc", void 0);

    _defineProperty(this, "signal", void 0);

    _defineProperty(this, "connect", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "disconnect", void 0);

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
    this.nodeId = "peer";

    this.connect = function () {};

    this.data = function (raw) {};

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

      channel.onopen = function () {//   this.isConnected = true;
        //   this.onicecandidate = false;
        //   this.connect();
      };

      channel.onmessage = function (event) {
        _this3.data({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiV2ViUlRDIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJjb25uZWN0IiwiZGF0YSIsInJhdyIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJvcHQiLCJwZWVyIiwidW5kZWZpbmVkIiwiZGlzYWJsZV9zdHVuIiwiY29uc29sZSIsImxvZyIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJldnQiLCJjYW5kaWRhdGUiLCJsb2NhbERlc2NyaXB0aW9uIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsImNhdGNoIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwibWVzc2FnZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImV2ZW50Iiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsImVycm9yIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQURBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFHcUJDLE07OztBQVduQixvQkFBYztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFB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QUtiLEdBQUwsQ0FDSGdELG9CQURHLENBQ2tCLElBQUlDLDJCQUFKLENBQTBCckMsR0FBMUIsQ0FEbEIsRUFFSHNCLEtBRkcsQ0FFR2pCLE9BQU8sQ0FBQ0MsR0FGWCxDOzs7O3VCQUdlLEtBQUtsQixHQUFMLENBQVNtRCxZQUFULEdBQXdCakIsS0FBeEIsQ0FBOEJqQixPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFma0MsZ0JBQUFBLE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS3BELEdBQUwsQ0FBU29DLG1CQUFULENBQTZCZ0IsTUFBN0IsRUFBcUNsQixLQUFyQyxDQUEyQ2pCLE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZlYsSSxFQUFXc0IsSyxFQUFlO0FBQzdCLFVBQUksQ0FBQ3VCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtwRCxZQUFqQixFQUErQnFELFFBQS9CLENBQXdDekIsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLTyxpQkFBTCxDQUF1QlAsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBSzVCLFlBQUwsQ0FBa0I0QixLQUFsQixFQUF5QjBCLElBQXpCLENBQThCaEQsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBTzBDLEtBQVAsRUFBYztBQUNkakMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmdDLEtBQTdCO0FBQ0EsYUFBSzlDLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOzs7K0JBRVVFLE0sRUFBZ0I7QUFDekIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgeyBSVENQZWVyQ29ubmVjdGlvbiwgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSBcIndydGNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRhdGE6IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRhdGFDaGFubmVsczogYW55O1xuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IFwicGVlclwiO1xuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGF0YSA9IHJhdyA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0PzogYW55KSB7XG4gICAgaWYgKG9wdCkgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBsZXQgcGVlcjogUlRDUGVlckNvbm5lY3Rpb247XG4gICAgaWYgKG9wdCA9PT0gdW5kZWZpbmVkKSBvcHQgPSB7fTtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbWFrZU9mZmVyKG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9O1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAvLyAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgLy8gICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAvLyAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICB0aGlzLmRhdGEoe1xuICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhY2hhbm5lbCBFcnJvcjogXCIgKyBlcnIpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhQ2hhbm5lbCBpcyBjbG9zZWRcIik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH07XG4gIH1cblxuICBzZXRBbnN3ZXIoc2RwOiBhbnksIG5vZGVJZD86IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpO1xuICAgICAgaWYgKG5vZGVJZCkgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwic2V0UmVtb3RlRGVzY3JpcHRpb24oYW5zd2VyKSBFUlJPUjogXCIsIGVycik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihcbiAgICBzZHA6IGFueSxcbiAgICBvcHQ/OiB7IGRpc2FibGVfc3R1bj86IGJvb2xlYW47IG5vZGVJZD86IHN0cmluZyB9XG4gICkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIGF3YWl0IHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbDogc3RyaW5nKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIHNlbmQgZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=