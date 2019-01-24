"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;
exports.default = exports.MediaType = void 0;

var _simplePeer = _interopRequireDefault(require("simple-peer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("babel-polyfill");

function getLocalVideo(opt) {
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

function getLocalAudio(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(function (stream) {
      resolve(stream);
    });
  });
}

var MediaType;
exports.MediaType = MediaType;

(function (MediaType) {
  MediaType[MediaType["video"] = 0] = "video";
  MediaType[MediaType["audio"] = 1] = "audio";
})(MediaType || (exports.MediaType = MediaType = {}));

var Label;

(function (Label) {
  Label["offer"] = "stream_offer";
  Label["answer"] = "stream_answer";
})(Label || (Label = {}));

var Stream =
/*#__PURE__*/
function () {
  function Stream(peer, opt) {
    _classCallCheck(this, Stream);

    _defineProperty(this, "onStream", void 0);

    opt = opt || {};

    this.onStream = function (_) {};

    this.init(peer, opt.stream, opt.type);
  }

  _createClass(Stream, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(peer, _stream, type) {
        var _this = this;

        var stream, p;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _stream;

                if (_context2.t0) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 4;
                return _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(type && type == MediaType.video)) {
                            _context.next = 6;
                            break;
                          }

                          _context.next = 3;
                          return getLocalVideo();

                        case 3:
                          return _context.abrupt("return", _context.sent);

                        case 6:
                          _context.next = 8;
                          return getLocalAudio();

                        case 8:
                          return _context.abrupt("return", _context.sent);

                        case 9:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }))();

              case 4:
                _context2.t0 = _context2.sent;

              case 5:
                stream = _context2.t0;

                if (peer.isOffer) {
                  p = new _simplePeer.default({
                    initiator: true,
                    stream: stream
                  });
                  p.on("signal", function (sdp) {
                    peer.send(JSON.stringify(sdp), Label.offer);
                  });
                } else {
                  p = new _simplePeer.default({
                    stream: stream
                  });
                  p.on("signal", function (sdp) {
                    peer.send(JSON.stringify(sdp), Label.answer);
                  });
                }

                peer.addOnData(function (raw) {
                  var sdp = JSON.parse(raw.data);

                  if (raw.label === Label.answer || raw.label === Label.offer) {
                    console.log("signal", {
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
                  _this.onStream(stream);
                });
                p.on("connect", function () {
                  console.log("simple-peer");
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function init(_x, _x2, _x3) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return Stream;
}();

exports.default = Stream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldExvY2FsVmlkZW8iLCJvcHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm5hdmlnYXRvciIsImdldFVzZXJNZWRpYSIsIndlYmtpdEdldFVzZXJNZWRpYSIsIm1vekdldFVzZXJNZWRpYSIsIm1zR2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJ2aWRlbyIsInRoZW4iLCJzdHJlYW0iLCJnZXRMb2NhbEF1ZGlvIiwiYXVkaW8iLCJNZWRpYVR5cGUiLCJMYWJlbCIsIlN0cmVhbSIsInBlZXIiLCJvblN0cmVhbSIsIl8iLCJpbml0IiwidHlwZSIsIl9zdHJlYW0iLCJpc09mZmVyIiwicCIsIlBlZXIiLCJpbml0aWF0b3IiLCJvbiIsInNkcCIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwib2ZmZXIiLCJhbnN3ZXIiLCJhZGRPbkRhdGEiLCJyYXciLCJwYXJzZSIsImRhdGEiLCJsYWJlbCIsImNvbnNvbGUiLCJsb2ciLCJzaWduYWwiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRkFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUlPLFNBQVNDLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQWdFO0FBQ3JFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FDRUQsU0FBUyxDQUFDQyxZQUFWLElBQ0FELFNBQVMsQ0FBQ0Usa0JBRFYsSUFFQUYsU0FBUyxDQUFDRyxlQUZWLElBR0FILFNBQVMsQ0FBQ0ksY0FKWjtBQUtBLFFBQUksQ0FBQ1AsR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRVEsTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVk4sSUFBQUEsU0FBUyxDQUFDTyxZQUFWLENBQ0dO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QUFaO0FBQ0QsaUJBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgUGVlciBmcm9tIFwic2ltcGxlLXBlZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsVmlkZW8ob3B0PzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyB2aWRlbzogeyB3aWR0aDogb3B0LndpZHRoLCBoZWlnaHQ6IG9wdC5oZWlnaHQgfSB9KVxuICAgICAgLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgICAgcmVzb2x2ZShzdHJlYW0pO1xuICAgICAgfSk7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsQXVkaW8ob3B0PzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fFxuICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSwgdmlkZW86IGZhbHNlIH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5lbnVtIExhYmVsIHtcbiAgb2ZmZXIgPSBcInN0cmVhbV9vZmZlclwiLFxuICBhbnN3ZXIgPSBcInN0cmVhbV9hbnN3ZXJcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocGVlcjogV2ViUlRDLCBvcHQ/OiB7IHN0cmVhbT86IE1lZGlhU3RyZWFtOyB0eXBlPzogTWVkaWFUeXBlIH0pIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5pbml0KHBlZXIsIG9wdC5zdHJlYW0sIG9wdC50eXBlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdChwZWVyOiBXZWJSVEMsIF9zdHJlYW0/OiBNZWRpYVN0cmVhbSwgdHlwZT86IE1lZGlhVHlwZSkge1xuICAgIGNvbnN0IHN0cmVhbTogTWVkaWFTdHJlYW0gPVxuICAgICAgX3N0cmVhbSB8fFxuICAgICAgKGF3YWl0IChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlICYmICh0eXBlIGFzIE1lZGlhVHlwZSkgPT0gTWVkaWFUeXBlLnZpZGVvKSB7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldExvY2FsVmlkZW8oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxBdWRpbygpO1xuICAgICAgICB9XG4gICAgICB9KSgpKTtcblxuICAgIGxldCBwOiBQZWVyLkluc3RhbmNlO1xuICAgIGlmIChwZWVyLmlzT2ZmZXIpIHtcbiAgICAgIHAgPSBuZXcgUGVlcih7IGluaXRpYXRvcjogdHJ1ZSwgc3RyZWFtIH0pO1xuICAgICAgcC5vbihcInNpZ25hbFwiLCBzZHAgPT4ge1xuICAgICAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2RwKSwgTGFiZWwub2ZmZXIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHAgPSBuZXcgUGVlcih7IHN0cmVhbSB9KTtcbiAgICAgIHAub24oXCJzaWduYWxcIiwgc2RwID0+IHtcbiAgICAgICAgcGVlci5zZW5kKEpTT04uc3RyaW5naWZ5KHNkcCksIExhYmVsLmFuc3dlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcGVlci5hZGRPbkRhdGEocmF3ID0+IHtcbiAgICAgIGNvbnN0IHNkcCA9IEpTT04ucGFyc2UocmF3LmRhdGEpO1xuICAgICAgaWYgKHJhdy5sYWJlbCA9PT0gTGFiZWwuYW5zd2VyIHx8IHJhdy5sYWJlbCA9PT0gTGFiZWwub2ZmZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzaWduYWxcIiwgeyBzZHAgfSk7XG4gICAgICAgIHAuc2lnbmFsKHNkcCk7XG4gICAgICB9XG4gICAgfSwgXCJzdHJlYW1cIik7XG4gICAgcC5vbihcImVycm9yXCIsIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh7IGVyciB9KTtcbiAgICB9KTtcbiAgICBwLm9uKFwic3RyZWFtXCIsIHN0cmVhbSA9PiB7XG4gICAgICB0aGlzLm9uU3RyZWFtKHN0cmVhbSk7XG4gICAgfSk7XG4gICAgcC5vbihcImNvbm5lY3RcIiwgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJzaW1wbGUtcGVlclwiKTtcbiAgICB9KTtcbiAgfVxufVxuIl19