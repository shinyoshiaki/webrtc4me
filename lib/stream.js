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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsU3RyZWFtIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndpZHRoIiwiaGVpZ2h0IiwibWVkaWFEZXZpY2VzIiwidmlkZW8iLCJ0aGVuIiwic3RyZWFtIiwiU3RyZWFtIiwiX3BlZXIiLCJwZWVyIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJpc09mZmVyIiwicCIsIlBlZXIiLCJpbml0aWF0b3IiLCJvbiIsImRhdGEiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImV2ZW50cyIsInNkcCIsInBhcnNlIiwibGFiZWwiLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBSU8sU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBaUU7QUFDdEUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUNFRCxTQUFTLENBQUNDLFlBQVYsSUFDQUQsU0FBUyxDQUFDRSxrQkFEVixJQUVBRixTQUFTLENBQUNHLGVBRlYsSUFHQUgsU0FBUyxDQUFDSSxjQUpaO0FBS0EsUUFBSSxDQUFDUCxHQUFMLEVBQVVBLEdBQUcsR0FBRztBQUFFUSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxNQUFNLEVBQUU7QUFBdkIsS0FBTjtBQUNWTixJQUFBQSxTQUFTLENBQUNPLFlBQVYsQ0FDR04sWUFESCxDQUNnQjtBQUFFTyxNQUFBQSxLQUFLLEVBQUU7QUFBRUgsUUFBQUEsS0FBSyxFQUFFUixHQUFHLENBQUNRLEtBQWI7QUFBb0JDLFFBQUFBLE1BQU0sRUFBRVQsR0FBRyxDQUFDUztBQUFoQztBQUFULEtBRGhCLEVBRUdHLElBRkgsQ0FFUSxVQUFBQyxNQUFNLEVBQUk7QUFDZFgsTUFBQUEsT0FBTyxDQUFDVyxNQUFELENBQVA7QUFDRCxLQUpIO0FBS0QsR0FaTSxDQUFQO0FBYUQ7O0lBRW9CQyxNOzs7QUFJbkIsa0JBQVlDLEtBQVosRUFBMkJGLE1BQTNCLEVBQWlEO0FBQUE7O0FBQUE7O0FBQUE7O0FBQy9DLFNBQUtHLElBQUwsR0FBWUQsS0FBWjs7QUFDQSxTQUFLRixNQUFMLEdBQWMsVUFBQ0EsTUFBRCxFQUF5QixDQUFFLENBQXpDOztBQUNBLFNBQUtJLElBQUwsQ0FBVUosTUFBVjtBQUNEOzs7Ozs7OytDQUVVQSxNOzs7Ozs7OztvQkFDSkEsTTs7Ozs7O3VCQUF1QmQsY0FBYyxFOzs7QUFBN0JjLGdCQUFBQSxNOzs7QUFDYkssZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkI7QUFBRU4sa0JBQUFBLE1BQU0sRUFBTkE7QUFBRixpQkFBM0I7O0FBRUEsb0JBQUksS0FBS0csSUFBTCxDQUFVSSxPQUFkLEVBQXVCO0FBQ3JCRixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkscUJBQVo7QUFDQUUsa0JBQUFBLENBQUMsR0FBRyxJQUFJQyxtQkFBSixDQUFTO0FBQUVDLG9CQUFBQSxTQUFTLEVBQUUsSUFBYjtBQUFtQlYsb0JBQUFBLE1BQU0sRUFBTkE7QUFBbkIsbUJBQVQsQ0FBSjtBQUNBUSxrQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssUUFBTCxFQUFlLFVBQUFDLElBQUksRUFBSTtBQUNyQlAsb0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDBCQUFaLEVBQXdDO0FBQUVNLHNCQUFBQSxJQUFJLEVBQUpBO0FBQUYscUJBQXhDOztBQUNBLG9CQUFBLEtBQUksQ0FBQ1QsSUFBTCxDQUFVVSxJQUFWLENBQWVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxJQUFmLENBQWYsRUFBcUMsY0FBckM7QUFDRCxtQkFIRDtBQUlELGlCQVBELE1BT087QUFDTFAsa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFaO0FBQ0FFLGtCQUFBQSxDQUFDLEdBQUcsSUFBSUMsbUJBQUosQ0FBUztBQUFFVCxvQkFBQUEsTUFBTSxFQUFOQTtBQUFGLG1CQUFULENBQUo7QUFDQVEsa0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLFFBQUwsRUFBZSxVQUFBQyxJQUFJLEVBQUk7QUFDckJQLG9CQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwyQkFBWixFQUF5QztBQUFFTSxzQkFBQUEsSUFBSSxFQUFKQTtBQUFGLHFCQUF6Qzs7QUFDQSxvQkFBQSxLQUFJLENBQUNULElBQUwsQ0FBVVUsSUFBVixDQUFlQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsSUFBZixDQUFmLEVBQXFDLGVBQXJDO0FBQ0QsbUJBSEQ7QUFJRDs7QUFDRCxxQkFBS1QsSUFBTCxDQUFVYSxNQUFWLENBQWlCSixJQUFqQixDQUFzQixXQUF0QixJQUFxQyxVQUFBQSxJQUFJLEVBQUk7QUFDM0NQLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQztBQUFFTSxvQkFBQUEsSUFBSSxFQUFKQTtBQUFGLG1CQUFsQztBQUNBLHNCQUFNSyxHQUFHLEdBQUdILElBQUksQ0FBQ0ksS0FBTCxDQUFXTixJQUFJLENBQUNBLElBQWhCLENBQVo7O0FBQ0Esc0JBQUlBLElBQUksQ0FBQ08sS0FBTCxLQUFlLGVBQWYsSUFBa0NQLElBQUksQ0FBQ08sS0FBTCxLQUFlLGNBQXJELEVBQXFFO0FBQ25FZCxvQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0JBQVosRUFBa0M7QUFBRVcsc0JBQUFBLEdBQUcsRUFBSEE7QUFBRixxQkFBbEM7QUFDQVQsb0JBQUFBLENBQUMsQ0FBQ1ksTUFBRixDQUFTSCxHQUFUO0FBQ0Q7QUFDRixpQkFQRDs7QUFRQVQsZ0JBQUFBLENBQUMsQ0FBQ0csRUFBRixDQUFLLE9BQUwsRUFBYyxVQUFBVSxHQUFHLEVBQUk7QUFDbkJoQixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk7QUFBRWUsb0JBQUFBLEdBQUcsRUFBSEE7QUFBRixtQkFBWjtBQUNELGlCQUZEO0FBR0FiLGdCQUFBQSxDQUFDLENBQUNHLEVBQUYsQ0FBSyxRQUFMLEVBQWUsVUFBQVgsTUFBTSxFQUFJO0FBQ3ZCSyxrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0JBQVosRUFBa0M7QUFBRU4sb0JBQUFBLE1BQU0sRUFBTkE7QUFBRixtQkFBbEM7O0FBQ0Esa0JBQUEsS0FBSSxDQUFDQSxNQUFMLENBQVlBLE1BQVo7QUFDRCxpQkFIRDtBQUlBUSxnQkFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUssU0FBTCxFQUFnQixZQUFNO0FBQ3BCTixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVo7QUFDRCxpQkFGRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBQZWVyIGZyb20gXCJzaW1wbGUtcGVlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxTdHJlYW0ob3B0PzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyB2aWRlbzogeyB3aWR0aDogb3B0LndpZHRoLCBoZWlnaHQ6IG9wdC5oZWlnaHQgfSB9KVxuICAgICAgLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgICAgcmVzb2x2ZShzdHJlYW0pO1xuICAgICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBwZWVyOiBXZWJSVEM7XG4gIHN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoX3BlZXI6IFdlYlJUQywgc3RyZWFtPzogTWVkaWFTdHJlYW0pIHtcbiAgICB0aGlzLnBlZXIgPSBfcGVlcjtcbiAgICB0aGlzLnN0cmVhbSA9IChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7fTtcbiAgICB0aGlzLmluaXQoc3RyZWFtKTtcbiAgfVxuXG4gIGFzeW5jIGluaXQoc3RyZWFtPzogTWVkaWFTdHJlYW0pIHtcbiAgICBpZiAoIXN0cmVhbSkgc3RyZWFtID0gYXdhaXQgZ2V0TG9jYWxTdHJlYW0oKTtcbiAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtXCIsIHsgc3RyZWFtIH0pO1xuICAgIGxldCBwOiBQZWVyLkluc3RhbmNlO1xuICAgIGlmICh0aGlzLnBlZXIuaXNPZmZlcikge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBpc29mZmVyXCIpO1xuICAgICAgcCA9IG5ldyBQZWVyKHsgaW5pdGlhdG9yOiB0cnVlLCBzdHJlYW0gfSk7XG4gICAgICBwLm9uKFwic2lnbmFsXCIsIGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIG9mZmVyIHNpZ25hbFwiLCB7IGRhdGEgfSk7XG4gICAgICAgIHRoaXMucGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpLCBcInN0cmVhbV9vZmZlclwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIGlzQW5zd2VyXCIpO1xuICAgICAgcCA9IG5ldyBQZWVyKHsgc3RyZWFtIH0pO1xuICAgICAgcC5vbihcInNpZ25hbFwiLCBkYXRhID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3NG1lIHN0cmVhbSBhbnN3ZXIgc2lnbmFsXCIsIHsgZGF0YSB9KTtcbiAgICAgICAgdGhpcy5wZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSksIFwic3RyZWFtX2Fuc3dlclwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnBlZXIuZXZlbnRzLmRhdGFbXCJzdHJlYW0udHNcIl0gPSBkYXRhID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gb25kYXRhXCIsIHsgZGF0YSB9KTtcbiAgICAgIGNvbnN0IHNkcCA9IEpTT04ucGFyc2UoZGF0YS5kYXRhKTtcbiAgICAgIGlmIChkYXRhLmxhYmVsID09PSBcInN0cmVhbV9hbnN3ZXJcIiB8fCBkYXRhLmxhYmVsID09PSBcInN0cmVhbV9vZmZlclwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidzRtZSBzdHJlYW0gc2lnbmFsXCIsIHsgc2RwIH0pO1xuICAgICAgICBwLnNpZ25hbChzZHApO1xuICAgICAgfVxuICAgIH07XG4gICAgcC5vbihcImVycm9yXCIsIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IGVyciB9KTtcbiAgICB9KTtcbiAgICBwLm9uKFwic3RyZWFtXCIsIHN0cmVhbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInc0bWUgc3RyZWFtIHN0cmVhbVwiLCB7IHN0cmVhbSB9KTtcbiAgICAgIHRoaXMuc3RyZWFtKHN0cmVhbSk7XG4gICAgfSk7XG4gICAgcC5vbihcImNvbm5lY3RcIiwgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ3NG1lIGNvbm5lY3RlZFwiKTtcbiAgICB9KTtcbiAgfVxufVxuIl19