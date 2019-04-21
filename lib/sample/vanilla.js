"use strict";

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("babel-polyfill");

var peerOffer = new _index["default"]({
  disable_stun: true,
  nodeId: "offer"
});
var peerAnswer = new _index["default"]({
  disable_stun: true,
  nodeId: "answer"
});

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var offer, answer;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          peerOffer.makeOffer();
          _context.next = 3;
          return peerOffer.onSignal.asPromise()["catch"]();

        case 3:
          offer = _context.sent;
          peerAnswer.setSdp(offer);
          _context.next = 7;
          return peerAnswer.onSignal.asPromise()["catch"]();

        case 7:
          answer = _context.sent;
          peerOffer.setSdp(answer);
          peerOffer.onConnect.once(function () {
            console.log("offer connect");
            peerOffer.onData.subscribe(function (raw) {
              console.log("ondata offer", raw);
            });
            peerOffer.send("one", "offer1");
            peerOffer.send("two", "offer2");
          });
          peerAnswer.onConnect.once(function () {
            console.log("answer connect");
            peerAnswer.onData.subscribe(function (raw) {
              console.log("ondata answer", raw);
            });
            peerAnswer.send("one", "answer1");
            peerAnswer.send("two", "answer2");
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYW1wbGUvdmFuaWxsYS50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwicGVlck9mZmVyIiwiV2ViUlRDIiwiZGlzYWJsZV9zdHVuIiwibm9kZUlkIiwicGVlckFuc3dlciIsIm1ha2VPZmZlciIsIm9uU2lnbmFsIiwiYXNQcm9taXNlIiwib2ZmZXIiLCJzZXRTZHAiLCJhbnN3ZXIiLCJvbkNvbm5lY3QiLCJvbmNlIiwiY29uc29sZSIsImxvZyIsIm9uRGF0YSIsInN1YnNjcmliZSIsInJhdyIsInNlbmQiXSwibWFwcGluZ3MiOiI7O0FBQ0E7Ozs7Ozs7O0FBREFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUVBLElBQU1DLFNBQVMsR0FBRyxJQUFJQyxpQkFBSixDQUFXO0FBQUVDLEVBQUFBLFlBQVksRUFBRSxJQUFoQjtBQUFzQkMsRUFBQUEsTUFBTSxFQUFFO0FBQTlCLENBQVgsQ0FBbEI7QUFDQSxJQUFNQyxVQUFVLEdBQUcsSUFBSUgsaUJBQUosQ0FBVztBQUFFQyxFQUFBQSxZQUFZLEVBQUUsSUFBaEI7QUFBc0JDLEVBQUFBLE1BQU0sRUFBRTtBQUE5QixDQUFYLENBQW5COztBQUVBO0FBQUE7QUFBQSx3QkFBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQ0gsVUFBQUEsU0FBUyxDQUFDSyxTQUFWO0FBREQ7QUFBQSxpQkFFcUJMLFNBQVMsQ0FBQ00sUUFBVixDQUFtQkMsU0FBbkIsYUFGckI7O0FBQUE7QUFFT0MsVUFBQUEsS0FGUDtBQUdDSixVQUFBQSxVQUFVLENBQUNLLE1BQVgsQ0FBa0JELEtBQWxCO0FBSEQ7QUFBQSxpQkFJc0JKLFVBQVUsQ0FBQ0UsUUFBWCxDQUFvQkMsU0FBcEIsYUFKdEI7O0FBQUE7QUFJT0csVUFBQUEsTUFKUDtBQUtDVixVQUFBQSxTQUFTLENBQUNTLE1BQVYsQ0FBaUJDLE1BQWpCO0FBRUFWLFVBQUFBLFNBQVMsQ0FBQ1csU0FBVixDQUFvQkMsSUFBcEIsQ0FBeUIsWUFBTTtBQUM3QkMsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWjtBQUNBZCxZQUFBQSxTQUFTLENBQUNlLE1BQVYsQ0FBaUJDLFNBQWpCLENBQTJCLFVBQUFDLEdBQUcsRUFBSTtBQUNoQ0osY0FBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWixFQUE0QkcsR0FBNUI7QUFDRCxhQUZEO0FBR0FqQixZQUFBQSxTQUFTLENBQUNrQixJQUFWLENBQWUsS0FBZixFQUFzQixRQUF0QjtBQUNBbEIsWUFBQUEsU0FBUyxDQUFDa0IsSUFBVixDQUFlLEtBQWYsRUFBc0IsUUFBdEI7QUFDRCxXQVBEO0FBU0FkLFVBQUFBLFVBQVUsQ0FBQ08sU0FBWCxDQUFxQkMsSUFBckIsQ0FBMEIsWUFBTTtBQUM5QkMsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVo7QUFDQVYsWUFBQUEsVUFBVSxDQUFDVyxNQUFYLENBQWtCQyxTQUFsQixDQUE0QixVQUFBQyxHQUFHLEVBQUk7QUFDakNKLGNBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVosRUFBNkJHLEdBQTdCO0FBQ0QsYUFGRDtBQUdBYixZQUFBQSxVQUFVLENBQUNjLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsU0FBdkI7QUFDQWQsWUFBQUEsVUFBVSxDQUFDYyxJQUFYLENBQWdCLEtBQWhCLEVBQXVCLFNBQXZCO0FBQ0QsV0FQRDs7QUFoQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcbmltcG9ydCBXZWJSVEMgZnJvbSBcIi4uL2luZGV4XCI7XG5jb25zdCBwZWVyT2ZmZXIgPSBuZXcgV2ViUlRDKHsgZGlzYWJsZV9zdHVuOiB0cnVlLCBub2RlSWQ6IFwib2ZmZXJcIiB9KTtcbmNvbnN0IHBlZXJBbnN3ZXIgPSBuZXcgV2ViUlRDKHsgZGlzYWJsZV9zdHVuOiB0cnVlLCBub2RlSWQ6IFwiYW5zd2VyXCIgfSk7XG5cbihhc3luYyAoKSA9PiB7XG4gIHBlZXJPZmZlci5tYWtlT2ZmZXIoKTtcbiAgY29uc3Qgb2ZmZXIgPSBhd2FpdCBwZWVyT2ZmZXIub25TaWduYWwuYXNQcm9taXNlKCkuY2F0Y2goKTtcbiAgcGVlckFuc3dlci5zZXRTZHAob2ZmZXIpO1xuICBjb25zdCBhbnN3ZXIgPSBhd2FpdCBwZWVyQW5zd2VyLm9uU2lnbmFsLmFzUHJvbWlzZSgpLmNhdGNoKCk7XG4gIHBlZXJPZmZlci5zZXRTZHAoYW5zd2VyKTtcblxuICBwZWVyT2ZmZXIub25Db25uZWN0Lm9uY2UoKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwib2ZmZXIgY29ubmVjdFwiKTtcbiAgICBwZWVyT2ZmZXIub25EYXRhLnN1YnNjcmliZShyYXcgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJvbmRhdGEgb2ZmZXJcIiwgcmF3KTtcbiAgICB9KTtcbiAgICBwZWVyT2ZmZXIuc2VuZChcIm9uZVwiLCBcIm9mZmVyMVwiKTtcbiAgICBwZWVyT2ZmZXIuc2VuZChcInR3b1wiLCBcIm9mZmVyMlwiKTtcbiAgfSk7XG5cbiAgcGVlckFuc3dlci5vbkNvbm5lY3Qub25jZSgoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJhbnN3ZXIgY29ubmVjdFwiKTtcbiAgICBwZWVyQW5zd2VyLm9uRGF0YS5zdWJzY3JpYmUocmF3ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwib25kYXRhIGFuc3dlclwiLCByYXcpO1xuICAgIH0pO1xuICAgIHBlZXJBbnN3ZXIuc2VuZChcIm9uZVwiLCBcImFuc3dlcjFcIik7XG4gICAgcGVlckFuc3dlci5zZW5kKFwidHdvXCIsIFwiYW5zd2VyMlwiKTtcbiAgfSk7XG59KSgpO1xuIl19