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
      var _this = this;

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
            break;

          case "completed":
            break;

          case "disconnected":
            _this.disconnect();

            _this.isDisconnected = true;
            _this.isConnected = false;
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

        stream.onaddtrack = function (track) {
          excuteEvent(_this.onAddTrack, track);
        };
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
      var _this3 = this;

      channel.onopen = function () {
        if (!_this3.isConnected) _this3.connect();
        _this3.isConnected = true;
        _this3.onicecandidate = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJXZWJSVEMiLCJvcHQiLCJkYXRhIiwib25EYXRhIiwidHJhY2siLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJzdHJlYW0iLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnRyYWNrIiwic3RyZWFtcyIsIm9uYWRkdHJhY2siLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJtZXNzYWdlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZXZlbnQiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwiaW5jbHVkZXMiLCJzZW5kIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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R0FBTCxDQUFTa0MsbUJBQVQsQ0FBNkJnQixNQUE3QixFQUFxQ2xCLEtBQXJDLENBQTJDNUMsT0FBTyxDQUFDQyxHQUFuRCxDOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUdmTyxJLEVBQVc2QixLLEVBQWdCO0FBQzlCQSxNQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxhQUFqQjs7QUFDQSxVQUFJLENBQUNuQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLVyxZQUFqQixFQUErQmlELFFBQS9CLENBQXdDMUIsS0FBeEMsQ0FBTCxFQUFxRDtBQUNuRCxhQUFLVyxpQkFBTCxDQUF1QlgsS0FBdkI7QUFDRDs7QUFDRCxVQUFJO0FBQ0YsYUFBS3ZCLFlBQUwsQ0FBa0J1QixLQUFsQixFQUF5QjJCLElBQXpCLENBQThCeEQsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT3lELEtBQVAsRUFBYztBQUNkakUsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmdFLEtBQTdCO0FBQ0EsYUFBS2pELGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxhQUFLSyxVQUFMO0FBQ0Q7QUFDRjs7OytCQUVVSCxNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5pbXBvcnQgeyBtZXNzYWdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW4/OiBib29sZWFuO1xuICBub2RlSWQ/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBhbnksIHY/OiBhbnkpIHtcbiAgY29uc29sZS5sb2coXCJleGN1dGVFdmVudFwiLCBldik7XG4gIE9iamVjdC5rZXlzKGV2KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgZXZba2V5XSh2KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25EYXRhOiB7IFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQgfSA9IHt9O1xuICBwcml2YXRlIG9uQWRkVHJhY2s6IHsgW2tleTogc3RyaW5nXTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQgfSA9IHt9O1xuICBldmVudHMgPSB7XG4gICAgZGF0YTogdGhpcy5vbkRhdGEsXG4gICAgdHJhY2s6IHRoaXMub25BZGRUcmFja1xuICB9O1xuXG4gIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuICBub2RlSWQ6IHN0cmluZztcbiAgaXNDb25uZWN0ZWQ6IGJvb2xlYW47XG4gIGlzRGlzY29ubmVjdGVkOiBib29sZWFuO1xuICBvbmljZWNhbmRpZGF0ZTogYm9vbGVhbjtcbiAgc3RyZWFtPzogTWVkaWFTdHJlYW07XG5cbiAgaXNPZmZlciA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihvcHQ/OiB7IG5vZGVJZD86IHN0cmluZzsgc3RyZWFtPzogTWVkaWFTdHJlYW0gfSkge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IG9wdGlvbikge1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAoIW9wdCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW3sgdXJsczogXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIiB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCBzdHJlYW0pO1xuICAgICAgc3RyZWFtLm9uYWRkdHJhY2sgPSB0cmFjayA9PiB7XG4gICAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgdHJhY2spO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0Pzogb3B0aW9uKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgdGhpcy5ydGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9O1xuICAgIHRoaXMuaXNPZmZlciA9IHRydWU7XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgZXN0YWJsaXNoZWQgZXJyb3I6IFwiICsgZGNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkgdGhpcy5jb25uZWN0KCk7XG4gICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkRhdGEsIHtcbiAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YWNoYW5uZWwgRXJyb3I6IFwiICsgZXJyKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YUNoYW5uZWwgaXMgY2xvc2VkXCIpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0QW5zd2VyKHNkcDogYW55LCBub2RlSWQ/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55LCBvcHQ/OiBvcHRpb24pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3Rpbmcobm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgfVxufVxuIl19