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
          item.func(data, item.id);
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
  }]);

  return Event;
}();

exports.default = Event;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXZlbnQudHMiXSwibmFtZXMiOlsiRXZlbnQiLCJldmVudCIsInN0YWNrIiwiaW5kZXgiLCJkYXRhIiwiaXRlbSIsImZ1bmMiLCJpZCIsInB1c2giLCJ1blN1YnNjcmliZSIsImZpbHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBT3FCQSxLOzs7QUFHbkIsbUJBQWM7QUFBQTs7QUFBQTs7QUFDWixTQUFLQyxLQUFMLEdBQWE7QUFDWEMsTUFBQUEsS0FBSyxFQUFFLEVBREk7QUFFWEMsTUFBQUEsS0FBSyxFQUFFO0FBRkksS0FBYjtBQUlEOzs7OzJCQUVNQyxJLEVBQVM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDZCw2QkFBaUIsS0FBS0gsS0FBTCxDQUFXQyxLQUE1Qiw4SEFBbUM7QUFBQSxjQUExQkcsSUFBMEI7QUFDakNBLFVBQUFBLElBQUksQ0FBQ0MsSUFBTCxDQUFVRixJQUFWLEVBQWdCQyxJQUFJLENBQUNFLEVBQXJCO0FBQ0Q7QUFIYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWY7Ozs4QkFFU0QsSSxFQUFvQjtBQUFBOztBQUM1QixVQUFNQyxFQUFFLEdBQUcsS0FBS04sS0FBTCxDQUFXRSxLQUF0QjtBQUNBLFdBQUtGLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQk0sSUFBakIsQ0FBc0I7QUFBRUYsUUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFDLFFBQUFBLEVBQUUsRUFBRkE7QUFBUixPQUF0QjtBQUNBLFdBQUtOLEtBQUwsQ0FBV0UsS0FBWDs7QUFDQSxVQUFNTSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFNO0FBQ3hCLFFBQUEsS0FBSSxDQUFDUixLQUFMLENBQVdDLEtBQVgsR0FBbUIsS0FBSSxDQUFDRCxLQUFMLENBQVdDLEtBQVgsQ0FBaUJRLE1BQWpCLENBQ2pCLFVBQUFMLElBQUk7QUFBQSxpQkFBSUEsSUFBSSxDQUFDRSxFQUFMLEtBQVlBLEVBQVosSUFBa0JGLElBQXRCO0FBQUEsU0FEYSxDQUFuQjtBQUdELE9BSkQ7O0FBS0EsYUFBTztBQUFFSSxRQUFBQSxXQUFXLEVBQVhBO0FBQUYsT0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBFdmVudEZ1bmM8VD4gPSAoZGF0YTogVCwgaWQ6IG51bWJlcikgPT4gdm9pZDtcblxuaW50ZXJmYWNlIElFdmVudDxUPiB7XG4gIHN0YWNrOiB7IGZ1bmM6IEV2ZW50RnVuYzxUPjsgaWQ6IG51bWJlciB9W107XG4gIGluZGV4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50PFQ+IHtcbiAgZXZlbnQ6IElFdmVudDxUPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmV2ZW50ID0ge1xuICAgICAgc3RhY2s6IFtdLFxuICAgICAgaW5kZXg6IDBcbiAgICB9O1xuICB9XG5cbiAgZXhjdXRlKGRhdGE6IFQpIHtcbiAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuZXZlbnQuc3RhY2spIHtcbiAgICAgIGl0ZW0uZnVuYyhkYXRhLCBpdGVtLmlkKTtcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmUoZnVuYzogRXZlbnRGdW5jPFQ+KSB7XG4gICAgY29uc3QgaWQgPSB0aGlzLmV2ZW50LmluZGV4O1xuICAgIHRoaXMuZXZlbnQuc3RhY2sucHVzaCh7IGZ1bmMsIGlkIH0pO1xuICAgIHRoaXMuZXZlbnQuaW5kZXgrKztcbiAgICBjb25zdCB1blN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZXZlbnQuc3RhY2sgPSB0aGlzLmV2ZW50LnN0YWNrLmZpbHRlcihcbiAgICAgICAgaXRlbSA9PiBpdGVtLmlkICE9PSBpZCAmJiBpdGVtXG4gICAgICApO1xuICAgIH07XG4gICAgcmV0dXJuIHsgdW5TdWJzY3JpYmUgfTtcbiAgfVxufVxuIl19