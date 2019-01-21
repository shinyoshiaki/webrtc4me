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

    _defineProperty(this, "onStream", void 0);

    this.peer = _peer;

    this.onStream = function (stream) {};

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
                if (this.peer.isOffer) {
                  p = new _simplePeer.default({
                    initiator: true,
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    _this.peer.send(JSON.stringify(data), "stream_offer");
                  });
                } else {
                  p = new _simplePeer.default({
                    stream: stream
                  });
                  p.on("signal", function (data) {
                    _this.peer.send(JSON.stringify(data), "stream_answer");
                  });
                }

                this.peer.addOnData(function (data) {
                  var sdp = JSON.parse(data.data);

                  if (data.label === "stream_answer" || data.label === "stream_offer") {
                    p.signal(sdp);
                  }
                }, "stream");
                p.on("error", function (err) {
                  console.log({
                    err: err
                  });
                });
                p.on("stream", function (stream) {
                  _this.onStream(stream);
                });
                p.on("connect", function () {});

              case 9:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwib25TdHJlYW0iLCJpbml0IiwiaXNPZmZlciIsInAiLCJQZWVyIiwiaW5pdGlhdG9yIiwib24iLCJkYXRhIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJhZGRPbkRhdGEiLCJzZHAiLCJwYXJzZSIsImxhYmVsIiwic2lnbmFsIiwiZXJyIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQUZBQSxPQUFPLENBQUMsZ0JBQUQsQ0FBUDs7QUFJTyxTQUFTQyxjQUFULENBQXdCQyxHQUF4QixFQUFpRTtBQUN0RSxTQUFPLElBQUlDLE9BQUosQ0FBeUIsVUFBQ0MsT0FBRCxFQUF1QztBQUNyRUMsSUFBQUEsU0FBUyxDQUFDQyxZQUFWLEdBQ0VELFNBQVMsQ0FBQ0MsWUFBVixJQUNBRCxTQUFTLENBQUNFLGtCQURWLElBRUFGLFNBQVMsQ0FBQ0csZUFGVixJQUdBSCxTQUFTLENBQUNJLGNBSlo7QUFLQSxRQUFJLENBQUNQLEdBQUwsRUFBVUEsR0FBRyxHQUFHO0FBQUVRLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLE1BQU0sRUFBRTtBQUF2QixLQUFOO0FBQ1ZOLElBQUFBLFNBQVMsQ0FBQ08sWUFBVixDQUNHTixZQURILENBQ2dCO0FBQUVPLE1BQUFBLEtBQUssRUFBRTtBQUFFSCxRQUFBQSxLQUFLLEVBQUVSLEdBQUcsQ0FBQ1EsS0FBYjtBQUFvQkMsUUFBQUEsTUFBTSxFQUFFVCxHQUFHLENBQUNTO0FBQWhDO0FBQVQsS0FEaEIsRUFFR0csSUFGSCxDQUVRLFVBQUFDLE1BQU0sRUFBSTtBQUNkWCxNQUFBQSxPQUFPLENBQUNXLE1BQUQsQ0FBUDtBQUNELEtBSkg7QUFLRCxHQVpNLENBQVA7QUFhRDs7SUFFb0JDLE07OztBQUluQixrQkFBWUMsS0FBWixFQUEyQkYsTUFBM0IsRUFBaUQ7QUFBQTs7QUFBQTs7QUFBQTs7QUFDL0MsU0FBS0csSUFBTCxHQUFZRCxLQUFaOztBQUNBLFNBQUtFLFFBQUwsR0FBZ0IsVUFBQ0osTUFBRCxFQUF5QixDQUFFLENBQTNDOztBQUNBLFNBQUtLLElBQUwsQ0FBVUwsTUFBVjtBQUNEOzs7Ozs7OytDQUVrQkEsTTs7Ozs7Ozs7b0JBQ1pBLE07Ozs7Ozt1QkFBdUJkLGNBQWMsRTs7O0FBQTdCYyxnQkFBQUEsTTs7O0FBRWIsb0JBQUksS0FBS0csSUFBTCxDQUFVRyxPQUFkLEVBQXVCO0FBQ3JCQyxrQkFBQUEsQ0FBQyxHQUFHLElBQUlDLG1CQUFKLENBQVM7QUFBRUMsb0JBQUFBLFNBQVMsRUFBRSxJQUFiO0FBQW1CVCxvQkFBQUEsTUFBTSxFQUFOQTtBQUFuQixtQkFBVCxDQUFKO0FBQ0FPLGtCQUFBQSxDQUFDLENBQUNHLEVBQUYsQ0FBSyxRQUFMLEVBQWUsVUFBQUMsSUFBSSxFQUFJO0FBQ3JCLG9CQUFBLEtBQUksQ0FBQ1IsSUFBTCxDQUFVUyxJQUFWLENBQWVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxJQUFmLENBQWYsRUFBcUMsY0FBckM7QUFDRCxtQkFGRDtBQUdELGlCQUxELE1BS087QUFDTEosa0JBQUFBLENBQUMsR0FBRyxJQUFJQyxtQkFBSixDQUFTO0FBQUVSLG9CQUFBQSxNQUFNLEVBQU5BO0FBQUYsbUJBQVQsQ0FBSjtBQUNBTyxrQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssUUFBTCxFQUFlLFVBQUFDLElBQUksRUFBSTtBQUNyQixvQkFBQSxLQUFJLENBQUNSLElBQUwsQ0FBVVMsSUFBVixDQUFlQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsSUFBZixDQUFmLEVBQXFDLGVBQXJDO0FBQ0QsbUJBRkQ7QUFHRDs7QUFDRCxxQkFBS1IsSUFBTCxDQUFVWSxTQUFWLENBQW9CLFVBQUFKLElBQUksRUFBSTtBQUMxQixzQkFBTUssR0FBRyxHQUFHSCxJQUFJLENBQUNJLEtBQUwsQ0FBV04sSUFBSSxDQUFDQSxJQUFoQixDQUFaOztBQUNBLHNCQUFJQSxJQUFJLENBQUNPLEtBQUwsS0FBZSxlQUFmLElBQWtDUCxJQUFJLENBQUNPLEtBQUwsS0FBZSxjQUFyRCxFQUFxRTtBQUNuRVgsb0JBQUFBLENBQUMsQ0FBQ1ksTUFBRixDQUFTSCxHQUFUO0FBQ0Q7QUFDRixpQkFMRCxFQUtHLFFBTEg7QUFNQVQsZ0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLE9BQUwsRUFBYyxVQUFBVSxHQUFHLEVBQUk7QUFDbkJDLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWTtBQUFFRixvQkFBQUEsR0FBRyxFQUFIQTtBQUFGLG1CQUFaO0FBQ0QsaUJBRkQ7QUFHQWIsZ0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLFFBQUwsRUFBZSxVQUFBVixNQUFNLEVBQUk7QUFDdkIsa0JBQUEsS0FBSSxDQUFDSSxRQUFMLENBQWNKLE1BQWQ7QUFDRCxpQkFGRDtBQUdBTyxnQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssU0FBTCxFQUFnQixZQUFNLENBQUUsQ0FBeEIiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgUGVlciBmcm9tIFwic2ltcGxlLXBlZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RyZWFtKG9wdD86IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSkge1xuICByZXR1cm4gbmV3IFByb21pc2U8TWVkaWFTdHJlYW0+KChyZXNvbHZlOiAodjogTWVkaWFTdHJlYW0pID0+IHZvaWQpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcbiAgICBpZiAoIW9wdCkgb3B0ID0geyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHsgd2lkdGg6IG9wdC53aWR0aCwgaGVpZ2h0OiBvcHQuaGVpZ2h0IH0gfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgcGVlcjogV2ViUlRDO1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoX3BlZXI6IFdlYlJUQywgc3RyZWFtPzogTWVkaWFTdHJlYW0pIHtcbiAgICB0aGlzLnBlZXIgPSBfcGVlcjtcbiAgICB0aGlzLm9uU3RyZWFtID0gKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHt9O1xuICAgIHRoaXMuaW5pdChzdHJlYW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KHN0cmVhbT86IE1lZGlhU3RyZWFtKSB7XG4gICAgaWYgKCFzdHJlYW0pIHN0cmVhbSA9IGF3YWl0IGdldExvY2FsU3RyZWFtKCk7XG4gICAgbGV0IHA6IFBlZXIuSW5zdGFuY2U7XG4gICAgaWYgKHRoaXMucGVlci5pc09mZmVyKSB7XG4gICAgICBwID0gbmV3IFBlZXIoeyBpbml0aWF0b3I6IHRydWUsIHN0cmVhbSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpLCBcInN0cmVhbV9vZmZlclwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwID0gbmV3IFBlZXIoeyBzdHJlYW0gfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSwgXCJzdHJlYW1fYW5zd2VyXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMucGVlci5hZGRPbkRhdGEoZGF0YSA9PiB7XG4gICAgICBjb25zdCBzZHAgPSBKU09OLnBhcnNlKGRhdGEuZGF0YSk7XG4gICAgICBpZiAoZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fYW5zd2VyXCIgfHwgZGF0YS5sYWJlbCA9PT0gXCJzdHJlYW1fb2ZmZXJcIikge1xuICAgICAgICBwLnNpZ25hbChzZHApO1xuICAgICAgfVxuICAgIH0sIFwic3RyZWFtXCIpO1xuICAgIHAub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coeyBlcnIgfSk7XG4gICAgfSk7XG4gICAgcC5vbihcInN0cmVhbVwiLCBzdHJlYW0gPT4ge1xuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICAgIHAub24oXCJjb25uZWN0XCIsICgpID0+IHt9KTtcbiAgfVxufVxuIl19