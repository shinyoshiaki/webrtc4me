"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;
exports.default = exports.MediaType = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLocalVideo(opt) {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia;
    if (!opt) opt = {
      width: 1280,
      height: 720
    };
    navigator.mediaDevices.getUserMedia({
      audio: true,
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
    navigator.getUserMedia = navigator.getUserMedia;
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

        var stream;
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
                stream.getTracks().forEach(function (track) {
                  return peer.rtc.addTrack(track, stream);
                });

                peer.rtc.ontrack = function (event) {
                  console.log("ontrack", {
                    event: event
                  });
                  var stream = event.streams[0];

                  _this.onStream(stream);
                };

              case 8:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW0udHMiXSwibmFtZXMiOlsiZ2V0TG9jYWxWaWRlbyIsIm9wdCIsIlByb21pc2UiLCJyZXNvbHZlIiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwid2lkdGgiLCJoZWlnaHQiLCJtZWRpYURldmljZXMiLCJhdWRpbyIsInZpZGVvIiwidGhlbiIsInN0cmVhbSIsImdldExvY2FsQXVkaW8iLCJNZWRpYVR5cGUiLCJTdHJlYW0iLCJwZWVyIiwib25TdHJlYW0iLCJfIiwiaW5pdCIsInR5cGUiLCJfc3RyZWFtIiwiZ2V0VHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwicnRjIiwiYWRkVHJhY2siLCJvbnRyYWNrIiwiZXZlbnQiLCJjb25zb2xlIiwibG9nIiwic3RyZWFtcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sU0FBU0EsYUFBVCxDQUF1QkMsR0FBdkIsRUFBZ0U7QUFDckUsU0FBTyxJQUFJQyxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUF5QkQsU0FBUyxDQUFDQyxZQUFuQztBQUVBLFFBQUksQ0FBQ0osR0FBTCxFQUFVQSxHQUFHLEdBQUc7QUFBRUssTUFBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZUMsTUFBQUEsTUFBTSxFQUFFO0FBQXZCLEtBQU47QUFDVkgsSUFBQUEsU0FBUyxDQUFDSSxZQUFWLENBQ0dILFlBREgsQ0FDZ0I7QUFDWkksTUFBQUEsS0FBSyxFQUFFLElBREs7QUFFWkMsTUFBQUEsS0FBSyxFQUFFO0FBQUVKLFFBQUFBLEtBQUssRUFBRUwsR0FBRyxDQUFDSyxLQUFiO0FBQW9CQyxRQUFBQSxNQUFNLEVBQUVOLEdBQUcsQ0FBQ007QUFBaEM7QUFGSyxLQURoQixFQUtHSSxJQUxILENBS1EsVUFBQUMsTUFBTSxFQUFJO0FBQ2RULE1BQUFBLE9BQU8sQ0FBQ1MsTUFBRCxDQUFQO0FBQ0QsS0FQSDtBQVFELEdBWk0sQ0FBUDtBQWFEOztBQUNNLFNBQVNDLGFBQVQsQ0FBdUJaLEdBQXZCLEVBQWdFO0FBQ3JFLFNBQU8sSUFBSUMsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FBeUJELFNBQVMsQ0FBQ0MsWUFBbkM7QUFDQSxRQUFJLENBQUNKLEdBQUwsRUFBVUEsR0FBRyxHQUFHO0FBQUVLLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLE1BQU0sRUFBRTtBQUF2QixLQUFOO0FBQ1ZILElBQUFBLFNBQVMsQ0FBQ0ksWUFBVixDQUNHSCxZQURILENBQ2dCO0FBQUVJLE1BQUFBLEtBQUssRUFBRSxJQUFUO0FBQWVDLE1BQUFBLEtBQUssRUFBRTtBQUF0QixLQURoQixFQUVHQyxJQUZILENBRVEsVUFBQUMsTUFBTSxFQUFJO0FBQ2RULE1BQUFBLE9BQU8sQ0FBQ1MsTUFBRCxDQUFQO0FBQ0QsS0FKSDtBQUtELEdBUk0sQ0FBUDtBQVNEOztJQUVXRSxTOzs7V0FBQUEsUztBQUFBQSxFQUFBQSxTLENBQUFBLFM7QUFBQUEsRUFBQUEsUyxDQUFBQSxTO0dBQUFBLFMseUJBQUFBLFM7O0lBS1NDLE07OztBQUduQixrQkFBWUMsSUFBWixFQUEwQmYsR0FBMUIsRUFBNEU7QUFBQTs7QUFBQTs7QUFDMUVBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWI7O0FBQ0EsU0FBS2dCLFFBQUwsR0FBZ0IsVUFBQUMsQ0FBQyxFQUFJLENBQUUsQ0FBdkI7O0FBQ0EsU0FBS0MsSUFBTCxDQUFVSCxJQUFWLEVBQWdCZixHQUFHLENBQUNXLE1BQXBCLEVBQTRCWCxHQUFHLENBQUNtQixJQUFoQztBQUNEOzs7Ozs7O2dEQUVrQkosSSxFQUFjSyxPLEVBQXVCRCxJOzs7Ozs7OzsrQkFFcERDLE87Ozs7Ozs7O3VCQUNPO0FBQUE7QUFBQSx3Q0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0NBQ0ZELElBQUksSUFBS0EsSUFBRCxJQUF1Qk4sU0FBUyxDQUFDSixLQUR2QztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGlDQUVTVixhQUFhLEVBRnRCOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGlDQUlTYSxhQUFhLEVBSnRCOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQUQsSTs7Ozs7O0FBRkhELGdCQUFBQSxNO0FBVU5BLGdCQUFBQSxNQUFNLENBQUNVLFNBQVAsR0FBbUJDLE9BQW5CLENBQTJCLFVBQUFDLEtBQUs7QUFBQSx5QkFBSVIsSUFBSSxDQUFDUyxHQUFMLENBQVNDLFFBQVQsQ0FBa0JGLEtBQWxCLEVBQXlCWixNQUF6QixDQUFKO0FBQUEsaUJBQWhDOztBQUNBSSxnQkFBQUEsSUFBSSxDQUFDUyxHQUFMLENBQVNFLE9BQVQsR0FBbUIsVUFBQ0MsS0FBRCxFQUEwQjtBQUMzQ0Msa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUI7QUFBRUYsb0JBQUFBLEtBQUssRUFBTEE7QUFBRixtQkFBdkI7QUFFQSxzQkFBTWhCLE1BQU0sR0FBR2dCLEtBQUssQ0FBQ0csT0FBTixDQUFjLENBQWQsQ0FBZjs7QUFFQSxrQkFBQSxLQUFJLENBQUNkLFFBQUwsQ0FBY0wsTUFBZDtBQUNELGlCQU5EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdlYlJUQyBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxWaWRlbyhvcHQ/OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG5cbiAgICBpZiAoIW9wdCkgb3B0ID0geyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHtcbiAgICAgICAgYXVkaW86IHRydWUsXG4gICAgICAgIHZpZGVvOiB7IHdpZHRoOiBvcHQud2lkdGgsIGhlaWdodDogb3B0LmhlaWdodCB9XG4gICAgICB9KVxuICAgICAgLnRoZW4oc3RyZWFtID0+IHtcbiAgICAgICAgcmVzb2x2ZShzdHJlYW0pO1xuICAgICAgfSk7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsQXVkaW8ob3B0PzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhO1xuICAgIGlmICghb3B0KSBvcHQgPSB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9O1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSwgdmlkZW86IGZhbHNlIH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBlbnVtIE1lZGlhVHlwZSB7XG4gIHZpZGVvLFxuICBhdWRpb1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xuICBvblN0cmVhbTogKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocGVlcjogV2ViUlRDLCBvcHQ/OiB7IHN0cmVhbT86IE1lZGlhU3RyZWFtOyB0eXBlPzogTWVkaWFUeXBlIH0pIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5vblN0cmVhbSA9IF8gPT4ge307XG4gICAgdGhpcy5pbml0KHBlZXIsIG9wdC5zdHJlYW0sIG9wdC50eXBlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdChwZWVyOiBXZWJSVEMsIF9zdHJlYW0/OiBNZWRpYVN0cmVhbSwgdHlwZT86IE1lZGlhVHlwZSkge1xuICAgIGNvbnN0IHN0cmVhbTogTWVkaWFTdHJlYW0gPVxuICAgICAgX3N0cmVhbSB8fFxuICAgICAgKGF3YWl0IChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlICYmICh0eXBlIGFzIE1lZGlhVHlwZSkgPT0gTWVkaWFUeXBlLnZpZGVvKSB7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldExvY2FsVmlkZW8oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYWxBdWRpbygpO1xuICAgICAgICB9XG4gICAgICB9KSgpKTtcblxuICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHBlZXIucnRjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0pKTtcbiAgICBwZWVyLnJ0Yy5vbnRyYWNrID0gKGV2ZW50OiBSVENUcmFja0V2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIm9udHJhY2tcIiwgeyBldmVudCB9KTtcblxuICAgICAgY29uc3Qgc3RyZWFtID0gZXZlbnQuc3RyZWFtc1swXTtcblxuICAgICAgdGhpcy5vblN0cmVhbShzdHJlYW0pO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==