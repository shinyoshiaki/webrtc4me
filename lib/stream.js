"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalStream = getLocalStream;
exports.default = void 0;

var _simplePeer = _interopRequireDefault(require("simple-peer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  function Stream(_peer, stream) {
    _classCallCheck(this, Stream);

    _defineProperty(this, "peer", void 0);

    _defineProperty(this, "stream", void 0);

    this.peer = _peer;

    this.stream = function (stream) {};

    this.init(stream);
  }

  _createClass(Stream, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(stream) {
        var _this = this;

        var p;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (stream) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return getLocalStream();

              case 3:
                stream = _context.sent;

              case 4:
                console.log("w4me stream", {
                  stream: stream
                });

                if (this.peer.isOffer) {
                  console.log("w4me stream isoffer");
                  p = new _simplePeer.default({
                    initiator: true,
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    console.log("w4me stream offer signal", {
                      data: data
                    });

                    _this.peer.send(JSON.stringify(data), "stream_offer");
                  });
                } else {
                  console.log("w4me stream isAnswer");
                  p = new _simplePeer.default({
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    console.log("w4me stream answer signal", {
                      data: data
                    });

                    _this.peer.send(JSON.stringify(data), "stream_answer");
                  });
                }

                this.peer.addOnData(function (data) {
                  console.log("w4me stream ondata", {
                    data: data
                  });
                  var sdp = JSON.parse(data.data);

                  if (data.label === "stream_answer" || data.label === "stream_offer") {
                    console.log("w4me stream signal", {
                      sdp: sdp
                    });
                    p.signal(sdp);
                  }
                }, "stream");
                p.on("error", function (err) {
                  console.log({
                    err: err
                  });
                });
                p.on("stream", function (stream) {
                  console.log("w4me stream stream", {
                    stream: stream
                  });

                  _this.stream(stream);
                });
                p.on("connect", function () {
                  console.log("w4me connected");
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function init(_x) {
        return _init.apply(this, arguments);
      };
    }()
  }]);

  return Stream;
}();

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJpc09mZmVyIiwicCIsIlBlZXIiLCJpbml0aWF0b3IiLCJvbiIsImRhdGEiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZE9uRGF0YSIsInNkcCIsInBhcnNlIiwibGFiZWwiLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBSU8sU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBaUU7QUFDdEUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUNFRCxTQUFTLENBQUNDLFlBQVYsSUFDQUQsU0FBUyxDQUFDRSxrQkFEVixJQUVBRixTQUFTLENBQUNHLGVBRlYsSUFHQUgsU0FBUyxDQUFDSSxjQUpaO0FBS0EsUUFBSSxDQUFDUCxHQUFMLEVBQVVBLEdBQUcsR0FBRztBQUFFUSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxNQUFNLEVBQUU7QUFBdkIsS0FBTjtBQUNWTixJQUFBQSxTQUFTLENBQUNPLFlBQVYsQ0FDR04sWUFESCxDQUNnQjtBQUFFTyxNQUFBQSxLQUFLLEVBQUU7QUFBRUgsUUFBQUEsS0FBSyxFQUFFUixHQUFHLENBQUNRLEtBQWI7QUFBb0JDLFFBQUFBLE1BQU0s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WTtBQUFFZSxvQkFBQUEsR0FBRyxFQUFIQTtBQUFGLG1CQUFaO0FBQ0QsaUJBRkQ7QUFHQWIsZ0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLFFBQUwsRUFBZSxVQUFBWCxNQUFNLEVBQUk7QUFDdkJLLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQztBQUFFTixvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFsQzs7QUFDQSxrQkFBQSxLQUFJLENBQUNBLE1BQUwsQ0FBWUEsTUFBWjtBQUNELGlCQUhEO0FBSUFRLGdCQUFBQSxDQUFDLENBQUNHLEVBQUYsQ0FBSyxTQUFMLEVBQWdCLFlBQU07QUFDcEJOLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxnQkFBWjtBQUNELGlCQUZEIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IFBlZXIgZnJvbSBcInNpbXBsZS1wZWVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFN0cmVhbShvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9IH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIHBlZXI6IFdlYlJUQztcbiAgc3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihfcGVlcjogV2ViUlRDLCBzdHJlYW0/OiBNZWRpYVN0cmVhbSkge1xuICAgIHRoaXMucGVlciA9IF9wZWVyO1xuICAgIHRoaXMuc3RyZWFtID0gKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHt9O1xuICAgIHRoaXMuaW5pdChzdHJlYW0pO1xuICB9XG5cbiAgYXN5bmMgaW5pdChzdHJlYW0/OiBNZWRpYVN0cmVhbSkge1xuICAgIGlmICghc3RyZWFtKSBzdHJlYW0gPSBhd2FpdCBnZXRMb2NhbFN0cmVhbSgpO1xuICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW1cIiwgeyBzdHJlYW0gfSk7XG4gICAgbGV0IHA6IFBlZXIuSW5zdGFuY2U7XG4gICAgaWYgKHRoaXMucGVlci5pc09mZmVyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGlzb2ZmZXJcIik7XG4gICAgICBwID0gbmV3IFBlZXIoeyBpbml0aWF0b3I6IHRydWUsIHN0cmVhbSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gb2ZmZXIgc2lnbmFsXCIsIHsgZGF0YSB9KTtcbiAgICAgICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSksIFwic3RyZWFtX29mZmVyXCIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gaXNBbnN3ZXJcIik7XG4gICAgICBwID0gbmV3IFBlZXIoeyBzdHJlYW0gfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGFuc3dlciBzaWduYWxcIiwgeyBkYXRhIH0pO1xuICAgICAgICB0aGlzLnBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSwgXCJzdHJlYW1fYW5zd2VyXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMucGVlci5hZGRPbkRhdGEoZGF0YSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9uZGF0YVwiLCB7IGRhdGEgfSk7XG4gICAgICBjb25zdCBzZHAgPSBKU09OLnBhcnNlKGRhdGEuZGF0YSk7XG4gICAgICBpZiAoZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fYW5zd2VyXCIgfHwgZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fb2ZmZXJcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIHNpZ25hbFwiLCB7IHNkcCB9KTtcbiAgICAgICAgcC5zaWduYWwoc2RwKTtcbiAgICAgIH1cbiAgICB9LCBcInN0cmVhbVwiKTtcbiAgICBwLm9uKFwiZXJyb3JcIiwgZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHsgZXJyIH0pO1xuICAgIH0pO1xuICAgIHAub24oXCJzdHJlYW1cIiwgc3RyZWFtID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gc3RyZWFtXCIsIHsgc3RyZWFtIH0pO1xuICAgICAgdGhpcy5zdHJlYW0oc3RyZWFtKTtcbiAgICB9KTtcbiAgICBwLm9uKFwiY29ubmVjdFwiLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgY29ubmVjdGVkXCIpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=