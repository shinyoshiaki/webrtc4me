"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Event =
/*#__PURE__*/
function () {
  function Event() {
    _classCallCheck(this, Event);

    _defineProperty(this, "event", void 0);

    this.event = {
      stack: [],
      index: 0
    };
  }

  _createClass(Event, [{
    key: "excute",
    value: function excute(data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.event.stack[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          if (data) item.func(data);else item.func(undefined);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(func) {
      var _this = this;

      var id = this.event.index;
      this.event.stack.push({
        func: func,
        id: id
      });
      this.event.index++;

      var unSubscribe = function unSubscribe() {
        _this.event.stack = _this.event.stack.filter(function (item) {
          return item.id !== id && item;
        });
      };

      return {
        unSubscribe: unSubscribe
      };
    }
  }, {
    key: "once",
    value: function once(func) {
      var off = this.subscribe(function (data) {
        off.unSubscribe();
        func(data);
      });
    }
  }]);

  return Event;
}();

exports.default = Event;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsbC9ldmVudC50cyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50Iiwic3RhY2siLCJpbmRleCIsImRhdGEiLCJpdGVtIiwiZnVuYyIsInVuZGVmaW5lZCIsImlkIiwicHVzaCIsInVuU3Vic2NyaWJlIiwiZmlsdGVyIiwib2ZmIiwic3Vic2NyaWJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFPcUJBLEs7OztBQUduQixtQkFBYztBQUFBOztBQUFBOztBQUNaLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxLQUFLLEVBQUUsRUFESTtBQUVYQyxNQUFBQSxLQUFLLEVBQUU7QUFGSSxLQUFiO0FBSUQ7Ozs7MkJBRU1DLEksRUFBVTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNmLDZCQUFpQixLQUFLSCxLQUFMLENBQVdDLEtBQTVCLDhIQUFtQztBQUFBLGNBQTFCRyxJQUEwQjtBQUNqQyxjQUFJRCxJQUFKLEVBQVVDLElBQUksQ0FBQ0MsSUFBTCxDQUFVRixJQUFWLEVBQVYsS0FDS0MsSUFBSSxDQUFDQyxJQUFMLENBQVVDLFNBQVY7QUFDTjtBQUpjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLaEI7Ozs4QkFFU0QsSSxFQUFvQjtBQUFBOztBQUM1QixVQUFNRSxFQUFFLEdBQUcsS0FBS1AsS0FBTCxDQUFXRSxLQUF0QjtBQUNBLFdBQUtGLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBRUgsUUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFFLFFBQUFBLEVBQUUsRUFBRkE7QUFBUixPQUF0QjtBQUNBLFdBQUtQLEtBQUwsQ0FBV0UsS0FBWDs7QUFDQSxVQUFNTyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFNO0FBQ3hCLFFBQUEsS0FBSSxDQUFDVCxLQUFMLENBQVdDLEtBQVgsR0FBbUIsS0FBSSxDQUFDRCxLQUFMLENBQVdDLEtBQVgsQ0FBaUJTLE1BQWpCLENBQ2pCLFVBQUFOLElBQUk7QUFBQSxpQkFBSUEsSUFBSSxDQUFDRyxFQUFMLEtBQVlBLEVBQVosSUFBa0JILElBQXRCO0FBQUEsU0FEYSxDQUFuQjtBQUdELE9BSkQ7O0FBS0EsYUFBTztBQUFFSyxRQUFBQSxXQUFXLEVBQVhBO0FBQUYsT0FBUDtBQUNEOzs7eUJBRUlKLEksRUFBb0I7QUFDdkIsVUFBTU0sR0FBRyxHQUFHLEtBQUtDLFNBQUwsQ0FBZSxVQUFBVCxJQUFJLEVBQUk7QUFDakNRLFFBQUFBLEdBQUcsQ0FBQ0YsV0FBSjtBQUNBSixRQUFBQSxJQUFJLENBQUNGLElBQUQsQ0FBSjtBQUNELE9BSFcsQ0FBWjtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBFdmVudEZ1bmM8VD4gPSAoZGF0YTogVCkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIElFdmVudDxUPiB7XG4gIHN0YWNrOiB7IGZ1bmM6IEV2ZW50RnVuYzxUPjsgaWQ6IG51bWJlciB9W107XG4gIGluZGV4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50PFQ+IHtcbiAgcHJpdmF0ZSBldmVudDogSUV2ZW50PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZXZlbnQgPSB7XG4gICAgICBzdGFjazogW10sXG4gICAgICBpbmRleDogMFxuICAgIH07XG4gIH1cblxuICBleGN1dGUoZGF0YT86IFQpIHtcbiAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuZXZlbnQuc3RhY2spIHtcbiAgICAgIGlmIChkYXRhKSBpdGVtLmZ1bmMoZGF0YSk7XG4gICAgICBlbHNlIGl0ZW0uZnVuYyh1bmRlZmluZWQgYXMgYW55KTtcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmUoZnVuYzogRXZlbnRGdW5jPFQ+KSB7XG4gICAgY29uc3QgaWQgPSB0aGlzLmV2ZW50LmluZGV4O1xuICAgIHRoaXMuZXZlbnQuc3RhY2sucHVzaCh7IGZ1bmMsIGlkIH0pO1xuICAgIHRoaXMuZXZlbnQuaW5kZXgrKztcbiAgICBjb25zdCB1blN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQuc3RhY2sgPSB0aGlzLmV2ZW50LnN0YWNrLmZpbHRlcihcbiAgICAgICAgaXRlbSA9PiBpdGVtLmlkICE9PSBpZCAmJiBpdGVtXG4gICAgICApO1xuICAgIH07XG4gICAgcmV0dXJuIHsgdW5TdWJzY3JpYmUgfTtcbiAgfVxuXG4gIG9uY2UoZnVuYzogRXZlbnRGdW5jPFQ+KSB7XG4gICAgY29uc3Qgb2ZmID0gdGhpcy5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICBvZmYudW5TdWJzY3JpYmUoKTtcbiAgICAgIGZ1bmMoZGF0YSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==