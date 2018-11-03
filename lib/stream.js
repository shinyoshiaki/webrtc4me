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
    p = new _simplePeer.default({
      initiator: true,
      stream: stream,
      trickle: false
    });
    p.on("signal", function (data) {
      _this.peer.send(data, "stream_offer");
    });
  } else {
    p = new _simplePeer.default({
      stream: stream,
      trickle: false
    });
    p.on("signal", function (data) {
      _this.peer.send(data, "stream_answer");
    });
  }

  this.peer.events.data["stream.ts"] = function (data) {
    if (data.label === "stream_answer") {
      p.signal(data.data);
    } else if (data.label === "stream_offer") {
      p.signal(data.data);
    }
  };

  p.on("stream", function (stream) {
    _this.stream(stream);
  });
};

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwicCIsImlzT2ZmZXIiLCJQZWVyIiwiaW5pdGlhdG9yIiwidHJpY2tsZSIsIm9uIiwiZGF0YSIsInNlbmQiLCJldmVudHMiLCJsYWJlbCIsInNpZ25hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUlPLFNBQVNDLGNBQVQsQ0FBd0JDLEdBQXhCLEVBQWlFO0FBQ3RFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FDRUQsU0FBUyxDQUFDQyxZQUFWLElBQ0FELFNBQVMsQ0FBQ0Usa0JBRFYsSUFFQUYsU0FBUyxDQUFDRyxlQUZWLElBR0FILFNBQVMsQ0FBQ0ksY0FKWjtBQUtBLFFBQUksQ0FBQ1AsR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRVEsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVk4sSUFBQUEsU0FBUyxDQUFDTyxZQUFWLENBQ0dOLFlBREgsQ0FDZ0I7QUFBRU8sTUFBQUEsS0FBSyxFQUFFO0FBQUVILFFBQUFBLEtBQUssRUFBRVIsR0FBRyxDQUFDUSxLQUFiO0FBQW9CQyxRQUFBQSxNQUFNLEVBQUVULEdBQUcsQ0FBQ1M7QUFBaEM7QUFBVCxLQURoQixFQUVHRyxJQUZILENBRVEsVUFBQUMsTUFBTSxFQUFJO0FBQ2RYLE1BQUFBLE9BQU8sQ0FBQ1csTUFBRCxDQUFQO0FBQ0QsS0FKSDtBQUtELEdBWk0sQ0FBUDtBQWFEOztJQUVvQkMsTSxHQUluQixnQkFBWUMsS0FBWixFQUEyQkYsTUFBM0IsRUFBaUQ7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDL0MsT0FBS0csSUFBTCxHQUFZRCxLQUFaOztBQUNBLE9BQUtGLE1BQUwsR0FBYyxVQUFDQSxNQUFELEVBQXlCLENBQUUsQ0FBekM7O0FBQ0E7QUFBQTtBQUFBLDBCQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFDTUEsTUFETjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLG1CQUM2QmQsY0FBYyxFQUQzQzs7QUFBQTtBQUNjYyxZQUFBQSxNQURkOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUQ7O0FBSUEsTUFBSUksQ0FBSjs7QUFDQSxNQUFJLEtBQUtELElBQUwsQ0FBVUUsT0FBZCxFQUF1QjtBQUNyQkQsSUFBQUEsQ0FBQyxHQUFHLElBQUlFLG1CQUFKLENBQVM7QUFBRUMsTUFBQUEsU0FBUyxFQUFFLElBQWI7QUFBbUJQLE1BQUFBLE1BQU0sRUFBTkEsTUFBbkI7QUFBMkJRLE1BQUFBLE9BQU8sRUFBRTtBQUFwQyxLQUFULENBQUo7QUFDQUosSUFBQUEsQ0FBQyxDQUFDSyxFQUFGLENBQUssUUFBTCxFQUFlLFVBQUFDLElBQUksRUFBSTtBQUNyQixNQUFBLEtBQUksQ0FBQ1AsSUFBTCxDQUFVUSxJQUFWLENBQWVELElBQWYsRUFBcUIsY0FBckI7QUFDRCxLQUZEO0FBR0QsR0FMRCxNQUtPO0FBQ0xOLElBQUFBLENBQUMsR0FBRyxJQUFJRSxtQkFBSixDQUFTO0FBQUVOLE1BQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVUSxNQUFBQSxPQUFPLEVBQUU7QUFBbkIsS0FBVCxDQUFKO0FBQ0FKLElBQUFBLENBQUMsQ0FBQ0ssRUFBRixDQUFLLFFBQUwsRUFBZSxVQUFBQyxJQUFJLEVBQUk7QUFDckIsTUFBQSxLQUFJLENBQUNQLElBQUwsQ0FBVVEsSUFBVixDQUFlRCxJQUFmLEVBQXFCLGVBQXJCO0FBQ0QsS0FGRDtBQUdEOztBQUNELE9BQUtQLElBQUwsQ0FBVVMsTUFBVixDQUFpQkYsSUFBakIsQ0FBc0IsV0FBdEIsSUFBcUMsVUFBQUEsSUFBSSxFQUFJO0FBQzNDLFFBQUlBLElBQUksQ0FBQ0csS0FBTCxLQUFlLGVBQW5CLEVBQW9DO0FBQ2xDVCxNQUFBQSxDQUFDLENBQUNVLE1BQUYsQ0FBU0osSUFBSSxDQUFDQSxJQUFkO0FBQ0QsS0FGRCxNQUVPLElBQUlBLElBQUksQ0FBQ0csS0FBTCxLQUFlLGNBQW5CLEVBQW1DO0FBQ3hDVCxNQUFBQSxDQUFDLENBQUNVLE1BQUYsQ0FBU0osSUFBSSxDQUFDQSxJQUFkO0FBQ0Q7QUFDRixHQU5EOztBQVFBTixFQUFBQSxDQUFDLENBQUNLLEVBQUYsQ0FBSyxRQUFMLEVBQWUsVUFBQVQsTUFBTSxFQUFJO0FBQ3ZCLElBQUEsS0FBSSxDQUFDQSxNQUFMLENBQVlBLE1BQVo7QUFDRCxHQUZEO0FBR0QsQyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBQZWVyIGZyb20gXCJzaW1wbGUtcGVlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxTdHJlYW0ob3B0PzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyB2aWRlbzogeyB3aWR0aDogb3B0LndpZHRoLCBoZWlnaHQ6IG9wdC5oZWlnaHQgfSB9KVxuICAgICAgLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgICAgcmVzb2x2ZShzdHJlYW0pO1xuICAgICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBwZWVyOiBXZWJSVEM7XG4gIHN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoX3BlZXI6IFdlYlJUQywgc3RyZWFtPzogTWVkaWFTdHJlYW0pIHtcbiAgICB0aGlzLnBlZXIgPSBfcGVlcjtcbiAgICB0aGlzLnN0cmVhbSA9IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7fTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFzdHJlYW0pIHN0cmVhbSA9IGF3YWl0IGdldExvY2FsU3RyZWFtKCk7XG4gICAgfSkoKTtcblxuICAgIGxldCBwOiBQZWVyLkluc3RhbmNlO1xuICAgIGlmICh0aGlzLnBlZXIuaXNPZmZlcikge1xuICAgICAgcCA9IG5ldyBQZWVyKHsgaW5pdGlhdG9yOiB0cnVlLCBzdHJlYW0sIHRyaWNrbGU6IGZhbHNlIH0pO1xuICAgICAgcC5vbihcInNpZ25hbFwiLCBkYXRhID0+IHtcbiAgICAgICAgdGhpcy5wZWVyLnNlbmQoZGF0YSwgXCJzdHJlYW1fb2ZmZXJcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcCA9IG5ldyBQZWVyKHsgc3RyZWFtLCB0cmlja2xlOiBmYWxzZSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKGRhdGEsIFwic3RyZWFtX2Fuc3dlclwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnBlZXIuZXZlbnRzLmRhdGFbXCJzdHJlYW0udHNcIl0gPSBkYXRhID0+IHtcbiAgICAgIGlmIChkYXRhLmxhYmVsID09PSBcInN0cmVhbV9hbnN3ZXJcIikge1xuICAgICAgICBwLnNpZ25hbChkYXRhLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLmxhYmVsID09PSBcInN0cmVhbV9vZmZlclwiKSB7XG4gICAgICAgIHAuc2lnbmFsKGRhdGEuZGF0YSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHAub24oXCJzdHJlYW1cIiwgc3RyZWFtID0+IHtcbiAgICAgIHRoaXMuc3RyZWFtKHN0cmVhbSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==