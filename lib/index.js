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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJXZWJSVEMiLCJvcHQiLCJkYXRhIiwib25EYXRhIiwidHJhY2siLCJvbkFkZFRyYWNrIiwic3RyZWFtTWFuYWdlciIsIlN0cmVhbSIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwic3RyZWFtIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwidW5kZWZpbmVkIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib250cmFjayIsInN0cmVhbXMiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJtZXNzYWdlIiwib25vcGVuIiwiYWRkU3RyZWFtIiwib25tZXNzYWdlIiwiZXZlbnQiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIiwiaW5jbHVkZXMiLCJzZW5kIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQUhBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFLQSxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUE4QkMsQ0FBOUIsRUFBdUM7QUFDckNDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkJILEVBQTNCO0FBQ0FJLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxFQUFaLEVBQWdCTSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0JQLElBQUFBLEVBQUUsQ0FBQ08sR0FBRCxDQUFGLENBQVFOLENBQVI7QUFDRCxHQUZEO0FBR0Q7O0lBRW9CTyxNOzs7QUFxQm5CLGtCQUFZQyxHQUFaLEVBQTZEO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsb0NBZkQsRUFlQzs7QUFBQSx3Q0FkVSxFQWNWOztBQUFBLG9DQWJwRDtBQUNQQyxNQUFBQSxJQUFJLEVBQUUsS0FBS0MsTUFESjtBQUVQQyxNQUFBQSxLQUFLLEVBQUUsS0FBS0M7QUFGTCxLQWFvRDs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxxQ0FEbkQsS0FDbUQ7O0FBQzNESixJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFiO0FBQ0EsU0FBS0ssYUFBTCxHQUFxQixJQUFJQyxlQUFKLENBQVcsSUFBWCxDQUFyQjtBQUNBLFNBQUtDLEdBQUwsR0FBVyxLQUFLQyxvQkFBTCxFQUFYO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixLQUF0QjtBQUNBLFNBQUtDLE1BQUwsR0FBY2IsR0FBRyxDQUFDYSxNQUFKLElBQWMsTUFBNUI7QUFDQSxTQUFLQyxNQUFMLEdBQWNkLEdBQUcsQ0FBQ2MsTUFBbEI7O0FBQ0EsU0FBS0MsT0FBTCxHQUFlLFlBQU0sQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLFlBQU0sQ0FBRSxDQUExQjs7QUFDQSxTQUFLQyxNQUFMLEdBQWMsVUFBQUMsR0FBRyxFQUFJLENBQUUsQ0FBdkI7QUFDRDs7Ozt5Q0FFNEJsQixHLEVBQVc7QUFBQTs7QUFDdEMsVUFBSUEsR0FBSixFQUFTLElBQUlBLEdBQUcsQ0FBQ2EsTUFBUixFQUFnQixLQUFLQSxNQUFMLEdBQWNiLEdBQUcsQ0FBQ2EsTUFBbEI7QUFDekIsVUFBSU0sSUFBSjtBQUNBLFVBQUluQixHQUFHLEtBQUtvQixTQUFaLEVBQXVCcEIsR0FBRyxHQUFHLEVBQU47O0FBQ3ZCLFVBQUlBLEdBQUcsQ0FBQ3FCLFlBQVIsRUFBc0I7QUFDcEI1QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxjQUFaO0FBQ0F5QixRQUFBQSxJQUFJLEdBQUcsSUFBSUcsdUJBQUosQ0FBc0I7QUFDM0JDLFVBQUFBLFVBQVUsRUFBRTtBQURlLFNBQXRCLENBQVA7QUFHRCxPQUxELE1BS087QUFDTEosUUFBQUEsSUFBSSxHQUFHLElBQUlHLHVCQUFKLENBQXNCO0FBQzNCQyxVQUFBQSxVQUFVLEVBQUUsQ0FBQztBQUFFQyxZQUFBQSxJQUFJLEVBQUU7QUFBUixXQUFEO0FBRGUsU0FBdEIsQ0FBUDtBQUdEOztBQUVETCxNQUFBQSxJQUFJLENBQUNQLGNBQUwsR0FBc0IsVUFBQWEsR0FBRyxFQUFJO0FBQzNCLFlBQUksQ0FBQ0EsR0FBRyxDQUFDQyxTQUFULEVBQW9CO0FBQ2xCLGNBQUksQ0FBQyxLQUFJLENBQUNkLGNBQVYsRUFBMEI7QUFDeEIsWUFBQSxLQUFJLENBQUNLLE1BQUwsQ0FBWUUsSUFBSSxDQUFDUSxnQkFBakI7O0FBQ0EsWUFBQSxLQUFJLENBQUNmLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDtBQUNGO0FBQ0YsT0FQRDs7QUFTQU8sTUFBQUEsSUFBSSxDQUFDUywwQkFBTCxHQUFrQyxZQUFNO0FBQ3RDbkMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQ0UsS0FBSSxDQUFDbUIsTUFEUCxFQUVFLDBDQUEwQ00sSUFBSSxDQUFDVSxrQkFGakQ7O0FBSUEsZ0JBQVFWLElBQUksQ0FBQ1Usa0JBQWI7QUFDRSxlQUFLLFFBQUw7QUFDRTs7QUFDRixlQUFLLFFBQUw7QUFDRTs7QUFDRixlQUFLLFdBQUw7QUFDRTs7QUFDRixlQUFLLFdBQUw7QUFDRTs7QUFDRixlQUFLLGNBQUw7QUFDRSxZQUFBLEtBQUksQ0FBQ2IsVUFBTDs7QUFDQSxZQUFBLEtBQUksQ0FBQ0wsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFlBQUEsS0FBSSxDQUFDRCxXQUFMLEdBQW1CLEtBQW5CO0FBQ0E7QUFiSjtBQWVELE9BcEJEOztBQXNCQVMsTUFBQUEsSUFBSSxDQUFDVyxhQUFMLEdBQXFCLFVBQUFMLEdBQUcsRUFBSTtBQUMxQixZQUFNTSxXQUFXLEdBQUdOLEdBQUcsQ0FBQ08sT0FBeEI7QUFDQSxRQUFBLEtBQUksQ0FBQ3ZCLFlBQUwsQ0FBa0JzQixXQUFXLENBQUNFLEtBQTlCLElBQXVDRixXQUF2Qzs7QUFDQSxRQUFBLEtBQUksQ0FBQ0csaUJBQUwsQ0FBdUJILFdBQXZCO0FBQ0QsT0FKRDs7QUFNQVosTUFBQUEsSUFBSSxDQUFDZ0IsT0FBTCxHQUFlLFVBQUFWLEdBQUcsRUFBSTtBQUNwQixZQUFNWCxNQUFNLEdBQUdXLEdBQUcsQ0FBQ1csT0FBSixDQUFZLENBQVosQ0FBZjtBQUNBOUMsUUFBQUEsV0FBVyxDQUFDLEtBQUksQ0FBQ2MsVUFBTixFQUFrQlUsTUFBbEIsQ0FBWDtBQUNELE9BSEQ7O0FBS0EsYUFBT0ssSUFBUDtBQUNEOzs7OEJBRVNuQixHLEVBQW1EO0FBQUE7O0FBQzNELFdBQUtPLEdBQUwsR0FBVyxLQUFLQyxvQkFBTCxDQUEwQlIsR0FBMUIsQ0FBWDtBQUNBLFdBQUtPLEdBQUwsQ0FBUzhCLG1CQUFUO0FBQUE7QUFBQTtBQUFBO0FBQUEsOEJBQStCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQ1gsTUFBSSxDQUFDOUIsR0FBTCxDQUFTK0IsV0FBVCxHQUF1QkMsS0FBdkIsQ0FBNkI5QyxPQUFPLENBQUNDLEdBQXJDLENBRFc7O0FBQUE7QUFDekI4QyxnQkFBQUEsS0FEeUI7O0FBQUEscUJBRXpCQSxLQUZ5QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLHVCQUVaLE1BQUksQ0FBQ2pDLEdBQUwsQ0FBU2tDLG1CQUFULENBQTZCRCxLQUE3QixFQUFvQ0QsS0FBcEMsQ0FBMEM5QyxPQUFPLENBQUNDLEdBQWxELENBRlk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBL0I7QUFJQSxXQUFLZ0QsT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFLQyxpQkFBTCxDQUF1QixhQUF2QjtBQUNEOzs7c0NBRXlCVixLLEVBQWU7QUFDdkMsVUFBSTtBQUNGLFlBQU1XLEVBQUUsR0FBRyxLQUFLckMsR0FBTCxDQUFTc0MsaUJBQVQsQ0FBMkJaLEtBQTNCLENBQVg7QUFDQSxhQUFLQyxpQkFBTCxDQUF1QlUsRUFBdkI7QUFDQSxhQUFLbkMsWUFBTCxDQUFrQndCLEtBQWxCLElBQTJCVyxFQUEzQjtBQUNELE9BSkQsQ0FJRSxPQUFPRSxHQUFQLEVBQVk7QUFDWnJELFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDJCQUEyQm9ELEdBQUcsQ0FBQ0MsT0FBM0M7QUFDRDtBQUNGOzs7c0NBRXlCZixPLEVBQXlCO0FBQUE7O0FBQ2pEQSxNQUFBQSxPQUFPLENBQUNnQixNQUFSLEdBQWlCLFlBQU07QUFDckIsWUFBSSxNQUFJLENBQUNsQyxNQUFULEVBQWlCO0FBQ2YsVUFBQSxNQUFJLENBQUNULGFBQUwsQ0FBbUI0QyxTQUFuQixDQUE2QixNQUFJLENBQUNuQyxNQUFsQztBQUNEOztBQUNELFlBQUksQ0FBQyxNQUFJLENBQUNKLFdBQVYsRUFBdUIsTUFBSSxDQUFDSyxPQUFMO0FBQ3ZCLFFBQUEsTUFBSSxDQUFDTCxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsUUFBQSxNQUFJLENBQUNFLGNBQUwsR0FBc0IsS0FBdEI7QUFDRCxPQVBEOztBQVFBb0IsTUFBQUEsT0FBTyxDQUFDa0IsU0FBUixHQUFvQixVQUFBQyxLQUFLLEVBQUk7QUFDM0I3RCxRQUFBQSxXQUFXLENBQUMsTUFBSSxDQUFDWSxNQUFOLEVBQWM7QUFDdkIrQixVQUFBQSxLQUFLLEVBQUVELE9BQU8sQ0FBQ0MsS0FEUTtBQUV2QmhDLFVBQUFBLElBQUksRUFBRWtELEtBQUssQ0FBQ2xELElBRlc7QUFHdkJZLFVBQUFBLE1BQU0sRUFBRSxNQUFJLENBQUNBO0FBSFUsU0FBZCxDQUFYO0FBS0QsT0FORDs7QUFPQW1CLE1BQUFBLE9BQU8sQ0FBQ29CLE9BQVIsR0FBa0IsVUFBQUMsR0FBRyxFQUFJO0FBQ3ZCNUQsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksd0JBQXdCMkQsR0FBcEM7QUFDRCxPQUZEOztBQUdBckIsTUFBQUEsT0FBTyxDQUFDc0IsT0FBUixHQUFrQixZQUFNO0FBQ3RCN0QsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksdUJBQVo7QUFDQSxRQUFBLE1BQUksQ0FBQ2lCLGNBQUwsR0FBc0IsSUFBdEI7O0FBQ0EsUUFBQSxNQUFJLENBQUNLLFVBQUw7QUFDRCxPQUpEO0FBS0Q7Ozs4QkFFU0UsRyxFQUFVTCxNLEVBQWlCO0FBQ25DLFdBQUtOLEdBQUwsQ0FDR2dELG9CQURILENBQ3dCLElBQUlDLDJCQUFKLENBQTBCdEMsR0FBMUIsQ0FEeEIsRUFFR3FCLEtBRkgsQ0FFUzlDLE9BQU8sQ0FBQ0MsR0FGakI7QUFHQSxXQUFLbUIsTUFBTCxHQUFjQSxNQUFNLElBQUksS0FBS0EsTUFBN0I7QUFDRDs7Ozs7O2dEQUdDSyxHLEVBQ0FsQixHOzs7Ozs7QUFFQSxxQkFBS08sR0FBTCxHQUFXLEtBQUtDLG9CQUFMLENBQTBCUixHQUExQixDQUFYOzt1QkFDTSxLQUFLTyxHQUFMLENBQ0hnRCxvQkFERyxDQUNrQixJQUFJQywyQkFBSixDQUEwQnRDLEdBQTFCLENBRGxCLEVBRUhxQixLQUZHLENBRUc5QyxPQUFPLENBQUNDLEdBRlgsQzs7Ozt1QkFHZSxLQUFLYSxHQUFMLENBQVNrRCxZQUFULEdBQXdCbEIsS0FBeEIsQ0FBOEI5QyxPQUFPLENBQUNDLEdBQXRDLEM7OztBQUFmZ0UsZ0JBQUFBLE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS25ELEdBQUwsQ0FBU2tDLG1CQUFULENBQTZCaUIsTUFBN0IsRUFBcUNuQixLQUFyQyxDQUEyQzlDLE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFHZk8sSSxFQUFXZ0MsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDdEMsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS2EsWUFBakIsRUFBK0JrRCxRQUEvQixDQUF3QzFCLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS1UsaUJBQUwsQ0FBdUJWLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt4QixZQUFMLENBQWtCd0IsS0FBbEIsRUFBeUIyQixJQUF6QixDQUE4QjNELElBQTlCO0FBQ0QsT0FGRCxDQUVFLE9BQU80RCxLQUFQLEVBQWM7QUFDZHBFLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVosRUFBNkJtRSxLQUE3QjtBQUNBLGFBQUtsRCxjQUFMLEdBQXNCLElBQXRCO0FBQ0Q7QUFDRjs7OytCQUVVRSxNLEVBQWdCO0FBQ3pCLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5pbXBvcnQgeyBtZXNzYWdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL3N0cmVhbVwiO1xuXG5mdW5jdGlvbiBleGN1dGVFdmVudChldjogYW55LCB2PzogYW55KSB7XG4gIGNvbnNvbGUubG9nKFwiZXhjdXRlRXZlbnRcIiwgZXYpO1xuICBPYmplY3Qua2V5cyhldikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGV2W2tleV0odik7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJSVEMge1xuICBydGM6IFJUQ1BlZXJDb25uZWN0aW9uO1xuXG4gIHNpZ25hbDogKHNkcDogYW55KSA9PiB2b2lkO1xuICBjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uRGF0YTogeyBba2V5OiBzdHJpbmddOiAocmF3OiBtZXNzYWdlKSA9PiB2b2lkIH0gPSB7fTtcbiAgcHJpdmF0ZSBvbkFkZFRyYWNrOiB7IFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkIH0gPSB7fTtcbiAgZXZlbnRzID0ge1xuICAgIGRhdGE6IHRoaXMub25EYXRhLFxuICAgIHRyYWNrOiB0aGlzLm9uQWRkVHJhY2tcbiAgfTtcblxuICBkYXRhQ2hhbm5lbHM6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBpc0Rpc2Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgb25pY2VjYW5kaWRhdGU6IGJvb2xlYW47XG4gIHN0cmVhbT86IE1lZGlhU3RyZWFtO1xuICBzdHJlYW1NYW5hZ2VyOiBTdHJlYW07XG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgY29uc3RydWN0b3Iob3B0PzogeyBub2RlSWQ/OiBzdHJpbmc7IHN0cmVhbT86IE1lZGlhU3RyZWFtIH0pIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5zdHJlYW1NYW5hZ2VyID0gbmV3IFN0cmVhbSh0aGlzKTtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IG9wdC5zdHJlYW07XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5zaWduYWwgPSBzZHAgPT4ge307XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVOZXdDb25uZWN0aW9uKG9wdD86IGFueSkge1xuICAgIGlmIChvcHQpIGlmIChvcHQubm9kZUlkKSB0aGlzLm5vZGVJZCA9IG9wdC5ub2RlSWQ7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmIChvcHQgPT09IHVuZGVmaW5lZCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGlzYWJsZSBzdHVuXCIpO1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVlciA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICAgIGljZVNlcnZlcnM6IFt7IHVybHM6IFwic3R1bjpzdHVuLndlYnJ0Yy5lY2wubnR0LmNvbTozNDc4XCIgfV1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5vbmljZWNhbmRpZGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGVlci5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICB0aGlzLm5vZGVJZCxcbiAgICAgICAgXCJJQ0UgY29ubmVjdGlvbiBTdGF0dXMgaGFzIGNoYW5nZWQgdG8gXCIgKyBwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZVxuICAgICAgKTtcbiAgICAgIHN3aXRjaCAocGVlci5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImNsb3NlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzY29ubmVjdGVkXCI6XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0PzogeyBkaXNhYmxlX3N0dW4/OiBib29sZWFuOyBub2RlSWQ/OiBzdHJpbmcgfSkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBlc3RhYmxpc2hlZCBlcnJvcjogXCIgKyBkY2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RyZWFtKSB7XG4gICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlci5hZGRTdHJlYW0odGhpcy5zdHJlYW0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICBleGN1dGVFdmVudCh0aGlzLm9uRGF0YSwge1xuICAgICAgICBsYWJlbDogY2hhbm5lbC5sYWJlbCxcbiAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgbm9kZUlkOiB0aGlzLm5vZGVJZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uZXJyb3IgPSBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhY2hhbm5lbCBFcnJvcjogXCIgKyBlcnIpO1xuICAgIH07XG4gICAgY2hhbm5lbC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhQ2hhbm5lbCBpcyBjbG9zZWRcIik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIH07XG4gIH1cblxuICBzZXRBbnN3ZXIoc2RwOiBhbnksIG5vZGVJZD86IHN0cmluZykge1xuICAgIHRoaXMucnRjXG4gICAgICAuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApKVxuICAgICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICB0aGlzLm5vZGVJZCA9IG5vZGVJZCB8fCB0aGlzLm5vZGVJZDtcbiAgfVxuXG4gIGFzeW5jIG1ha2VBbnN3ZXIoXG4gICAgc2RwOiBhbnksXG4gICAgb3B0PzogeyBkaXNhYmxlX3N0dW4/OiBib29sZWFuOyBub2RlSWQ/OiBzdHJpbmcgfVxuICApIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgdGhpcy5ydGMuY3JlYXRlQW5zd2VyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGlmIChhbnN3ZXIpIGF3YWl0IHRoaXMucnRjLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gIH1cblxuICBzZW5kKGRhdGE6IGFueSwgbGFiZWw/OiBzdHJpbmcpIHtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IFwiZGF0YWNoYW5uZWxcIjtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==