"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excuteEvent = excuteEvent;
exports.addEvent = addEvent;
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    _defineProperty(this, "opt", void 0);

    _defineProperty(this, "isOffer", false);

    _defineProperty(this, "negotiating", false);

    this.opt = opt || {};
    this.rtc = this.prepareNewConnection();
    this.dataChannels = {};
    this.isConnected = false;
    this.isDisconnected = false;
    this.onicecandidate = false;
    this.nodeId = this.opt.nodeId || "peer";
    this.stream = this.opt.stream;

    this.connect = function () {};

    this.disconnect = function () {};

    this.signal = function (sdp) {};
  }

  _createClass(WebRTC, [{
    key: "prepareNewConnection",
    value: function prepareNewConnection() {
      var _this2 = this;

      var peer;
      var opt = this.opt;
      if (!opt) opt = {};
      if (opt.nodeId) this.nodeId = opt.nodeId;

      if (opt.disable_stun) {
        console.log("disable stun");
        peer = new RTCPeerConnection({
          iceServers: []
        });
      } else {
        peer = new RTCPeerConnection({
          iceServers: [{
            urls: ["stun:stun.l.google.com:19302", "stun:stun.webrtc.ecl.ntt.com:3478"]
          }]
        });
      }

      peer.onicecandidate = function (evt) {
        if (!evt.candidate) {
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
            // console.log("webrtc4me disconnected");
            // this.isDisconnected = true;
            // this.isConnected = false;
            // this.disconnect();
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
        sdp = new RTCSessionDescription({
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
        if (!_this4.isConnected) _this4.connect();
        _this4.isConnected = true;
        _this4.onicecandidate = false;
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
        _this4.isDisconnected = true;

        _this4.disconnect();
      };
    }
  }, {
    key: "addStream",
    value: function addStream() {
      var _this5 = this;

      if (this.opt && this.opt.stream) {
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
                return this.rtc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.log);

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
                return this.rtc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.log);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJleGN1dGVFdmVudCIsImV2IiwidiIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZ1bmMiLCJhZGRFdmVudCIsImV2ZW50IiwiX3RhZyIsInRhZyIsImdlbiIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImluY2x1ZGVzIiwiZXJyb3IiLCJXZWJSVEMiLCJvcHQiLCJvbkRhdGEiLCJvbkFkZFRyYWNrIiwicnRjIiwicHJlcGFyZU5ld0Nvbm5lY3Rpb24iLCJkYXRhQ2hhbm5lbHMiLCJpc0Nvbm5lY3RlZCIsImlzRGlzY29ubmVjdGVkIiwib25pY2VjYW5kaWRhdGUiLCJub2RlSWQiLCJzdHJlYW0iLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsInNpZ25hbCIsInNkcCIsInBlZXIiLCJkaXNhYmxlX3N0dW4iLCJSVENQZWVyQ29ubmVjdGlvbiIsImljZVNlcnZlcnMiLCJ1cmxzIiwiZXZ0IiwiY2FuZGlkYXRlIiwibG9jYWxEZXNjcmlwdGlvbiIsImlzT2ZmZXIiLCJzZW5kU2RwIiwib25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UiLCJpY2VDb25uZWN0aW9uU3RhdGUiLCJvbmRhdGFjaGFubmVsIiwiZGF0YUNoYW5uZWwiLCJjaGFubmVsIiwibGFiZWwiLCJkYXRhQ2hhbm5lbEV2ZW50cyIsIm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UiLCJlIiwibmVnb3RpYXRpbmciLCJzaWduYWxpbmdTdGF0ZSIsIm9udHJhY2siLCJzdHJlYW1zIiwiYWRkU3RyZWFtIiwib25uZWdvdGlhdGlvbm5lZWRlZCIsIndhcm4iLCJjcmVhdGVPZmZlciIsImNhdGNoIiwib2ZmZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiY3JlYXRlRGF0YWNoYW5uZWwiLCJkYyIsImNyZWF0ZURhdGFDaGFubmVsIiwiZGNlIiwibWVzc2FnZSIsInR5cGUiLCJsb2NhbCIsIlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwib25vcGVuIiwib25tZXNzYWdlIiwiZGF0YSIsIm9uZXJyb3IiLCJlcnIiLCJvbmNsb3NlIiwiZ2V0VHJhY2tzIiwidHJhY2siLCJhZGRUcmFjayIsInNldFJlbW90ZURlc2NyaXB0aW9uIiwiY3JlYXRlQW5zd2VyIiwiYW5zd2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQk8sU0FBU0EsV0FBVCxDQUFxQkMsRUFBckIsRUFBZ0NDLENBQWhDLEVBQXlDO0FBQzlDQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCO0FBQUVILElBQUFBLEVBQUUsRUFBRkE7QUFBRixHQUEzQjtBQUNBSSxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUwsRUFBWixFQUFnQk0sT0FBaEIsQ0FBd0IsVUFBQUMsR0FBRyxFQUFJO0FBQzdCLFFBQU1DLElBQVMsR0FBR1IsRUFBRSxDQUFDTyxHQUFELENBQXBCOztBQUNBLFFBQUlOLENBQUosRUFBTztBQUNMTyxNQUFBQSxJQUFJLENBQUNQLENBQUQsQ0FBSjtBQUNELEtBRkQsTUFFTztBQUNMTyxNQUFBQSxJQUFJO0FBQ0w7QUFDRixHQVBEO0FBUUQ7O0FBRU0sU0FBU0MsUUFBVCxDQUNMQyxLQURLLEVBRUxGLElBRkssRUFHTEcsSUFISyxFQUlMO0FBQ0EsTUFBTUMsR0FBRyxHQUNQRCxJQUFJLElBQ0gsWUFBTTtBQUNMLFFBQUlFLEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxNQUFMLEdBQWNDLFFBQWQsRUFBVjs7QUFDQSxXQUFPWixNQUFNLENBQUNDLElBQVAsQ0FBWUssS0FBWixFQUFtQk8sUUFBbkIsQ0FBNEJKLEdBQTVCLENBQVAsRUFBeUM7QUFDdkNBLE1BQUFBLEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxNQUFMLEdBQWNDLFFBQWQsRUFBTjtBQUNEOztBQUNELFdBQU9ILEdBQVA7QUFDRCxHQU5ELEVBRkY7O0FBU0EsTUFBSVQsTUFBTSxDQUFDQyxJQUFQLENB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QUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgbWVzc2FnZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgbm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBvcHRpb24ge1xuICBkaXNhYmxlX3N0dW4/OiBib29sZWFuO1xuICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcbiAgbm9kZUlkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YSB7XG4gIFtrZXk6IHN0cmluZ106IChyYXc6IG1lc3NhZ2UpID0+IHZvaWQ7XG59XG5pbnRlcmZhY2UgT25BZGRUcmFjayB7XG4gIFtrZXk6IHN0cmluZ106IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xufVxuXG50eXBlIEV2ZW50ID0gT25EYXRhIHwgT25BZGRUcmFjaztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y3V0ZUV2ZW50KGV2OiBFdmVudCwgdj86IGFueSkge1xuICBjb25zb2xlLmxvZyhcImV4Y3V0ZUV2ZW50XCIsIHsgZXYgfSk7XG4gIE9iamVjdC5rZXlzKGV2KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgZnVuYzogYW55ID0gZXZba2V5XTtcbiAgICBpZiAodikge1xuICAgICAgZnVuYyh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuYygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudDxUIGV4dGVuZHMgRXZlbnQ+KFxuICBldmVudDogVCxcbiAgZnVuYzogVFtrZXlvZiBUXSxcbiAgX3RhZz86IHN0cmluZ1xuKSB7XG4gIGNvbnN0IHRhZyA9XG4gICAgX3RhZyB8fFxuICAgICgoKSA9PiB7XG4gICAgICBsZXQgZ2VuID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICAgICAgd2hpbGUgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyhnZW4pKSB7XG4gICAgICAgIGdlbiA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZW47XG4gICAgfSkoKTtcbiAgaWYgKE9iamVjdC5rZXlzKGV2ZW50KS5pbmNsdWRlcyh0YWcpKSB7XG4gICAgY29uc29sZS5lcnJvcihcImluY2x1ZGUgdGFnXCIpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50W3RhZ10gPSBmdW5jO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlJUQyB7XG4gIHJ0YzogUlRDUGVlckNvbm5lY3Rpb247XG5cbiAgc2lnbmFsOiAoc2RwOiBhbnkpID0+IHZvaWQ7XG4gIGNvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25EYXRhOiBPbkRhdGEgPSB7fTtcbiAgYWRkT25EYXRhID0gKGZ1bmM6IE9uRGF0YVtrZXlvZiBPbkRhdGFdLCB0YWc/OiBzdHJpbmcpID0+IHtcbiAgICBhZGRFdmVudDxPbkRhdGE+KHRoaXMub25EYXRhLCBmdW5jLCB0YWcpO1xuICB9O1xuICBwcml2YXRlIG9uQWRkVHJhY2s6IE9uQWRkVHJhY2sgPSB7fTtcbiAgYWRkT25BZGRUcmFjayA9IChmdW5jOiBPbkFkZFRyYWNrW2tleW9mIE9uRGF0YV0sIHRhZz86IHN0cmluZykgPT4ge1xuICAgIGFkZEV2ZW50PE9uQWRkVHJhY2s+KHRoaXMub25BZGRUcmFjaywgZnVuYywgdGFnKTtcbiAgfTtcblxuICBwcml2YXRlIGRhdGFDaGFubmVsczogeyBba2V5OiBzdHJpbmddOiBSVENEYXRhQ2hhbm5lbCB9O1xuXG4gIG5vZGVJZDogc3RyaW5nO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgaXNEaXNjb25uZWN0ZWQ6IGJvb2xlYW47XG4gIG9uaWNlY2FuZGlkYXRlOiBib29sZWFuO1xuICBzdHJlYW0/OiBNZWRpYVN0cmVhbTtcbiAgb3B0Pzogb3B0aW9uO1xuXG4gIGlzT2ZmZXIgPSBmYWxzZTtcbiAgY29uc3RydWN0b3Iob3B0Pzogb3B0aW9uKSB7XG4gICAgdGhpcy5vcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5kYXRhQ2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMub25pY2VjYW5kaWRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLm5vZGVJZCA9IHRoaXMub3B0Lm5vZGVJZCB8fCBcInBlZXJcIjtcbiAgICB0aGlzLnN0cmVhbSA9IHRoaXMub3B0LnN0cmVhbTtcbiAgICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnNpZ25hbCA9IHNkcCA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcGFyZU5ld0Nvbm5lY3Rpb24oKSB7XG4gICAgbGV0IHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIGxldCBvcHQgPSB0aGlzLm9wdDtcbiAgICBpZiAoIW9wdCkgb3B0ID0ge307XG4gICAgaWYgKG9wdC5ub2RlSWQpIHRoaXMubm9kZUlkID0gb3B0Lm5vZGVJZDtcbiAgICBpZiAob3B0LmRpc2FibGVfc3R1bikge1xuICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxlIHN0dW5cIik7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZWVyID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybHM6IFtcbiAgICAgICAgICAgICAgXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCIsXG4gICAgICAgICAgICAgIFwic3R1bjpzdHVuLndlYnJ0Yy5lY2wubnR0LmNvbTozNDc4XCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlZXIub25pY2VjYW5kaWRhdGUgPSBldnQgPT4ge1xuICAgICAgaWYgKCFldnQuY2FuZGlkYXRlKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsKHBlZXIubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkICYmIHRoaXMuaXNPZmZlcikge1xuICAgICAgICAgIHRoaXMuc2VuZFNkcChcIm9mZmVyXCIsIHRoaXMucnRjLmxvY2FsRGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgdGhpcy5ub2RlSWQsXG4gICAgICAgIFwiSUNFIGNvbm5lY3Rpb24gU3RhdHVzIGhhcyBjaGFuZ2VkIHRvIFwiICsgcGVlci5pY2VDb25uZWN0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBzd2l0Y2ggKHBlZXIuaWNlQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJjbG9zZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZhaWxlZFwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGVkXCI6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21wbGV0ZWRcIjpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpc2Nvbm5lY3RlZFwiOlxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2VicnRjNG1lIGRpc2Nvbm5lY3RlZFwiKTtcbiAgICAgICAgICAvLyB0aGlzLmlzRGlzY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAvLyB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgLy8gdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBlZXIub25kYXRhY2hhbm5lbCA9IGV2dCA9PiB7XG4gICAgICBjb25zdCBkYXRhQ2hhbm5lbCA9IGV2dC5jaGFubmVsO1xuICAgICAgdGhpcy5kYXRhQ2hhbm5lbHNbZGF0YUNoYW5uZWwubGFiZWxdID0gZGF0YUNoYW5uZWw7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRhdGFDaGFubmVsKTtcbiAgICB9O1xuXG4gICAgcGVlci5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gZSA9PiB7XG4gICAgICB0aGlzLm5lZ290aWF0aW5nID0gcGVlci5zaWduYWxpbmdTdGF0ZSAhPSBcInN0YWJsZVwiO1xuICAgIH07XG5cbiAgICBwZWVyLm9udHJhY2sgPSBldnQgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gZXZ0LnN0cmVhbXNbMF07XG4gICAgICBleGN1dGVFdmVudCh0aGlzLm9uQWRkVHJhY2ssIHN0cmVhbSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwZWVyO1xuICB9XG5cbiAgbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgbWFrZU9mZmVyKCkge1xuICAgIHRoaXMucnRjID0gdGhpcy5wcmVwYXJlTmV3Q29ubmVjdGlvbigpO1xuICAgIHRoaXMuYWRkU3RyZWFtKCk7XG5cbiAgICB0aGlzLnJ0Yy5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmVnb3RpYXRpbmcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZHVwbGlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgIH07XG4gICAgdGhpcy5pc09mZmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNyZWF0ZURhdGFjaGFubmVsKFwiZGF0YWNoYW5uZWxcIik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURhdGFjaGFubmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGMgPSB0aGlzLnJ0Yy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsRXZlbnRzKGRjKTtcbiAgICAgIHRoaXMuZGF0YUNoYW5uZWxzW2xhYmVsXSA9IGRjO1xuICAgIH0gY2F0Y2ggKGRjZSkge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBlc3RhYmxpc2hlZCBlcnJvcjogXCIgKyBkY2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgc2VuZFNkcCh0eXBlOiBzdHJpbmcsIGxvY2FsOiBhbnkpIHtcbiAgICBsZXQgc2RwID0gbG9jYWw7XG4gICAgaWYgKCFsb2NhbC50eXBlKSB7XG4gICAgICBzZHAgPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHsgdHlwZTogdHlwZSBhcyBhbnksIHNkcDogbG9jYWwuc2RwIH0pO1xuICAgIH1cbiAgICB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzZHAgfSksIFwid2VicnRjXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBkYXRhQ2hhbm5lbEV2ZW50cyhjaGFubmVsOiBSVENEYXRhQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5vbmljZWNhbmRpZGF0ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNoYW5uZWwub25tZXNzYWdlID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm47XG4gICAgICAgIGV4Y3V0ZUV2ZW50KHRoaXMub25EYXRhLCB7XG4gICAgICAgICAgbGFiZWw6IGNoYW5uZWwubGFiZWwsXG4gICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICBub2RlSWQ6IHRoaXMubm9kZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY2hhbm5lbC5sYWJlbCA9PT0gXCJ3ZWJydGNcIikge1xuICAgICAgICAgIC8vIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coeyBvYmogfSk7XG4gICAgICAgICAgLy8gaWYgKCFvYmogfHwgIW9iai5zZHApIHJldHVybjtcbiAgICAgICAgICAvLyBpZiAob2JqLnNkcC50eXBlID09PSBcIm9mZmVyXCIpIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiZGVidWcgb2ZmZXJcIiwgeyBvYmogfSk7XG4gICAgICAgICAgLy8gICBhd2FpdCB0aGlzLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihvYmouc2RwKTtcbiAgICAgICAgICAvLyAgIGNvbnN0IGNyZWF0ZSA9IGF3YWl0IHRoaXMucnRjLmNyZWF0ZUFuc3dlcigpLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgICAgICAgLy8gICBpZiAoIWNyZWF0ZSkgcmV0dXJuO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihjcmVhdGUpLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgICAgICAgLy8gICB0aGlzLnNlbmRTZHAoXCJhbnN3ZXJcIiwgdGhpcy5ydGMubG9jYWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiZGVidWcgYW5zd2VyXCIsIHsgb2JqIH0pO1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24ob2JqLnNkcCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICAgIGNoYW5uZWwub25lcnJvciA9IGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFjaGFubmVsIEVycm9yOiBcIiArIGVycik7XG4gICAgfTtcbiAgICBjaGFubmVsLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRhdGFDaGFubmVsIGlzIGNsb3NlZFwiKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuXG4gIGFkZFN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5vcHQgJiYgdGhpcy5vcHQuc3RyZWFtKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLm9wdC5zdHJlYW07XG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0aGlzLnJ0Yy5hZGRUcmFjayh0cmFjaywgc3RyZWFtKSk7XG4gICAgfVxuICB9XG4gIGFzeW5jIHNldEFuc3dlcihzZHA6IGFueSwgbm9kZUlkPzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5ydGNcbiAgICAgIC5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCkpXG4gICAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG4gICAgdGhpcy5ub2RlSWQgPSBub2RlSWQgfHwgdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBhc3luYyBtYWtlQW5zd2VyKHNkcDogYW55KSB7XG4gICAgdGhpcy5ydGMgPSB0aGlzLnByZXBhcmVOZXdDb25uZWN0aW9uKCk7XG4gICAgdGhpcy5hZGRTdHJlYW0oKTtcbiAgICBjb25zb2xlLmxvZyh7IHNkcCB9KTtcbiAgICBhd2FpdCB0aGlzLnJ0Y1xuICAgICAgLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKSlcbiAgICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCB0aGlzLnJ0Yy5jcmVhdGVBbnN3ZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgaWYgKGFuc3dlcikgYXdhaXQgdGhpcy5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgfVxuXG4gIHNlbmQoZGF0YTogYW55LCBsYWJlbD86IHN0cmluZykge1xuICAgIGxhYmVsID0gbGFiZWwgfHwgXCJkYXRhY2hhbm5lbFwiO1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5kYXRhQ2hhbm5lbHMpLmluY2x1ZGVzKGxhYmVsKSkge1xuICAgICAgdGhpcy5jcmVhdGVEYXRhY2hhbm5lbChsYWJlbCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFDaGFubmVsc1tsYWJlbF0uc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJkYyBzZW5kIGVycm9yXCIsIGVycm9yKTtcbiAgICAgIHRoaXMuaXNEaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGluZyhub2RlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubm9kZUlkID0gbm9kZUlkO1xuICB9XG59XG4iXX0=