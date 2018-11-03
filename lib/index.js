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

    _defineProperty(this, "isOffer", false);

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
        if (_this3.stream) {
          _this3.streamManager.addStream(_this3.stream);
        }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJXZWJSVEMiLCJvcHQiLCJkYXRhIiwib25EYXRhIiwidHJhY2siLCJvbkFkZFRyYWNrIiwic3RyZWFtTWFuYWdlciIsIlN0cmVhbSIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwic3RyZWFtIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwidW5kZWZpbmVkIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib250cmFjayIsInN0cmVhbXMiLCJvbmFkZHRyYWNrIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsImNyZWF0ZU9mZmVyIiwiY2F0Y2giLCJvZmZlciIsInNldExvY2FsRGVzY3JpcHRpb24iLCJpc09mZmVyIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwibWVzc2FnZSIsIm9ub3BlbiIsImFkZFN0cmVhbSIsIm9ubWVzc2FnZSIsImV2ZW50Iiwib25lcnJvciIsImVyciIsIm9uY2xvc2UiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsImNyZWF0ZUFuc3dlciIsImFuc3dl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QTBCUixHQUExQixDQUFYOzt1QkFDTSxLQUFLTyxHQUFMLENBQ0hpRCxvQkFERyxDQUNrQixJQUFJQywyQkFBSixDQUEwQnZDLEdBQTFCLENBRGxCLEVBRUhzQixLQUZHLENBRUcvQyxPQUFPLENBQUNDLEdBRlgsQzs7Ozt1QkFHZSxLQUFLYSxHQUFMLENBQVNtRCxZQUFULEdBQXdCbEIsS0FBeEIsQ0FBOEIvQyxPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFmaUUsZ0JBQUFBLE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS3BELEdBQUwsQ0FBU21DLG1CQUFULENBQTZCaUIsTUFBN0IsRUFBcUNuQixLQUFyQyxDQUEyQy9DLE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZk8sSSxFQUFXZ0MsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDdEMsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS2EsWUFBakIsRUFBK0JtRCxRQUEvQixDQUF3QzNCLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS1csaUJBQUwsQ0FBdUJYLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt4QixZQUFMLENBQWtCd0IsS0FBbEIsRUFBeUI0QixJQUF6QixDQUE4QjVELElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU82RCxLQUFQLEVBQWM7QUFDZHJFLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVosRUFBNkJvRSxLQUE3QjtBQUNBLGFBQUtuRCxjQUFMLEdBQXNCLElBQXRCO0FBQ0Q7QUFDRjs7OytCQUVVRSxNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5pbXBvcnQgeyBtZXNzYWdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL3N0cmVhbVwiO1xuXG5mdW5jdGlvbiBleGN1dGVFdmVudChldjogYW55LCB2PzogYW55KSB7XG4gIGNvbnNvbGUubG9nKFwiZXhjdXRlRXZlbnRcIiwgZXYpO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGV2W2tleV0odik7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogeyBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkIH0gPSB7fTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiB7IFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkIH0gPSB7fTtcbiAgZXZlbnRzID0ge1xuICAgIGRhdGE6IHRoaXMub25EYXRhLFxuICAgIHRyYWNrOiB0aGlzLm9uQWRkVHJhY2tcbiAgfTtcblxuICBkYXRhQ2hhbm5lbHM6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBpc0Rpc2Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgb25pY2VjYW5kaWRhdGU6IGJvb2xlYW47XG4gIHN0cmVhbT86IE1lZGlhU3RyZWFtO1xuICBzdHJlYW1NYW5hZ2VyOiBTdHJlYW07XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgY29uc3RydWN0b3Iob3B0PzogeyBub2RlSWQ/OiBzdHJpbmc7IHN0cmVhbT86IE1lZGlhU3RyZWFtIH0pIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5zdHJlYW1NYW5hZ2VyID0gbmV3IFN0cmVhbSh0aGlzKTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IGFueSkge1xuICAgIGlmIChvcHQpIGlmIChvcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IG9wdC5ub2RlSWQ7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmIChvcHQgPT09IHVuZGVmaW5lZCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGlzYWJsZSBzdHVuXCIpO1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFt7IHVybHM6IFwic3R1bjpzdHVuLndlYnJ0Yy5lY2wubnR0LmNvbTozNDc4XCIgfV1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5vbmljZWNhbmRpZGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICB0aGlzLm5vZGVJZCxcbiAgICAgICAgXCJJQ0UgY29ubmVjdGlvbiBTdGF0dXMgaGFzIGNoYW5nZWQgdG8gXCIgKyBwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZVxuICAgICAgKTtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICAgIHN0cmVhbS5vbmFkZHRyYWNrID0gdHJhY2sgPT4ge1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHRyYWNrKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbWFrZU9mZmVyKG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IG9mZmVyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24ob2ZmZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB9O1xuICAgIHRoaXMuaXNPZmZlciA9IHRydWU7XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgZXN0YWJsaXNoZWQgZXJyb3I6IFwiICsgZGNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXIuYWRkU3RyZWFtKHRoaXMuc3RyZWFtKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkgdGhpcy5jb25uZWN0KCk7XG4gICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkRhdGEsIHtcbiAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgIG5vZGVJZDogdGhpcy5ub2RlSWRcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YWNoYW5uZWwgRXJyb3I6IFwiICsgZXJyKTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGF0YUNoYW5uZWwgaXMgY2xvc2VkXCIpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0QW5zd2VyKHNkcDogYW55LCBub2RlSWQ/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKFxuICAgIHNkcDogYW55LFxuICAgIG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH1cbiAgKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoYW5zd2VyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCBcImRhdGFjaGFubmVsXCI7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIHNlbmQgZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=