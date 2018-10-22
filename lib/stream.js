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

    this.peer.events.data["stream.ts"] =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(msg) {
        var pc, sdp, answer;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pc = _this.peer.rtc;

                if (!(msg.label === "sdp")) {
                  _context.next = 18;
                  break;
                }

                sdp = msg.data;

                if (!(sdp.type === "offer")) {
                  _context.next = 15;
                  break;
                }

                _context.next = 6;
                return pc.setRemoteDescription(sdp).catch(console.log);

              case 6:
                _context.next = 8;
                return pc.createAnswer();

              case 8:
                answer = _context.sent;

                if (!answer) {
                  _context.next = 13;
                  break;
                }

                _context.next = 12;
                return pc.setLocalDescription(answer).catch(console.log);

              case 12:
                _this.peer.send(pc.localDescription, "sdp");

              case 13:
                _context.next = 18;
                break;

              case 15:
                if (!(sdp.type === "answer")) {
                  _context.next = 18;
                  break;
                }

                _context.next = 18;
                return pc.setRemoteDescription(sdp).catch(console.log);

              case 18:
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
                _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2() {
                  var offer;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return pc.createOffer().catch(console.log);

                        case 2:
                          offer = _context2.sent;

                          if (!offer) {
                            _context2.next = 7;
                            break;
                          }

                          _context2.next = 6;
                          return pc.setLocalDescription(offer).catch(console.log);

                        case 6:
                          _this2.peer.send(pc.localDescription, "sdp");

                        case 7:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsiZ2V0TG9jYWxTdHJlYW0iLCJvcHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm5hdmlnYXRvciIsImdldFVzZXJNZWRpYSIsIndlYmtpdEdldFVzZXJNZWRpYSIsIm1vekdldFVzZXJNZWRpYSIsIm1zR2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJ2aWRlbyIsInRoZW4iLCJzdHJlYW0iLCJTdHJlYW0iLCJfcGVlciIsInBlZXIiLCJldmVudHMiLCJkYXRhIiwibXNnIiwicGMiLCJydGMiLCJsYWJlbCIsInNkcCIsInR5cGUiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsImNyZWF0ZUFuc3dlciIsImFuc3dlciIsInNldExvY2FsRGVzY3JpcHRpb24iLCJzZW5kIiwibG9jYWxEZXNjcmlwdGlvbiIsInRyYWNrIiwiZ2V0VmlkZW9UcmFja3MiLCJhZGRUcmFjayIsIm9ubmVnb3RpYXRpb25uZWVkZWQiLCJjcmVhdGVPZmZlciIsIm9mZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdPLFNBQVNBLGNBQVQsQ0FBd0JDLEdBQXhCLEVBQWlFO0FBQ3RFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FDRUQsU0FBUyxDQUFDQyxZQUFWLElBQ0FELFNBQVMsQ0FBQ0Usa0JBRFYsSUFFQUYsU0FBUyxDQUFDRyxlQUZWLElBR0FILFNBQVMsQ0FBQ0ksY0FKWjtBQUtBLFFBQUksQ0FBQ1AsR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRVEsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVk4sSUFBQUEsU0FBUyxDQUFDTyxZQUFWLENBQ0dOLFlBREgsQ0FDZ0I7QUFBRU8sTUFBQUEsS0FB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LEVBQUUsQ0FBQ2EsZ0JBQWxCLEVBQW9DLEtBQXBDOztBQUpxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgeyBtZXNzYWdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFN0cmVhbShvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9IH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIHBlZXI6IFdlYlJUQztcblxuICBjb25zdHJ1Y3RvcihfcGVlcjogV2ViUlRDKSB7XG4gICAgdGhpcy5wZWVyID0gX3BlZXI7XG5cbiAgICB0aGlzLnBlZXIuZXZlbnRzLmRhdGFbXCJzdHJlYW0udHNcIl0gPSBhc3luYyAobXNnOiBtZXNzYWdlKSA9PiB7XG4gICAgICBjb25zdCBwYyA9IHRoaXMucGVlci5ydGM7XG4gICAgICBpZiAobXNnLmxhYmVsID09PSBcInNkcFwiKSB7XG4gICAgICAgIGNvbnN0IHNkcDogUlRDU2Vzc2lvbkRlc2NyaXB0aW9uID0gbXNnLmRhdGE7XG4gICAgICAgIGlmIChzZHAudHlwZSA9PT0gXCJvZmZlclwiKSB7XG4gICAgICAgICAgYXdhaXQgcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICAgICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcGMuY3JlYXRlQW5zd2VyKCk7XG4gICAgICAgICAgaWYgKGFuc3dlcikge1xuICAgICAgICAgICAgYXdhaXQgcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihhbnN3ZXIpLmNhdGNoKGNvbnNvbGUubG9nKTtcbiAgICAgICAgICAgIHRoaXMucGVlci5zZW5kKHBjLmxvY2FsRGVzY3JpcHRpb24sIFwic2RwXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gXCJhbnN3ZXJcIikge1xuICAgICAgICAgIGF3YWl0IHBjLnNldFJlbW90ZURlc2NyaXB0aW9uKHNkcCkuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGFkZFN0cmVhbShzdHJlYW0/OiBNZWRpYVN0cmVhbSkge1xuICAgIHN0cmVhbSA9IHN0cmVhbSB8fCAoYXdhaXQgZ2V0TG9jYWxTdHJlYW0oKSk7XG4gICAgY29uc3QgdHJhY2sgPSBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXTtcbiAgICBjb25zdCBwYyA9IHRoaXMucGVlci5ydGM7XG4gICAgcGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSk7XG4gICAgcGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9mZmVyID0gYXdhaXQgcGMuY3JlYXRlT2ZmZXIoKS5jYXRjaChjb25zb2xlLmxvZyk7XG4gICAgICBpZiAob2ZmZXIpIHtcbiAgICAgICAgYXdhaXQgcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcikuY2F0Y2goY29uc29sZS5sb2cpO1xuICAgICAgICB0aGlzLnBlZXIuc2VuZChwYy5sb2NhbERlc2NyaXB0aW9uLCBcInNkcFwiKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=