"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excuteEvent = excuteEvent;
exports.addEvent = addEvent;
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

function addEvent(event, func, _tag) {
  var tag = _tag || function () {
    var gen = Math.random().toString();

    while (Object.keys(event).includes(gen)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsIl90YWciLCJ0YWciLCJnZW4iLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJpbmNsdWRlcyIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm9uaWNlY2FuZGlkYXRlIiwibm9kZUlkIiwic3RyZWFtIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJzaWduYWwiLCJzZHAiLCJwZWVyIiwiZGlzYWJsZV9zdHVuIiwiUlRDUGVlckNvbm5lY3Rpb24iLCJpY2VTZXJ2ZXJzIiwidXJscyIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9uZGF0YWNoYW5uZWwiLCJkYXRhQ2hhbm5lbCIsImNoYW5uZWwiLCJsYWJlbCIsImRhdGFDaGFubmVsRXZlbnRzIiwib250cmFjayIsInN0cmVhbXMiLCJvbmFkZHRyYWNrIiwidHJhY2siLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJjcmVhdGVEYXRhY2hhbm5lbCIsImRjIiwiY3JlYXRlRGF0YUNoYW5uZWwiLCJkY2UiLCJtZXNzYWdlIiwib25vcGVuIiwib25tZXNzYWdlIiwiZGF0YSIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9u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LE07O3FCQUNGQSxNOzs7Ozs7dUJBQWMsS0FBS25ELEdBQUwsQ0FBU21DLG1CQUFULENBQTZCZ0IsTUFBN0IsRUFBcUNsQixLQUFyQyxDQUEyQ3RELE9BQU8sQ0FBQ0MsR0FBbkQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUdmZ0UsSSxFQUFXbkIsSyxFQUFnQjtBQUM5QkEsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksYUFBakI7O0FBQ0EsVUFBSSxDQUFDNUMsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS29CLFlBQWpCLEVBQStCUixRQUEvQixDQUF3QytCLEtBQXhDLENBQUwsRUFBcUQ7QUFDbkQsYUFBS1ksaUJBQUwsQ0FBdUJaLEtBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLGFBQUt2QixZQUFMLENBQWtCdUIsS0FBbEIsRUFBeUIyQixJQUF6QixDQUE4QlIsSUFBOUI7QUFDRCxPQUZELENBRUUsT0FBT2pELEtBQVAsRUFBYztBQUNkaEIsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUE2QmUsS0FBN0I7QUFDQSxhQUFLUyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsYUFBS0ssVUFBTDtBQUNEO0FBQ0Y7OzsrQkFFVUgsTSxFQUFnQjtBQUN6QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCB7IFJUQ1BlZXJDb25uZWN0aW9uLCBSVENTZXNzaW9uRGVzY3JpcHRpb24gfSBmcm9tIFwid3J0Y1wiO1xuaW1wb3J0IHsgbWVzc2FnZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG5pbnRlcmZhY2Ugb3B0aW9uIHtcbiAgZGlzYWJsZV9zdHVuPzogYm9vbGVhbjtcbiAgbm9kZUlkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YSB7XG4gIFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG59XG5pbnRlcmZhY2UgT25BZGRUcmFjayB7XG4gIFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xufVxuXG50eXBlIEV2ZW50ID0gT25EYXRhIHwgT25BZGRUcmFjaztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBFdmVudCwgdj86IGFueSkge1xuICBjb25zb2xlLmxvZyhcImV4Y3V0ZUV2ZW50XCIsIHsgZXYgfSk7XG4gIE9iamVjdC5rZXlzKGV2KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgZnVuYzogYW55ID0gZXZba2V5XTtcbiAgICBpZiAodikge1xuICAgICAgZnVuYyh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuYygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudDxUIGV4dGVuZHMgRXZlbnQ+KFxuICBldmVudDogVCxcbiAgZnVuYzogVFtrZXlvZiBUXSxcbiAgX3RhZz86IHN0cmluZ1xuKSB7XG4gIGNvbnN0IHRhZyA9XG4gICAgX3RhZyB8fFxuICAgICgoKSA9PiB7XG4gICAgICBsZXQgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgd2hpbGUgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyhnZW4pKSB7XG4gICAgICAgIGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZW47XG4gICAgfSkoKTtcbiAgaWYgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyh0YWcpKSB7XG4gICAgY29uc29sZS5lcnJvcihcImluY2x1ZGUgdGFnXCIpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50W3RhZ10gPSBmdW5jO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25EYXRhOiBPbkRhdGEgPSB7fTtcbiAgYWRkT25EYXRhID0gKGZ1bmM6IE9uRGF0YVtrZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkRhdGE+KHRoaXMub25EYXRhLCBmdW5jLCB0YWcpO1xuICB9O1xuICBwcml2YXRlIG9uQWRkVHJhY2s6IE9uQWRkVHJhY2sgPSB7fTtcbiAgYWRkT25BZGRUcmFjayA9IChmdW5jOiBPbkFkZFRyYWNrW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uQWRkVHJhY2s+KHRoaXMub25BZGRUcmFjaywgZnVuYywgdGFnKTtcbiAgfTtcblxuICBwcml2YXRlIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuXG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcblxuICBpc09mZmVyID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKG9wdD86IHsgbm9kZUlkPzogc3RyaW5nOyBzdHJlYW0/OiBNZWRpYVN0cmVhbSB9KSB7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuZGF0YUNoYW5uZWxzID0ge307XG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5ub2RlSWQgPSBvcHQubm9kZUlkIHx8IFwicGVlclwiO1xuICAgIHRoaXMuc3RyZWFtID0gb3B0LnN0cmVhbTtcbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24ob3B0Pzogb3B0aW9uKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmICghb3B0KSBvcHQgPSB7fTtcbiAgICBpZiAob3B0Lm5vZGVJZCkgdGhpcy5ub2RlSWQgPSBvcHQubm9kZUlkO1xuICAgIGlmIChvcHQuZGlzYWJsZV9zdHVuKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRpc2FibGUgc3R1blwiKTtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsczogW1xuICAgICAgICAgICAgICBcInN0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDJcIixcbiAgICAgICAgICAgICAgXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIlxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uaWNlY2FuZGlkYXRlKSB7XG4gICAgICAgICAgdGhpcy5zaWduYWwocGVlci5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIHRoaXMubm9kZUlkLFxuICAgICAgICBcIklDRSBjb25uZWN0aW9uIFN0YXR1cyBoYXMgY2hhbmdlZCB0byBcIiArIHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgc3dpdGNoIChwZWVyLmljZUNvbm5lY3Rpb25TdGF0ZSkge1xuICAgICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3RlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29tcGxldGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXNjb25uZWN0ZWRcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIndlYnJ0YzRtZSBkaXNjb25uZWN0ZWRcIik7XG4gICAgICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub250cmFjayA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBldnQuc3RyZWFtc1swXTtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25BZGRUcmFjaywgc3RyZWFtKTtcbiAgICAgIHN0cmVhbS5vbmFkZHRyYWNrID0gdHJhY2sgPT4ge1xuICAgICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHRyYWNrKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbWFrZU9mZmVyKG9wdD86IG9wdGlvbikge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbihvcHQpO1xuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvZmZlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKG9mZmVyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHRoaXMuY29ubmVjdCgpO1xuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gZmFsc2U7XG4gICAgfTtcbiAgICBjaGFubmVsLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgIGxhYmVsOiBjaGFubmVsLmxhYmVsLFxuICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkIHx8IHRoaXMubm9kZUlkO1xuICB9XG5cbiAgYXN5bmMgbWFrZUFuc3dlcihzZHA6IGFueSwgb3B0Pzogb3B0aW9uKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKG9wdCk7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICBpZiAoYW5zd2VyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICB9XG5cbiAgc2VuZChkYXRhOiBhbnksIGxhYmVsPzogc3RyaW5nKSB7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCBcImRhdGFjaGFubmVsXCI7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmRhdGFDaGFubmVscykuaW5jbHVkZXMobGFiZWwpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKGxhYmVsKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXS5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIHNlbmQgZXJyb3JcIiwgZXJyb3IpO1xuICAgICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0aW5nKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQ7XG4gIH1cbn1cbiJdfQ==