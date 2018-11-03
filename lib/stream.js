"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalStream = getLocalStream;
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

function getLocalStream(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      video: {
        width: opt.width,
        height: opt.height
      }
    }).then(function (stream) {
      resolve(stream);
    });
  });
}

var Stream =
/*#__PURE__*/
function () {
  function Stream(_peer) {
    var _this = this;

    _classCallCheck(this, Stream);

    _defineProperty(this, "peer", void 0);

    this.peer = _peer;
    var pc = this.peer.rtc;

    this.peer.events.data["stream.ts"] =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(msg) {
        var sdp, answer;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(msg.label === "sdp")) {
                  _context.next = 17;
                  break;
                }

                sdp = msg.data;

                if (!(sdp.type === "offer")) {
                  _context.next = 14;
                  break;
                }

                _context.next = 5;
                return pc.setRemoteDescription(sdp).catch(console.log);

              case 5:
                _context.next = 7;
                return pc.createAnswer();

              case 7:
                answer = _context.sent;

                if (!answer) {
                  _context.next = 12;
                  break;
                }

                _context.next = 11;
                return pc.setLocalDescription(answer).catch(console.log);

              case 11:
                _this.peer.send(pc.localDescription, "sdp");

              case 12:
                _context.next = 17;
                break;

              case 14:
                if (!(sdp.type === "answer")) {
                  _context.next = 17;
                  break;
                }

                _context.next = 17;
                return pc.setRemoteDescription(sdp).catch(console.log);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  }

  _createClass(Stream, [{
    key: "addStream",
    value: function () {
      var _addStream = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(stream) {
        var _this2 = this;

        var track, pc;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = stream;

                if (_context3.t0) {
                  _context3.next = 5;
                  break;
                }

                _context3.next = 4;
                return getLocalStream();

              case 4:
                _context3.t0 = _context3.sent;

              case 5:
                stream = _context3.t0;
                track = stream.getVideoTracks()[0];
                pc = this.peer.rtc;
                pc.addTrack(track, stream);

                pc.onnegotiationneeded =
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2(evt) {
                    var offer;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            console.log("w4me stream onnnegotiationneeded", {
                              evt: evt
                            });
                            _context2.next = 3;
                            return pc.createOffer().catch(console.log);

                          case 3:
                            offer = _context2.sent;

                            if (!offer) {
                              _context2.next = 9;
                              break;
                            }

                            _context2.next = 7;
                            return pc.setLocalDescription(offer).catch(console.log);

                          case 7:
                            console.log("w4me send offer sdp", pc.localDescription);

                            _this2.peer.send(pc.localDescription, "sdp");

                          case 9:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }();

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function addStream(_x2) {
        return _addStream.apply(this, arguments);
      };
    }()
  }]);

  return Stream;
}();

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwicGMiLCJydGMiLCJldmVudHMiLCJkYXRhIiwibXNnIiwibGFiZWwiLCJzZHAiLCJ0eXBlIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwic2VuZCIsImxvY2FsRGVzY3JpcHRpb24iLCJ0cmFjayIsImdldFZpZGVvVHJhY2tzIiwiYWRkVHJhY2siLCJvbm5lZ290aWF0aW9ubmVlZGVkIiwiZXZ0IiwiY3JlYXRlT2ZmZXIiLCJvZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBSU8sU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBaUU7QUFDdEUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUNFRCxTQUFTLENBQUNDLFlBQVYsSUFDQUQsU0FBUyxDQUFDRSxrQkFEVixJQUVBRixTQUFTLENBQUNHLGVBRlYsSUFHQUgsU0FBUyxDQUFDSSxjQUpaO0FBS0EsUUFBSSxDQUFDUCxHQUFMLEVBQVVBLEdBQUcsR0FBRztBQUFFUSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxNQUFNLEVBQUU7QUFBdkIsS0FBTjtBQUNWTixJQUFBQSxTQUFT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O0FBQUEsbUNBSWZ2QixFQUFFLENBQUNjLG1CQUFILENBQXVCUyxLQUF2QixFQUE4QmQsS0FBOUIsQ0FBb0NDLE9BQU8sQ0FBQ0MsR0FBNUMsQ0FKZTs7QUFBQTtBQUtyQkQsNEJBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFaLEVBQW1DWCxFQUFFLENBQUNnQixnQkFBdEM7O0FBQ0EsNEJBQUEsTUFBSSxDQUFDakIsSUFBTCxDQUFVZ0IsSUFBVixDQUFlZixFQUFFLENBQUNnQixnQkFBbEIsRUFBb0MsS0FBcEM7O0FBTnFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUF6Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IG1lc3NhZ2UgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RyZWFtKG9wdD86IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSkge1xuICByZXR1cm4gbmV3IFByb21pc2U8TWVkaWFTdHJlYW0+KChyZXNvbHZlOiAodjogTWVkaWFTdHJlYW0pID0+IHZvaWQpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcbiAgICBpZiAoIW9wdCkgb3B0ID0geyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHsgd2lkdGg6IG9wdC53aWR0aCwgaGVpZ2h0OiBvcHQuaGVpZ2h0IH0gfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgcGVlcjogV2ViUlRDO1xuXG4gIGNvbnN0cnVjdG9yKF9wZWVyOiBXZWJSVEMpIHtcbiAgICB0aGlzLnBlZXIgPSBfcGVlcjtcblxuICAgIGNvbnN0IHBjID0gdGhpcy5wZWVyLnJ0YztcbiAgICB0aGlzLnBlZXIuZXZlbnRzLmRhdGFbXCJzdHJlYW0udHNcIl0gPSBhc3luYyAobXNnOiBtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobXNnLmxhYmVsID09PSBcInNkcFwiKSB7XG4gICAgICAgIGNvbnN0IHNkcDogUlRDU2Vzc2lvbkRlc2NyaXB0aW9uID0gbXNnLmRhdGE7XG4gICAgICAgIGlmIChzZHAudHlwZSA9PT0gXCJvZmZlclwiKSB7XG4gICAgICAgICAgYXdhaXQgcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICAgICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcGMuY3JlYXRlQW5zd2VyKCk7XG4gICAgICAgICAgaWYgKGFuc3dlcikge1xuICAgICAgICAgICAgYXdhaXQgcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgICAgICAgIHRoaXMucGVlci5zZW5kKHBjLmxvY2FsRGVzY3JpcHRpb24sIFwic2RwXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gXCJhbnN3ZXJcIikge1xuICAgICAgICAgIGF3YWl0IHBjLnNldFJlbW90ZURlc2NyaXB0aW9uKHNkcCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGFkZFN0cmVhbShzdHJlYW0/OiBNZWRpYVN0cmVhbSkge1xuICAgIHN0cmVhbSA9IHN0cmVhbSB8fCAoYXdhaXQgZ2V0TG9jYWxTdHJlYW0oKSk7XG4gICAgY29uc3QgdHJhY2sgPSBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXTtcbiAgICBjb25zdCBwYyA9IHRoaXMucGVlci5ydGM7XG4gICAgcGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSk7XG4gICAgcGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jIGV2dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9ubm5lZ290aWF0aW9ubmVlZGVkXCIsIHsgZXZ0IH0pO1xuICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCBwYy5jcmVhdGVPZmZlcigpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgIGlmIChvZmZlcikge1xuICAgICAgICBhd2FpdCBwYy5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzZW5kIG9mZmVyIHNkcFwiLCBwYy5sb2NhbERlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5wZWVyLnNlbmQocGMubG9jYWxEZXNjcmlwdGlvbiwgXCJzZHBcIik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIl19