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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ldmVudC50cyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50Iiwic3RhY2siLCJpbmRleCIsImRhdGEiLCJpdGVtIiwiZnVuYyIsImlkIiwicHVzaCIsInVuU3Vic2NyaWJlIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFPcUJBLEs7OztBQUduQixtQkFBYztBQUFBOztBQUFBOztBQUNaLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxLQUFLLEVBQUUsRUFESTtBQUVYQyxNQUFBQSxLQUFLLEVBQUU7QUFGSSxLQUFiO0FBSUQ7Ozs7MkJBRU1DLEksRUFBUztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNkLDZCQUFpQixLQUFLSCxLQUFMLENBQVdDLEtBQTVCLDhIQUFtQztBQUFBLGNBQTFCRyxJQUEwQjtBQUNqQ0EsVUFBQUEsSUFBSSxDQUFDQyxJQUFMLENBQVVGLElBQVYsRUFBZ0JDLElBQUksQ0FBQ0UsRUFBckI7QUFDRDtBQUhhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJZjs7OzhCQUVTRCxJLEVBQW9CO0FBQUE7O0FBQzVCLFVBQU1DLEVBQUUsR0FBRyxLQUFLTixLQUFMLENBQVdFLEtBQXRCO0FBQ0EsV0FBS0YsS0FBTCxDQUFXQyxLQUFYLENBQWlCTSxJQUFqQixDQUFzQjtBQUFFRixRQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUMsUUFBQUEsRUFBRSxFQUFGQTtBQUFSLE9BQXRCO0FBQ0EsV0FBS04sS0FBTCxDQUFXRSxLQUFYOztBQUNBLFVBQU1NLFdBQVcsR0FBRyxTQUFkQSxXQUFjLEdBQU07QUFDeEIsUUFBQSxLQUFJLENBQUNSLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixLQUFJLENBQUNELEtBQUwsQ0FBV0MsS0FBWCxDQUFpQlEsTUFBakIsQ0FDakIsVUFBQUwsSUFBSTtBQUFBLGlCQUFJQSxJQUFJLENBQUNFLEVBQUwsS0FBWUEsRUFBWixJQUFrQkYsSUFBdEI7QUFBQSxTQURhLENBQW5CO0FBR0QsT0FKRDs7QUFLQSxhQUFPO0FBQUVJLFFBQUFBLFdBQVcsRUFBWEE7QUFBRixPQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIEV2ZW50RnVuYzxUPiA9IChkYXRhOiBULCBpZDogbnVtYmVyKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgSUV2ZW50PFQ+IHtcbiAgc3RhY2s6IHsgZnVuYzogRXZlbnRGdW5jPFQ+OyBpZDogbnVtYmVyIH1bXTtcbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnQ8VD4ge1xuICBldmVudDogSUV2ZW50PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZXZlbnQgPSB7XG4gICAgICBzdGFjazogW10sXG4gICAgICBpbmRleDogMFxuICAgIH07XG4gIH1cblxuICBleGN1dGUoZGF0YTogVCkge1xuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5ldmVudC5zdGFjaykge1xuICAgICAgaXRlbS5mdW5jKGRhdGEsIGl0ZW0uaWQpO1xuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZShmdW5jOiBFdmVudEZ1bmM8VD4pIHtcbiAgICBjb25zdCBpZCA9IHRoaXMuZXZlbnQuaW5kZXg7XG4gICAgdGhpcy5ldmVudC5zdGFjay5wdXNoKHsgZnVuYywgaWQgfSk7XG4gICAgdGhpcy5ldmVudC5pbmRleCsrO1xuICAgIGNvbnN0IHVuU3Vic2NyaWJlID0gKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC5zdGFjayA9IHRoaXMuZXZlbnQuc3RhY2suZmlsdGVyKFxuICAgICAgICBpdGVtID0+IGl0ZW0uaWQgIT09IGlkICYmIGl0ZW1cbiAgICAgICk7XG4gICAgfTtcbiAgICByZXR1cm4geyB1blN1YnNjcmliZSB9O1xuICB9XG59XG4iXX0=