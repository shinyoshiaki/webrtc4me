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

                this.peer.addOnData("stream", function (data) {
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
                });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJpc09mZmVyIiwicCIsIlBlZXIiLCJpbml0aWF0b3IiLCJvbiIsImRhdGEiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZE9uRGF0YSIsInNkcCIsInBhcnNlIiwibGFiZWwiLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBSU8sU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBaUU7QUFDdEUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUNFRCxTQUFTLENBQUNDLFlBQVYsSUFDQUQsU0FBUyxDQUFDRSxrQkFEVixJQUVBRixTQUFTLENBQUNHLGVBRlYsSUFHQUgsU0FBUyxDQUFDSSxjQUpaO0FBS0EsUUFBSSxDQUFDUCxHQUFMLEVBQVVBLEdBQUcsR0FBRztBQUFFUSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxNQUFNLEVBQUU7QUFBdkIsS0FBTjtBQUNWTixJQUFBQSxTQUFTLENBQUNPLFlBQVYsQ0FDR04sWUFESCxDQUNnQjtBQUFFTyxNQUFBQSxLQUFLLEVBQUU7QUFBRUgsUUFBQUEsS0FBSyxFQUFFUixHQUFHLENBQUNRLEtBQWI7QUFBb0JDLFFBQUFBLE1BQU0s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QUFZO0FBQUVlLG9CQUFBQSxHQUFHLEVBQUhBO0FBQUYsbUJBQVo7QUFDRCxpQkFGRDtBQUdBYixnQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssUUFBTCxFQUFlLFVBQUFYLE1BQU0sRUFBSTtBQUN2Qkssa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFaLEVBQWtDO0FBQUVOLG9CQUFBQSxNQUFNLEVBQU5BO0FBQUYsbUJBQWxDOztBQUNBLGtCQUFBLEtBQUksQ0FBQ0EsTUFBTCxDQUFZQSxNQUFaO0FBQ0QsaUJBSEQ7QUFJQVEsZ0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLFNBQUwsRUFBZ0IsWUFBTTtBQUNwQk4sa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFaO0FBQ0QsaUJBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgUGVlciBmcm9tIFwic2ltcGxlLXBlZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RyZWFtKG9wdD86IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSkge1xuICByZXR1cm4gbmV3IFByb21pc2U8TWVkaWFTdHJlYW0+KChyZXNvbHZlOiAodjogTWVkaWFTdHJlYW0pID0+IHZvaWQpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcbiAgICAgIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcbiAgICBpZiAoIW9wdCkgb3B0ID0geyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHsgd2lkdGg6IG9wdC53aWR0aCwgaGVpZ2h0OiBvcHQuaGVpZ2h0IH0gfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcbiAgcGVlcjogV2ViUlRDO1xuICBzdHJlYW06IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKF9wZWVyOiBXZWJSVEMsIHN0cmVhbT86IE1lZGlhU3RyZWFtKSB7XG4gICAgdGhpcy5wZWVyID0gX3BlZXI7XG4gICAgdGhpcy5zdHJlYW0gPSAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge307XG4gICAgdGhpcy5pbml0KHN0cmVhbSk7XG4gIH1cblxuICBhc3luYyBpbml0KHN0cmVhbT86IE1lZGlhU3RyZWFtKSB7XG4gICAgaWYgKCFzdHJlYW0pIHN0cmVhbSA9IGF3YWl0IGdldExvY2FsU3RyZWFtKCk7XG4gICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbVwiLCB7IHN0cmVhbSB9KTtcbiAgICBsZXQgcDogUGVlci5JbnN0YW5jZTtcbiAgICBpZiAodGhpcy5wZWVyLmlzT2ZmZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gaXNvZmZlclwiKTtcbiAgICAgIHAgPSBuZXcgUGVlcih7IGluaXRpYXRvcjogdHJ1ZSwgc3RyZWFtIH0pO1xuICAgICAgcC5vbihcInNpZ25hbFwiLCBkYXRhID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBvZmZlciBzaWduYWxcIiwgeyBkYXRhIH0pO1xuICAgICAgICB0aGlzLnBlZXIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSwgXCJzdHJlYW1fb2ZmZXJcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBpc0Fuc3dlclwiKTtcbiAgICAgIHAgPSBuZXcgUGVlcih7IHN0cmVhbSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gYW5zd2VyIHNpZ25hbFwiLCB7IGRhdGEgfSk7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpLCBcInN0cmVhbV9hbnN3ZXJcIik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5wZWVyLmFkZE9uRGF0YShcInN0cmVhbVwiLCBkYXRhID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gb25kYXRhXCIsIHsgZGF0YSB9KTtcbiAgICAgIGNvbnN0IHNkcCA9IEpTT04ucGFyc2UoZGF0YS5kYXRhKTtcbiAgICAgIGlmIChkYXRhLmxhYmVsID09PSBcInN0cmVhbV9hbnN3ZXJcIiB8fCBkYXRhLmxhYmVsID09PSBcInN0cmVhbV9vZmZlclwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gc2lnbmFsXCIsIHsgc2RwIH0pO1xuICAgICAgICBwLnNpZ25hbChzZHApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHAub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coeyBlcnIgfSk7XG4gICAgfSk7XG4gICAgcC5vbihcInN0cmVhbVwiLCBzdHJlYW0gPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBzdHJlYW1cIiwgeyBzdHJlYW0gfSk7XG4gICAgICB0aGlzLnN0cmVhbShzdHJlYW0pO1xuICAgIH0pO1xuICAgIHAub24oXCJjb25uZWN0XCIsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBjb25uZWN0ZWRcIik7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==