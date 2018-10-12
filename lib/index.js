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
  }]);

  return WebRTC;
}();

exports.default = WebRTC;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiV2ViUlRDIiwiX25vZGVJZCIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwiY29ubmVjdCIsImRhdGEiLCJyYXciLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwib3B0IiwicGVlciIsInVuZGVmaW5lZCIsImRpc2FibGVfc3R1biIsImNvbnNvbGUiLCJsb2ciLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJlcnJvciIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFEQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0lBR3FCQyxNOzs7QUFXbkIsa0JBQVlDLE9BQVosRUFBNkI7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDM0IsU0FBS0MsR0FBTCxHQUFXLEtBQUtDLG9CQUFMLEVBQVg7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLE1BQWQ7O0FBQ0EsU0FBS0MsT0FBTCxHQUFlLFlBQU0sQ0FBRSxDQUF2Qjs7QUFDQSxTQUFLQyxJQUFMLEdBQVksVUFBQUMsR0FBRyxFQUFJLENBQUUsQ0FBckI7O0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixZQUFNLENBQUUsQ0FBMUI7O0FBQ0EsU0FBS0MsTUFBTCxHQUFjLFVBQUFDLEdBQUcsRUFBSSxDQUFFLENBQXZCO0FBQ0Q7Ozs7eUNBRTRCQyxHLEVBQVc7QUFBQTs7QUFDdEMsVUFBSUEsR0FBSixFQUFTLElBQUlBLEdBQUcsQ0FBQ1AsTUFBUixFQUFnQixLQUFLQSxNQUFMLEdBQWNPLEdBQUcsQ0FBQ1AsTUFBbEI7QUFDekIsVUFBSVEsSUFBSjtBQUNBLFVBQUlELEdBQUcsS0FBS0UsU0FBWixFQUF1QkYsR0FBRyxHQUFHLEVBQU47O0FBQ3ZCLFVBQUlBLEdBQUcsQ0FBQ0csWUFBUixFQUFzQjtBQUNwQkMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWjtBQUNBSixRQUFBQSxJQUFJLEdBQUcsSUFBSUssdUJBQUosQ0FBc0I7QUFDM0JDLFVBQUFBLFVBQVUsRUFBRTtBQURlLFNBQXRCLENBQVA7QUFHRCxPQUxELE1BS087QUFDTE4sUUFBQUEsSUFBSSxHQUFHLElBQUlLLHVCQUFKLENBQXNCO0FBQzNCQyxVQUFBQSxVQUFVLEVBQUUsQ0FBQztBQUFFQyxZQUFBQSxJQUFJLEVBQUU7QUFBUixXQUFEO0FBRGUsU0FBdEIsQ0FBUDtBQUdEOztBQUVEUCxNQUFBQSxJQUFJLENBQUNULGNBQUwsR0FBc0IsVUFBQWlCLEdBQUcsRUFBSTtBQUMzQixZQUFJLENBQUNBLEdBQUcsQ0FBQ0MsU0FBVCxFQUFvQjtBQUNsQixjQUFJLENBQUMsS0FBSSxDQUFDbEIsY0FBVixFQUEwQjtBQUN4QixZQUFBLEtBQUksQ0FBQ00sTUFBTCxDQUFZRyxJQUFJLENBQUNVLGdCQUFqQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ25CLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDtBQUNGO0FBQ0YsT0FQRDs7QUFTQVMsTUFBQUEsSUFBSSxDQUFDVywwQkFBTCxHQUFrQyxZQUFNO0FBQ3RDUixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FDRSxLQUFJLENBQUNaLE1BRFAsRUFFRSwwQ0FBMENRLElBQUksQ0FBQ1ksa0JBRmpEOztBQUlBLGdCQUFRWixJQUFJLENBQUNZLGtCQUFiO0FBQ0UsZUFBSyxRQUFMO0FBQ0UsWUFBQSxLQUFJLENBQUNoQixVQUFMOztBQUNBLFlBQUEsS0FBSSxDQUFDTixjQUFMLEdBQXNCLElBQXRCO0FBQ0EsWUFBQSxLQUFJLENBQUNELFdBQUwsR0FBbUIsS0FBbkI7QUFDQTs7QUFDRixlQUFLLFFBQUw7QUFDRTs7QUFDRixlQUFLLFdBQUw7QUFDRSxZQUFBLEtBQUksQ0FBQ0EsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFlBQUEsS0FBSSxDQUFDRSxjQUFMLEdBQXNCLEtBQXRCOztBQUNBLFlBQUEsS0FBSSxDQUFDRSxPQUFMOztBQUNBOztBQUNGLGVBQUssV0FBTDtBQUNFLGdCQUFJLENBQUMsS0FBSSxDQUFDSixXQUFWLEVBQXVCO0FBQ3JCLGNBQUEsS0FBSSxDQUFDQSxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsY0FBQSxLQUFJLENBQUNFLGNBQUwsR0FBc0IsS0FBdEI7O0FBQ0EsY0FBQSxLQUFJLENBQUNFLE9BQUw7QUFDRDs7QUFDRDtBQW5CSjtBQXFCRCxPQTFCRDs7QUE0QkFPLE1BQUFBLElBQUksQ0FBQ2EsYUFBTCxHQUFxQixVQUFBTCxHQUFHLEVBQUk7QUFDMUIsWUFBTU0sV0FBVyxHQUFHTixHQUFHLENBQUNPLE9BQXhCO0FBQ0EsUUFBQSxLQUFJLENBQUMzQixZQUFMLENBQWtCMEIsV0FBVyxDQUFDRSxLQUE5QixJQUF1Q0YsV0FBdkM7O0FBQ0EsUUFBQSxLQUFJLENBQUNHLGlCQUFMLENBQXVCSCxXQUF2QjtBQUNELE9BSkQ7O0FBTUEsYUFBT2QsSUFBUDtBQUNEOzs7OEJBRVNELEcsRUFBbUQ7QUFBQTs7QUFDM0QsV0FBS2IsR0FBTCxHQUFXLEtBQUtDLG9CQUFMLENBQTBCWSxHQUExQixDQUFYO0FBQ0EsV0FBS2IsR0FBTCxDQUFTZ0MsbUJBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQSw4QkFBK0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFDWCxNQUFJLENBQUNoQyxHQUFMLENBQVNpQyxXQUFULEdBQXVCQyxLQUF2QixDQUE2QmpCLE9BQU8sQ0FBQ0MsR0FBckMsQ0FEVzs7QUFBQTtBQUN6QmlCLGdCQUFBQSxLQUR5Qjs7QUFBQSxxQkFFekJBLEtBRnlCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsdUJBRVosTUFBSSxDQUFDbkMsR0FBTCxDQUFTb0MsbUJBQVQsQ0FBNkJELEtBQTdCLEVBQW9DRCxLQUFwQyxDQUEwQ2pCLE9BQU8sQ0FBQ0MsR0FBbEQsQ0FGWTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUEvQjtBQUlBLFdBQUttQixpQkFBTCxDQUF1QixhQUF2QjtBQUNEOzs7c0NBRXlCUCxLLEVBQWU7QUFDdkMsVUFBSTtBQUNGLFlBQU1RLEVBQUUsR0FBRyxLQUFLdEMsR0FBTCxDQUFTdUMsaUJBQVQsQ0FBMkJULEtBQTNCLENBQVg7QUFDQSxhQUFLQyxpQkFBTCxDQUF1Qk8sRUFBdkI7QUFDQSxhQUFLcEMsWUFBTCxDQUFrQjRCLEtBQWxCLElBQTJCUSxFQUEzQjtBQUNELE9BSkQsQ0FJRSxPQUFPRSxHQUFQLEVBQVk7QUFDWnZCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDJCQUEyQnNCLEdBQUcsQ0FBQ0MsT0FBM0M7QUFDRDtBQUNGOzs7c0NBRXlCWixPLEVBQXlCO0FBQUE7O0FBQ2pEQSxNQUFBQSxPQUFPLENBQUNhLE1BQVIsR0FBaUIsWUFBTSxDQUNyQjtBQUNBO0FBQ0E7QUFDRCxPQUpEOztBQUtBYixNQUFBQSxPQUFPLENBQUNjLFNBQVIsR0FBb0IsVUFBQUMsS0FBSyxFQUFJO0FBQzNCLFFBQUEsTUFBSSxDQUFDcEMsSUFBTCxDQUFVO0FBQ1JzQixVQUFBQSxLQUFLLEVBQUVELE9BQU8sQ0FBQ0MsS0FEUDtBQUVSdEIsVUFBQUEsSUFBSSxFQUFFb0MsS0FBSyxDQUFDcEMsSUFGSjtBQUdSRixVQUFBQSxNQUFNLEVBQUUsTUFBSSxDQUFDQTtBQUhMLFNBQVY7QUFLRCxPQU5EOztBQU9BdUIsTUFBQUEsT0FBTyxDQUFDZ0IsT0FBUixHQUFrQixVQUFBQyxHQUFHLEVBQUk7QUFDdkI3QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSx3QkFBd0I0QixHQUFwQztBQUNELE9BRkQ7O0FBR0FqQixNQUFBQSxPQUFPLENBQUNrQixPQUFSLEdBQWtCLFlBQU07QUFDdEI5QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSx1QkFBWjtBQUNBLFFBQUEsTUFBSSxDQUFDZCxjQUFMLEdBQXNCLElBQXRCOztBQUNBLFFBQUEsTUFBSSxDQUFDTSxVQUFMO0FBQ0QsT0FKRDtBQUtEOzs7OEJBRVNFLEcsRUFBVU4sTSxFQUFpQjtBQUNuQyxVQUFJO0FBQ0YsYUFBS04sR0FBTCxDQUFTZ0Qsb0JBQVQsQ0FBOEIsSUFBSUMsMkJBQUosQ0FBMEJyQyxHQUExQixDQUE5QjtBQUNBLFlBQUlOLE1BQUosRUFBWSxLQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDYixPQUhELENBR0UsT0FBT3dDLEdBQVAsRUFBWTtBQUNaN0IsUUFBQUEsT0FBTyxDQUFDaUMsS0FBUixDQUFjLHNDQUFkLEVBQXNESixHQUF0RDtBQUNEO0FBQ0Y7Ozs7OztnREFHQ2xDLEcsRUFDQUMsRzs7Ozs7O0FBRUEscUJBQUtiLEdBQUwsR0FBVyxLQUFLQyxvQkFBTCxDQUEwQlksR0FBMUIsQ0FBWDs7dUJBQ00sS0FBS2IsR0FBTCxDQUNIZ0Qsb0JBREcsQ0FDa0IsSUFBSUMsMkJBQUosQ0FBMEJyQyxHQUExQixDQURsQixFQUVIc0IsS0FGRyxDQUVHakIsT0FBTyxDQUFDQyxHQUZYLEM7Ozs7dUJBR2UsS0FBS2xCLEdBQUwsQ0FBU21ELFlBQVQsR0FBd0JqQixLQUF4QixDQUE4QmpCLE9BQU8sQ0FBQ0MsR0FBdEMsQzs7O0FBQWZrQyxnQkFBQUEsTTs7cUJBQ0ZBLE07Ozs7Ozt1QkFBYyxLQUFLcEQsR0FBTCxDQUFTb0MsbUJBQVQsQ0FBNkJnQixNQUE3QixFQUFxQ2xCLEtBQXJDLENBQTJDakIsT0FBTyxDQUFDQyxHQUFuRCxDOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUdmVixJLEVBQVdzQixLLEVBQWU7QUFDN0IsVUFBSSxDQUFDdUIsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS3BELFlBQWpCLEVBQStCcUQsUUFBL0IsQ0FBd0N6QixLQUF4QyxDQUFMLEVBQXFEO0FBQ25ELGFBQUtPLGlCQUFMLENBQXVCUCxLQUF2QjtBQUNEOztBQUNELFVBQUk7QUFDRixhQUFLNUIsWUFBTCxDQUFrQjRCLEtBQWxCLEVBQXlCMEIsSUFBekIsQ0FBOEJoRCxJQUE5QjtBQUNELE9BRkQsQ0FFRSxPQUFPMEMsS0FBUCxFQUFjO0FBQ2RqQyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCZ0MsS0FBN0I7QUFDQSxhQUFLOUMsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgeyBSVENQZWVyQ29ubmVjdGlvbiwgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIH0gZnJvbSBcIndydGNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViUlRDIHtcbiAgcnRjOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRhdGE6IChyYXc6IGFueSkgPT4gdm9pZDtcbiAgZGlzY29ubmVjdDogKCkgPT4gdm9pZDtcbiAgZGF0YUNoYW5uZWxzOiBhbnk7XG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBjb25zdHJ1Y3Rvcihfbm9kZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMubm9kZUlkID0gXCJwZWVyXCI7XG4gICAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge307XG4gICAgdGhpcy5kYXRhID0gcmF3ID0+IHt9O1xuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuc2lnbmFsID0gc2RwID0+IHt9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQ/OiBhbnkpIHtcbiAgICBpZiAob3B0KSBpZiAob3B0Lm5vZGVJZCkgdGhpcy5ub2RlSWQgPSBvcHQubm9kZUlkO1xuICAgIGxldCBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbjtcbiAgICBpZiAob3B0ID09PSB1bmRlZmluZWQpIG9wdCA9IHt9O1xuICAgIGlmIChvcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRpc2FibGUgc3R1blwiKTtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbeyB1cmxzOiBcInN0dW46c3R1bi53ZWJydGMuZWNsLm50dC5jb206MzQ3OFwiIH1dXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwZWVyLm9uaWNlY2FuZGlkYXRlID0gZXZ0ID0+IHtcbiAgICAgIGlmICghZXZ0LmNhbmRpZGF0ZSkge1xuICAgICAgICBpZiAoIXRoaXMub25pY2VjYW5kaWRhdGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hbChwZWVyLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgdGhpcy5ub2RlSWQsXG4gICAgICAgIFwiSUNFIGNvbm5lY3Rpb24gU3RhdHVzIGhhcyBjaGFuZ2VkIHRvIFwiICsgcGVlci5pY2VDb25uZWN0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbXBsZXRlZFwiOlxuICAgICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBlZXI7XG4gIH1cblxuICBtYWtlT2ZmZXIob3B0PzogeyBkaXNhYmxlX3N0dW4/OiBib29sZWFuOyBub2RlSWQ/OiBzdHJpbmcgfSkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChcImRhdGFjaGFubmVsXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEYXRhY2hhbm5lbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRjID0gdGhpcy5ydGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYyk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0gPSBkYztcbiAgICB9IGNhdGNoIChkY2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgZXN0YWJsaXNoZWQgZXJyb3I6IFwiICsgZGNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0YUNoYW5uZWxFdmVudHMoY2hhbm5lbDogUlRDRGF0YUNoYW5uZWwpIHtcbiAgICBjaGFubmVsLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIC8vICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAvLyAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICAgIC8vICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZGF0YSh7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSk7XG4gICAgICBpZiAobm9kZUlkKSB0aGlzLm5vZGVJZCA9IG5vZGVJZDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJzZXRSZW1vdGVEZXNjcmlwdGlvbihhbnN3ZXIpIEVSUk9SOiBcIiwgZXJyKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKFxuICAgIHNkcDogYW55LFxuICAgIG9wdD86IHsgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjsgbm9kZUlkPzogc3RyaW5nIH1cbiAgKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoYW5zd2VyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsOiBzdHJpbmcpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuZGF0YUNoYW5uZWxzKS5pbmNsdWRlcyhsYWJlbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwobGFiZWwpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGMgc2VuZCBlcnJvclwiLCBlcnJvcik7XG4gICAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==