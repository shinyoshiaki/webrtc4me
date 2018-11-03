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

      _this.peer.send(data, "stream_offer");
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

      _this.peer.send(data, "stream_answer");
    });
  }

  this.peer.events.data["stream.ts"] = function (data) {
    console.log("w4me stream ondata", {
      data: data
    });

    if (data.label === "stream_answer" || data.label === "stream_offer") {
      console.log("w4me stream signal", data.data);
      p.signal(data.data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwicCIsImlzT2ZmZXIiLCJjb25zb2xlIiwibG9nIiwiUGVlciIsImluaXRpYXRvciIsInRyaWNrbGUiLCJvbiIsImRhdGEiLCJzZW5kIiwiZXZlbnRzIiwibGFiZWwiLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztBQUZBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFJTyxTQUFTQyxjQUFULENBQXdCQyxHQUF4QixFQUFpRTtBQUN0RSxTQUFPLElBQUlDLE9BQUosQ0FBeUIsVUFBQ0MsT0FBRCxFQUF1QztBQUNyRUMsSUFBQUEsU0FBUyxDQUFDQyxZQUFWLEdBQ0VELFNBQVMsQ0FBQ0MsWUFBVixJQUNBRCxTQUFTLENBQUNFLGtCQURWLElBRUFGLFNBQVMsQ0FBQ0csZUFGVixJQUdBSCxTQUFTLENBQUNJLGNBSlo7QUFLQSxRQUFJLENBQUNQLEdBQUwsRUFBVUEsR0FBRyxHQUFHO0FBQUVRLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLE1BQU0sRUFBRTtBQUF2QixLQUFOO0FBQ1ZOLElBQUFBLFNBQVMsQ0FBQ08sWUFBVixDQUNHTixZQURILENBQ2dCO0FBQUVPLE1BQUFBLEtBQUssRUFBRTtBQUFFSCxRQUFBQSxLQUFLLEVBQUVSLEdBQUcsQ0FBQ1EsS0FBYjtBQUFvQkMsUUFBQUEsTUFBTSxFQUFFVCxHQUFHLENBQUNTO0FBQWhDO0FBQVQsS0FEaEIsRUFF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Q0FBQ0MsR0FBUixDQUFZLG9CQUFaLEVBQWtDO0FBQUVQLE1BQUFBLE1BQU0sRUFBTkE7QUFBRixLQUFsQzs7QUFDQSxJQUFBLEtBQUksQ0FBQ0EsTUFBTCxDQUFZQSxNQUFaO0FBQ0QsR0FIRDtBQUlELEMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgUGVlciBmcm9tIFwic2ltcGxlLXBlZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RyZWFtKG9wdD86IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSkge1xuICByZXR1cm4gbmV3IFByb21pc2U8TWVkaWFTdHJlYW0+KChyZXNvbHZlOiAodjogTWVkaWFTdHJlYW0pID0+IHZvaWQpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcbiAgICBpZiAoIW9wdCkgb3B0ID0geyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHsgd2lkdGg6IG9wdC53aWR0aCwgaGVpZ2h0OiBvcHQuaGVpZ2h0IH0gfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgcGVlcjogV2ViUlRDO1xuICBzdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKF9wZWVyOiBXZWJSVEMsIHN0cmVhbT86IE1lZGlhU3RyZWFtKSB7XG4gICAgdGhpcy5wZWVyID0gX3BlZXI7XG4gICAgdGhpcy5zdHJlYW0gPSAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge307XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghc3RyZWFtKSBzdHJlYW0gPSBhd2FpdCBnZXRMb2NhbFN0cmVhbSgpO1xuICAgIH0pKCk7XG5cbiAgICBsZXQgcDogUGVlci5JbnN0YW5jZTtcbiAgICBpZiAodGhpcy5wZWVyLmlzT2ZmZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gaXNvZmZlclwiKTtcbiAgICAgIHAgPSBuZXcgUGVlcih7IGluaXRpYXRvcjogdHJ1ZSwgc3RyZWFtLCB0cmlja2xlOiBmYWxzZSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gb2ZmZXIgc2lnbmFsXCIsIHsgZGF0YSB9KTtcbiAgICAgICAgdGhpcy5wZWVyLnNlbmQoZGF0YSwgXCJzdHJlYW1fb2ZmZXJcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBpc0Fuc3dlclwiKTtcbiAgICAgIHAgPSBuZXcgUGVlcih7IHN0cmVhbSwgdHJpY2tsZTogZmFsc2UgfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGFuc3dlciBzaWduYWxcIiwgeyBkYXRhIH0pO1xuICAgICAgICB0aGlzLnBlZXIuc2VuZChkYXRhLCBcInN0cmVhbV9hbnN3ZXJcIik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5wZWVyLmV2ZW50cy5kYXRhW1wic3RyZWFtLnRzXCJdID0gZGF0YSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9uZGF0YVwiLCB7IGRhdGEgfSk7XG4gICAgICBpZiAoZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fYW5zd2VyXCIgfHwgZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fb2ZmZXJcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIHNpZ25hbFwiLCBkYXRhLmRhdGEpO1xuICAgICAgICBwLnNpZ25hbChkYXRhLmRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gICAgcC5vbihcImVycm9yXCIsIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IGVyciB9KTtcbiAgICB9KTtcbiAgICBwLm9uKFwic3RyZWFtXCIsIHN0cmVhbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIHN0cmVhbVwiLCB7IHN0cmVhbSB9KTtcbiAgICAgIHRoaXMuc3RyZWFtKHN0cmVhbSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==