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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiV2ViUlRDIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJjb25uZWN0IiwiZGF0YSIsInJhdyIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJvcHQiLCJwZWVyIiwidW5kZWZpbmVkIiwiZGlzYWJsZV9zdHVuIiwiY29uc29sZSIsImxvZyIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJldnQiLCJjYW5kaWRhdGUiLCJsb2NhbERlc2NyaXB0aW9uIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsImNhdGNoIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwibWVzc2FnZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImV2ZW50Iiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsImVycm9yIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQURBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7SUFHcUJDLE07OztBQVduQixvQkFBYztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFB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QUtiLEdBQUwsQ0FDSGdELG9CQURHLENBQ2tCLElBQUlDLDJCQUFKLENBQTBCckMsR0FBMUIsQ0FEbEIsRUFFSHNCLEtBRkcsQ0FFR2pCLE9BQU8sQ0FBQ0MsR0FGWCxDOzs7O3VCQUdlLEtBQUtsQixHQUFMLENBQVNtRCxZQUFULEdBQXdCakIsS0FBeEIsQ0FBOEJqQixPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFma0MsZ0JBQUFBLE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS3BELEdBQUwsQ0FBU29DLG1CQUFULENBQTZCZ0IsTUFBN0IsRUFBcUNsQixLQUFyQyxDQUEyQ2pCLE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZlYsSSxFQUFXc0IsSyxFQUFlO0FBQzdCLFVBQUksQ0FBQ3VCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtwRCxZQUFqQixFQUErQnFELFFBQS9CLENBQXdDekIsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLTyxpQkFBTCxDQUF1QlAsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBSzVCLFlBQUwsQ0FBa0I0QixLQUFsQixFQUF5QjBCLElBQXpCLENBQThCaEQsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBTzBDLEtBQVAsRUFBYztBQUNkakMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmdDLEtBQTdCO0FBQ0EsYUFBSzlDLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOzs7K0JBRVVFLE0sRUFBZ0I7QUFDekIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgeyBSVENQZWVyQ29ubmVjdGlvbiwgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSBcIndydGNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRhdGE6IChyYXc6IGFueSkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGF0YUNoYW5uZWxzOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gXCJwZWVyXCI7XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kYXRhID0gcmF3ID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQ/OiBhbnkpIHtcbiAgICBpZiAob3B0KSBpZiAob3B0Lm5vZGVJZCkgdGhpcy5ub2RlSWQgPSBvcHQubm9kZUlkO1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAob3B0ID09PSB1bmRlZmluZWQpIG9wdCA9IHt9O1xuICAgIGlmIChvcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRpc2FibGUgc3R1blwiKTtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbeyB1cmxzOiBcInN0dW46c3R1bi53ZWJydGMuZWNsLm50dC5jb206MzQ3OFwiIH1dXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICBpZiAoIXRoaXMub25pY2VjYW5kaWRhdGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgdGhpcy5ub2RlSWQsXG4gICAgICAgIFwiSUNFIGNvbm5lY3Rpb24gU3RhdHVzIGhhcyBjaGFuZ2VkIHRvIFwiICsgcGVlci5pY2VDb25uZWN0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0PzogeyBkaXNhYmxlX3N0dW4/OiBib29sZWFuOyBub2RlSWQ/OiBzdHJpbmcgfSkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgZXN0YWJsaXNoZWQgZXJyb3I6IFwiICsgZGNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIC8vICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAvLyAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICAgIC8vICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZGF0YSh7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSk7XG4gICAgICBpZiAobm9kZUlkKSB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJzZXRSZW1vdGVEZXNjcmlwdGlvbihhbnN3ZXIpIEVSUk9SOiBcIiwgZXJyKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKFxuICAgIHNkcDogYW55LFxuICAgIG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH1cbiAgKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoYW5zd2VyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsOiBzdHJpbmcpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==