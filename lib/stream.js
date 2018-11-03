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

var Stream = function Stream(_peer, stream) {
  var _this = this;

  _classCallCheck(this, Stream);

  _defineProperty(this, "peer", void 0);

  _defineProperty(this, "stream", void 0);

  this.peer = _peer;

  this.stream = function (stream) {};

  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
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
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }))();

  var p;

  if (this.peer.isOffer) {
    console.log("w4me stream isoffer");
    p = new _simplePeer.default({
      initiator: true,
      stream: stream,
      trickle: false
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
      stream: stream,
      trickle: false
    });
    p.on("signal", function (data) {
      console.log("w4me stream answer signal", {
        data: data
      });

      _this.peer.send(JSON.stringify(data), "stream_answer");
    });
  }

  this.peer.events.data["stream.ts"] = function (data) {
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
  };

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
};

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwicCIsImlzT2ZmZXIiLCJjb25zb2xlIiwibG9nIiwiUGVlciIsImluaXRpYXRvciIsInRyaWNrbGUiLCJvbiIsImRhdGEiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImV2ZW50cyIsInNkcCIsInBhcnNlIiwibGFiZWwiLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztBQUZBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFJTyxTQUFTQyxjQUFULENBQXdCQyxHQUF4QixFQUFpRTtBQUN0RSxTQUFPLElBQUlDLE9BQUosQ0FBeUIsVUFBQ0MsT0FBRCxFQUF1QztBQUNyRUMsSUFBQUEsU0FBUyxDQUFDQyxZQUFWLEdBQ0VELFNBQVMsQ0FBQ0MsWUFBVixJQUNBRCxTQUFTLENBQUNFLGtCQURWLElBRUFGLFNBQVMsQ0FBQ0csZUFGVixJQUdBSCxTQUFTLENBQUNJLGNBSlo7QUFLQSxRQUFJLENBQUNQLEdBQUwsRUFBVUEsR0FBRyxHQUFHO0FBQUVRLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLE1BQU0sRUFBRTtBQUF2QixLQUFOO0FBQ1ZOLElBQUFBLFNBQVMsQ0FBQ08sWUFBVixDQUNHTixZQURILENBQ2dCO0FBQUVPLE1BQUFBLEtBQUssRUFBRTtBQUFFSCxRQUFBQSxLQUFLLEVBQUVSLEdBQUcsQ0FBQ1EsS0FBYjtBQUFvQkMsUUFBQUEsTUFBTSxFQUFF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RUFBSTtBQUNuQmYsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk7QUFBRWMsTUFBQUEsR0FBRyxFQUFIQTtBQUFGLEtBQVo7QUFDRCxHQUZEO0FBR0FqQixFQUFBQSxDQUFDLENBQUNPLEVBQUYsQ0FBSyxRQUFMLEVBQWUsVUFBQVgsTUFBTSxFQUFJO0FBQ3ZCTSxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQztBQUFFUCxNQUFBQSxNQUFNLEVBQU5BO0FBQUYsS0FBbEM7O0FBQ0EsSUFBQSxLQUFJLENBQUNBLE1BQUwsQ0FBWUEsTUFBWjtBQUNELEdBSEQ7QUFJRCxDIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IFBlZXIgZnJvbSBcInNpbXBsZS1wZWVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFN0cmVhbShvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8XG4gICAgICBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG4gICAgaWYgKCFvcHQpIG9wdCA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9IH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XG4gIHBlZXI6IFdlYlJUQztcbiAgc3RyZWFtOiAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihfcGVlcjogV2ViUlRDLCBzdHJlYW0/OiBNZWRpYVN0cmVhbSkge1xuICAgIHRoaXMucGVlciA9IF9wZWVyO1xuICAgIHRoaXMuc3RyZWFtID0gKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHt9O1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIXN0cmVhbSkgc3RyZWFtID0gYXdhaXQgZ2V0TG9jYWxTdHJlYW0oKTtcbiAgICB9KSgpO1xuXG4gICAgbGV0IHA6IFBlZXIuSW5zdGFuY2U7XG4gICAgaWYgKHRoaXMucGVlci5pc09mZmVyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGlzb2ZmZXJcIik7XG4gICAgICBwID0gbmV3IFBlZXIoeyBpbml0aWF0b3I6IHRydWUsIHN0cmVhbSwgdHJpY2tsZTogZmFsc2UgfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9mZmVyIHNpZ25hbFwiLCB7IGRhdGEgfSk7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpLCBcInN0cmVhbV9vZmZlclwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGlzQW5zd2VyXCIpO1xuICAgICAgcCA9IG5ldyBQZWVyKHsgc3RyZWFtLCB0cmlja2xlOiBmYWxzZSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gYW5zd2VyIHNpZ25hbFwiLCB7IGRhdGEgfSk7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpLCBcInN0cmVhbV9hbnN3ZXJcIik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5wZWVyLmV2ZW50cy5kYXRhW1wic3RyZWFtLnRzXCJdID0gZGF0YSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9uZGF0YVwiLCB7IGRhdGEgfSk7XG4gICAgICBjb25zdCBzZHAgPSBKU09OLnBhcnNlKGRhdGEuZGF0YSk7XG4gICAgICBpZiAoZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fYW5zd2VyXCIgfHwgZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fb2ZmZXJcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIHNpZ25hbFwiLCB7IHNkcCB9KTtcbiAgICAgICAgcC5zaWduYWwoc2RwKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHAub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coeyBlcnIgfSk7XG4gICAgfSk7XG4gICAgcC5vbihcInN0cmVhbVwiLCBzdHJlYW0gPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBzdHJlYW1cIiwgeyBzdHJlYW0gfSk7XG4gICAgICB0aGlzLnN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=