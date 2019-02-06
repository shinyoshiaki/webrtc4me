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
  function WebRTC() {
    var _this = this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

    _defineProperty(this, "opt", void 0);

    _defineProperty(this, "isOffer", false);

    _defineProperty(this, "negotiating", false);

    this.opt = opt;
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.nodeId = this.opt.nodeId || "peer";

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection() {
      var _this2 = this;

      var peer;
      if (this.opt.nodeId) this.nodeId = this.opt.nodeId;

      if (this.opt.disable_stun) {
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
        if (!evt.candidate && peer.localDescription) {
          _this2.signal(peer.localDescription);

          if (_this2.isConnected && _this2.isOffer) {
            _this2.sendSdp("offer", _this2.rtc.localDescription);
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

            _this2.hangUp();

            break;
        }
      };

      peer.ondatachannel = function (evt) {
        var dataChannel = evt.channel;
        _this2.dataChannels[dataChannel.label] = dataChannel;

        _this2.dataChannelEvents(dataChannel);
      };

      peer.onsignalingstatechange = function (e) {
        _this2.negotiating = peer.signalingState != "stable";
      };

      peer.ontrack = function (evt) {
        var stream = evt.streams[0];
        excuteEvent(_this2.onAddTrack, stream);
      };

      return peer;
    }
  }, {
    key: "hangUp",
    value: function hangUp() {
      this.isDisconnected = true;
      this.isConnected = false;
      this.disconnect();
    }
  }, {
    key: "makeOffer",
    value: function makeOffer() {
      var _this3 = this;

      this.rtc = this.prepareNewConnection();
      this.addStream();
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
                if (!_this3.negotiating) {
                  _context.next = 3;
                  break;
                }

                console.warn("dupli");
                return _context.abrupt("return");

              case 3:
                _this3.negotiating = true;
                _context.next = 6;
                return _this3.rtc.createOffer().catch(console.log);

              case 6:
                offer = _context.sent;

                if (!offer) {
                  _context.next = 10;
                  break;
                }

                _context.next = 10;
                return _this3.rtc.setLocalDescription(offer).catch(console.log);

              case 10:
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
    key: "sendSdp",
    value: function sendSdp(type, local) {
      var sdp = local;

      if (!local.type) {
        sdp = new _wrtc.RTCSessionDescription({
          type: type,
          sdp: local.sdp
        });
      }

      this.send(JSON.stringify({
        sdp: sdp
      }), "webrtc");
    }
  }, {
    key: "dataChannelEvents",
    value: function dataChannelEvents(channel) {
      var _this4 = this;

      channel.onopen = function () {
        if (!_this4.isConnected) {
          _this4.connect();

          _this4.isConnected = true;
        }
      };

      try {
        channel.onmessage =
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(event) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (event) {
                      _context2.next = 2;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 2:
                    excuteEvent(_this4.onData, {
                      label: channel.label,
                      data: event.data,
                      nodeId: _this4.nodeId
                    });

                    if (channel.label === "webrtc") {// const obj = JSON.parse(event.data);
                      // console.log({ obj });
                      // if (!obj || !obj.sdp) return;
                      // if (obj.sdp.type === "offer") {
                      //   console.log("debug offer", { obj });
                      //   await this.rtc.setRemoteDescription(obj.sdp);
                      //   const create = await this.rtc.createAnswer().catch(console.warn);
                      //   if (!create) return;
                      //   await this.rtc.setLocalDescription(create).catch(console.warn);
                      //   this.sendSdp("answer", this.rtc.localDescription);
                      // } else {
                      //   console.log("debug answer", { obj });
                      //   await this.rtc.setRemoteDescription(obj.sdp);
                      // }
                    }

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }();
      } catch (error) {
        console.log(error);
      }

      channel.onerror = function (err) {
        console.log("Datachannel Error: " + err);
      };

      channel.onclose = function () {
        console.log("DataChannel is closed");

        _this4.hangUp();
      };
    }
  }, {
    key: "addStream",
    value: function addStream() {
      var _this5 = this;

      if (this.opt.stream) {
        var _stream = this.opt.stream;

        _stream.getTracks().forEach(function (track) {
          return _this5.rtc.addTrack(track, _stream);
        });
      }
    }
  }, {
    key: "setAnswer",
    value: function () {
      var _setAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(sdp, nodeId) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 2:
                this.nodeId = nodeId || this.nodeId;

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setAnswer(_x2, _x3) {
        return _setAnswer.apply(this, arguments);
      }

      return setAnswer;
    }()
  }, {
    key: "makeAnswer",
    value: function () {
      var _makeAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(sdp) {
        var answer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.rtc = this.prepareNewConnection();
                this.addStream();
                console.log({
                  sdp: sdp
                });
                _context4.next = 5;
                return this.rtc.setRemoteDescription(new _wrtc.RTCSessionDescription(sdp)).catch(console.log);

              case 5:
                _context4.next = 7;
                return this.rtc.createAnswer().catch(console.log);

              case 7:
                answer = _context4.sent;

                if (!answer) {
                  _context4.next = 11;
                  break;
                }

                _context4.next = 11;
                return this.rtc.setLocalDescription(answer).catch(console.log);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function makeAnswer(_x4) {
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
        this.hangUp();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZXhjdXRlRXZlbnQiLCJldiIsInYiLCJjb25zb2xlIiwibG9nIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmdW5jIiwiYWRkRXZlbnQiLCJldmVudCIsIl90YWciLCJ0YWciLCJnZW4iLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJpbmNsdWRlcyIsImVycm9yIiwiV2ViUlRDIiwib3B0Iiwib25EYXRhIiwib25BZGRUcmFjayIsInJ0YyIsInByZXBhcmVOZXdDb25uZWN0aW9uIiwiZGF0YUNoYW5uZWxzIiwiaXNDb25uZWN0ZWQiLCJpc0Rpc2Nvbm5lY3RlZCIsIm5vZGVJZCIsImNvbm5lY3QiLCJkaXNjb25uZWN0Iiwic2lnbmFsIiwic2RwIiwicGVlciIsImRpc2FibGVfc3R1biIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsInVybHMiLCJvbmljZWNhbmRpZGF0ZSIsImV2dCIsImNhbmRpZGF0ZSIsImxvY2FsRGVzY3JpcHRpb24iLCJpc09mZmVyIiwic2VuZFNkcCIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwiaGFuZ1VwIiwib25kYXRhY2hhbm5lbCIsImRhdGFDaGFubmVsIiwiY2hhbm5lbCIsImxhYmVsIiwiZGF0YUNoYW5uZWxFdmVudHMiLCJvbnNpZ25hbGluZ3N0YXRlY2hhbmdlIiwiZSIsIm5lZ290aWF0aW5nIiwic2lnbmFsaW5nU3RhdGUiLCJvbnRyYWNrIiwic3RyZWFtIiwic3RyZWFtcyIsImFkZFN0cmVhbSIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJ3YXJuIiwiY3JlYXRlT2ZmZXIiLCJjYXRjaCIsIm9mZmVyIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGFjaGFubmVsIiwiZGMiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsImRjZSIsIm1lc3NhZ2UiLCJ0eXBlIiwibG9jYWwiLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmVycm9yIiwiZXJyIiwib25jbG9zZSIsImdldFRyYWNrcyIsInRyYWNrIiwiYWRkVHJhY2siLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsImNyZWF0ZUFuc3dlciIsImFuc3dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQXlCTyxTQUFTQyxXQUFULENBQXFCQyxFQUFyQixFQUFnQ0MsQ0FBaEMsRUFBeUM7QUFDOUNDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkI7QUFBRUgsSUFBQUEsRUFBRSxFQUFGQTtBQUFGLEdBQTNCO0FBQ0FJLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxFQUFaLEVBQWdCTSxPQUFoQixDQUF3QixVQUFBQyxHQUFHLEVBQUk7QUFDN0IsUUFBTUMsSUFBUyxHQUFHUixFQUFFLENBQUNPLEdBQUQsQ0FBcEI7O0FBQ0EsUUFBSU4sQ0FBSixFQUFPO0FBQ0xPLE1BQUFBLElBQUksQ0FBQ1AsQ0FBRCxDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0xPLE1BQUFBLElBQUk7QUFDTDtBQUNGLEdBUEQ7QUFRRDs7QUFFTSxTQUFTQyxRQUFULENBQ0xDLEtBREssRUFFTEYsSUFGSyxFQUdMRyxJQUhLLEVBSUw7QUFDQSxNQUFNQyxHQUFHLEdBQ1BELElBQUksSUFDSCxZQUFNO0FBQ0wsUUFBSUUsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFWOztBQUNBLFdBQU9aLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSyxLQUFaLEVBQW1CTyxRQUFuQixDQUE0QkosR0FBNUIsQ0FBUCxFQUF5QztBQUN2Q0EsTUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE1BQUwsR0FBY0MsUUFBZCxFQUFOO0FBQ0Q7O0FBQ0QsV0FB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cmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuaW1wb3J0IHsgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB9IGZyb20gXCJ3cnRjXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW46IGJvb2xlYW47XG4gIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIG5vZGVJZDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YSB7XG4gIFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG59XG5pbnRlcmZhY2UgT25BZGRUcmFjayB7XG4gIFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xufVxuXG50eXBlIEV2ZW50ID0gT25EYXRhIHwgT25BZGRUcmFjaztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBFdmVudCwgdj86IGFueSkge1xuICBjb25zb2xlLmxvZyhcImV4Y3V0ZUV2ZW50XCIsIHsgZXYgfSk7XG4gIE9iamVjdC5rZXlzKGV2KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgZnVuYzogYW55ID0gZXZba2V5XTtcbiAgICBpZiAodikge1xuICAgICAgZnVuYyh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuYygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudDxUIGV4dGVuZHMgRXZlbnQ+KFxuICBldmVudDogVCxcbiAgZnVuYzogVFtrZXlvZiBUXSxcbiAgX3RhZz86IHN0cmluZ1xuKSB7XG4gIGNvbnN0IHRhZyA9XG4gICAgX3RhZyB8fFxuICAgICgoKSA9PiB7XG4gICAgICBsZXQgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgd2hpbGUgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyhnZW4pKSB7XG4gICAgICAgIGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZW47XG4gICAgfSkoKTtcbiAgaWYgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyh0YWcpKSB7XG4gICAgY29uc29sZS5lcnJvcihcImluY2x1ZGUgdGFnXCIpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50W3RhZ10gPSBmdW5jO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgc2lnbmFsOiAoc2RwOiBvYmplY3QpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25EYXRhOiBPbkRhdGEgPSB7fTtcbiAgYWRkT25EYXRhID0gKGZ1bmM6IE9uRGF0YVtrZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkRhdGE+KHRoaXMub25EYXRhLCBmdW5jLCB0YWcpO1xuICB9O1xuICBwcml2YXRlIG9uQWRkVHJhY2s6IE9uQWRkVHJhY2sgPSB7fTtcbiAgYWRkT25BZGRUcmFjayA9IChmdW5jOiBPbkFkZFRyYWNrW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uQWRkVHJhY2s+KHRoaXMub25BZGRUcmFjaywgZnVuYywgdGFnKTtcbiAgfTtcblxuICBwcml2YXRlIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuXG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG5cbiAgb3B0OiBQYXJ0aWFsPG9wdGlvbj47XG5cbiAgaXNPZmZlciA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9wdDogUGFydGlhbDxvcHRpb24+ID0ge30pIHtcbiAgICB0aGlzLm9wdCA9IG9wdDtcbiAgICB0aGlzLnJ0YyA9IHRoaXMucHJlcGFyZU5ld0Nvbm5lY3Rpb24oKTtcbiAgICB0aGlzLmRhdGFDaGFubmVscyA9IHt9O1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5ub2RlSWQgPSB0aGlzLm9wdC5ub2RlSWQgfHwgXCJwZWVyXCI7XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGlmICh0aGlzLm9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gdGhpcy5vcHQubm9kZUlkO1xuICAgIGlmICh0aGlzLm9wdC5kaXNhYmxlX3N0dW4pIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlZXIgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsczogW1xuICAgICAgICAgICAgICBcInN0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDJcIixcbiAgICAgICAgICAgICAgXCJzdHVuOnN0dW4ud2VicnRjLmVjbC5udHQuY29tOjM0NzhcIlxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGVlci5vbmljZWNhbmRpZGF0ZSA9IGV2dCA9PiB7XG4gICAgICBpZiAoIWV2dC5jYW5kaWRhdGUgJiYgcGVlci5sb2NhbERlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkICYmIHRoaXMuaXNPZmZlcikge1xuICAgICAgICAgIHRoaXMuc2VuZFNkcChcIm9mZmVyXCIsIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgdGhpcy5ub2RlSWQsXG4gICAgICAgIFwiSUNFIGNvbm5lY3Rpb24gU3RhdHVzIGhhcyBjaGFuZ2VkIHRvIFwiICsgcGVlci5pY2VDb25uZWN0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIGNvbnNvbGUubG9nKFwid2VicnRjNG1lIGRpc2Nvbm5lY3RlZFwiKTtcbiAgICAgICAgICB0aGlzLmhhbmdVcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwZWVyLm9uZGF0YWNoYW5uZWwgPSBldnQgPT4ge1xuICAgICAgY29uc3QgZGF0YUNoYW5uZWwgPSBldnQuY2hhbm5lbDtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2RhdGFDaGFubmVsLmxhYmVsXSA9IGRhdGFDaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbEV2ZW50cyhkYXRhQ2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHBlZXIub25zaWduYWxpbmdzdGF0ZWNoYW5nZSA9IGUgPT4ge1xuICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IHBlZXIuc2lnbmFsaW5nU3RhdGUgIT0gXCJzdGFibGVcIjtcbiAgICB9O1xuXG4gICAgcGVlci5vbnRyYWNrID0gZXZ0ID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGV2dC5zdHJlYW1zWzBdO1xuICAgICAgZXhjdXRlRXZlbnQodGhpcy5vbkFkZFRyYWNrLCBzdHJlYW0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcGVlcjtcbiAgfVxuXG4gIGhhbmdVcCgpIHtcbiAgICB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBuZWdvdGlhdGluZyA9IGZhbHNlO1xuICBtYWtlT2ZmZXIoKSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5hZGRTdHJlYW0oKTtcblxuICAgIHRoaXMucnRjLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5uZWdvdGlhdGluZykge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJkdXBsaVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5uZWdvdGlhdGluZyA9IHRydWU7XG4gICAgICBjb25zdCBvZmZlciA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZU9mZmVyKCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgaWYgKG9mZmVyKSBhd2FpdCB0aGlzLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgfTtcbiAgICB0aGlzLmlzT2ZmZXIgPSB0cnVlO1xuICAgIHRoaXMuY3JlYXRlRGF0YWNoYW5uZWwoXCJkYXRhY2hhbm5lbFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRGF0YWNoYW5uZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYyA9IHRoaXMucnRjLmNyZWF0ZURhdGFDaGFubmVsKGxhYmVsKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxFdmVudHMoZGMpO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbbGFiZWxdID0gZGM7XG4gICAgfSBjYXRjaCAoZGNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImRjIGVzdGFibGlzaGVkIGVycm9yOiBcIiArIGRjZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBzZW5kU2RwKHR5cGU6IHN0cmluZywgbG9jYWw6IGFueSkge1xuICAgIGxldCBzZHAgPSBsb2NhbDtcbiAgICBpZiAoIWxvY2FsLnR5cGUpIHtcbiAgICAgIHNkcCA9IG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oeyB0eXBlOiB0eXBlIGFzIGFueSwgc2RwOiBsb2NhbC5zZHAgfSk7XG4gICAgfVxuICAgIHRoaXMuc2VuZChKU09OLnN0cmluZ2lmeSh7IHNkcCB9KSwgXCJ3ZWJydGNcIik7XG4gIH1cblxuICBwcml2YXRlIGRhdGFDaGFubmVsRXZlbnRzKGNoYW5uZWw6IFJUQ0RhdGFDaGFubmVsKSB7XG4gICAgY2hhbm5lbC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwub25tZXNzYWdlID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm47XG4gICAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJ3ZWJydGNcIikge1xuICAgICAgICAgIC8vIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coeyBvYmogfSk7XG4gICAgICAgICAgLy8gaWYgKCFvYmogfHwgIW9iai5zZHApIHJldHVybjtcbiAgICAgICAgICAvLyBpZiAob2JqLnNkcC50eXBlID09PSBcIm9mZmVyXCIpIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiZGVidWcgb2ZmZXJcIiwgeyBvYmogfSk7XG4gICAgICAgICAgLy8gICBhd2FpdCB0aGlzLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihvYmouc2RwKTtcbiAgICAgICAgICAvLyAgIGNvbnN0IGNyZWF0ZSA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgICAgICAgLy8gICBpZiAoIWNyZWF0ZSkgcmV0dXJuO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihjcmVhdGUpLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgICAgICAgLy8gICB0aGlzLnNlbmRTZHAoXCJhbnN3ZXJcIiwgdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiZGVidWcgYW5zd2VyXCIsIHsgb2JqIH0pO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24ob2JqLnNkcCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfTtcbiAgfVxuXG4gIGFkZFN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5vcHQuc3RyZWFtKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLm9wdC5zdHJlYW07XG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0aGlzLnJ0Yy5hZGRUcmFjayh0cmFjaywgc3RyZWFtKSk7XG4gICAgfVxuICB9XG4gIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55KSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5hZGRTdHJlYW0oKTtcbiAgICBjb25zb2xlLmxvZyh7IHNkcCB9KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaGFuZ1VwKCk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=