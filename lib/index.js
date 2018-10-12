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
  function WebRTC(_nodeId) {
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

    this.nodeId = _nodeId;
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;

    this.connect = function () {};

    this.data = function (raw) {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection(opt) {
      var _this = this;

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
    value: function setAnswer(sdp) {
      try {
        this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp));
      } catch (err) {
        console.error("setRemoteDescription(answer) ERROR: ", err);
      }
    }
  }, {
    key: "makeAnswer",
    value: function () {
      var _makeAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(sdp) {
        var opt,
            answer,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                opt = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {
                  disable_stun: false
                };
                this.rtc = this.prepareNewConnection(opt);
                _context2.next = 4;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 4:
                _context2.next = 6;
                return this.rtc.createAnswer().catch(console.log);

              case 6:
                answer = _context2.sent;

                if (!answer) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 10;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function makeAnswer(_x) {
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
  }]);

  return WebRTC;
}();

exports.default = WebRTC;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiV2ViUlRDIiwiX25vZGVJZCIsIm5vZGVJZCIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwiY29ubmVjdCIsImRhdGEiLCJyYXciLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwib3B0IiwicGVlciIsInVuZGVmaW5lZCIsImRpc2FibGVfc3R1biIsImNvbnNvbGUiLCJsb2ciLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJlcnJvciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFEQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0lBR3FCQyxNOzs7QUFXbkIsa0JBQVlDLE9BQVosRUFBNkI7QUFBQTs7QUFBQTs7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dEMsQzs7O0FBQWZrQyxnQkFBQUEsTTs7cUJBQ0ZBLE07Ozs7Ozt1QkFBYyxLQUFLbkQsR0FBTCxDQUFTbUMsbUJBQVQsQ0FBNkJnQixNQUE3QixFQUFxQ2xCLEtBQXJDLENBQTJDakIsT0FBTyxDQUFDQyxHQUFuRCxDOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUdmVixJLEVBQVdzQixLLEVBQWU7QUFDN0IsVUFBSSxDQUFDdUIsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS25ELFlBQWpCLEVBQStCb0QsUUFBL0IsQ0FBd0N6QixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtPLGlCQUFMLENBQXVCUCxLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLM0IsWUFBTCxDQUFrQjJCLEtBQWxCLEVBQXlCMEIsSUFBekIsQ0FBOEJoRCxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPMEMsS0FBUCxFQUFjO0FBQ2RqQyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCZ0MsS0FBN0I7QUFDQSxhQUFLN0MsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgeyBSVENQZWVyQ29ubmVjdGlvbiwgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSBcIndydGNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRhdGE6IChyYXc6IGFueSkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGF0YUNoYW5uZWxzOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBjb25zdHJ1Y3Rvcihfbm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IF9ub2RlSWQ7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMuY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuZGF0YSA9IHJhdyA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0PzogYW55KSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmIChvcHQgPT09IHVuZGVmaW5lZCkgb3B0ID0ge307XG5cbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0PzogYW55KSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBvZmZlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKG9mZmVyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBlc3RhYmxpc2hlZCBlcnJvcjogXCIgKyBkY2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgLy8gICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIC8vICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgICAgLy8gICB0aGlzLmNvbm5lY3QoKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgdGhpcy5kYXRhKHtcbiAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YWNoYW5uZWwgRXJyb3I6IFwiICsgZXJyKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YUNoYW5uZWwgaXMgY2xvc2VkXCIpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0QW5zd2VyKHNkcDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwic2V0UmVtb3RlRGVzY3JpcHRpb24oYW5zd2VyKSBFUlJPUjogXCIsIGVycik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSwgb3B0ID0geyBkaXNhYmxlX3N0dW46IGZhbHNlIH0pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw6IHN0cmluZykge1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19