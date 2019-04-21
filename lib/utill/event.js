"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Event =
/*#__PURE__*/
function () {
  function Event() {
    var _this = this;

    _classCallCheck(this, Event);

    _defineProperty(this, "event", void 0);

    _defineProperty(this, "asPromise", function (timelimit) {
      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
          reject();
        }, timelimit);

        _this.once(function (data) {
          clearTimeout(timeout);
          resolve(data);
        });
      });
    });

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
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
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
      var _this2 = this;

      var id = this.event.index;
      this.event.stack.push({
        func: func,
        id: id
      });
      this.event.index++;

      var unSubscribe = function unSubscribe() {
        _this2.event.stack = _this2.event.stack.filter(function (item) {
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

exports["default"] = Event;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsbC9ldmVudC50cyJdLCJuYW1lcyI6WyJFdmVudCIsInRpbWVsaW1pdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidGltZW91dCIsInNldFRpbWVvdXQiLCJvbmNlIiwiZGF0YSIsImNsZWFyVGltZW91dCIsImV2ZW50Iiwic3RhY2siLCJpbmRleCIsIml0ZW0iLCJmdW5jIiwidW5kZWZpbmVkIiwiaWQiLCJwdXNoIiwidW5TdWJzY3JpYmUiLCJmaWx0ZXIiLCJvZmYiLCJzdWJzY3JpYmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQU9xQkEsSzs7O0FBR25CLG1CQUFjO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsdUNBaUNGLFVBQUNDLFNBQUQ7QUFBQSxhQUNWLElBQUlDLE9BQUosQ0FBZSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDbEMsWUFBTUMsT0FBTyxHQUFHQyxVQUFVLENBQUMsWUFBTTtBQUMvQkYsVUFBQUEsTUFBTTtBQUNQLFNBRnlCLEVBRXZCSCxTQUZ1QixDQUExQjs7QUFHQSxRQUFBLEtBQUksQ0FBQ00sSUFBTCxDQUFVLFVBQUFDLElBQUksRUFBSTtBQUNoQkMsVUFBQUEsWUFBWSxDQUFDSixPQUFELENBQVo7QUFDQUYsVUFBQUEsT0FBTyxDQUFDSyxJQUFELENBQVA7QUFDRCxTQUhEO0FBSUQsT0FSRCxDQURVO0FBQUEsS0FqQ0U7O0FBQ1osU0FBS0UsS0FBTCxHQUFhO0FBQ1hDLE1BQUFBLEtBQUssRUFBRSxFQURJO0FBRVhDLE1BQUFBLEtBQUssRUFBRTtBQUZJLEtBQWI7QUFJRDs7OzsyQkFFTUosSSxFQUFVO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2YsNkJBQWlCLEtBQUtFLEtBQUwsQ0FBV0MsS0FBNUIsOEhBQW1DO0FBQUEsY0FBMUJFLElBQTBCO0FBQ2pDLGNBQUlMLElBQUosRUFBVUssSUFBSSxDQUFDQyxJQUFMLENBQVVOLElBQVYsRUFBVixLQUNLSyxJQUFJLENBQUNDLElBQUwsQ0FBVUMsU0FBVjtBQUNOO0FBSmM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtoQjs7OzhCQUVTRCxJLEVBQW9CO0FBQUE7O0FBQzVCLFVBQU1FLEVBQUUsR0FBRyxLQUFLTixLQUFMLENBQVdFLEtBQXRCO0FBQ0EsV0FBS0YsS0FBTCxDQUFXQyxLQUFYLENBQWlCTSxJQUFqQixDQUFzQjtBQUFFSCxRQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUUsUUFBQUEsRUFBRSxFQUFGQTtBQUFSLE9BQXRCO0FBQ0EsV0FBS04sS0FBTCxDQUFXRSxLQUFYOztBQUNBLFVBQU1NLFdBQVcsR0FBRyxTQUFkQSxXQUFjLEdBQU07QUFDeEIsUUFBQSxNQUFJLENBQUNSLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixNQUFJLENBQUNELEtBQUwsQ0FBV0MsS0FBWCxDQUFpQlEsTUFBakIsQ0FDakIsVUFBQU4sSUFBSTtBQUFBLGlCQUFJQSxJQUFJLENBQUNHLEVBQUwsS0FBWUEsRUFBWixJQUFrQkgsSUFBdEI7QUFBQSxTQURhLENBQW5CO0FBR0QsT0FKRDs7QUFLQSxhQUFPO0FBQUVLLFFBQUFBLFdBQVcsRUFBWEE7QUFBRixPQUFQO0FBQ0Q7Ozt5QkFFSUosSSxFQUFvQjtBQUN2QixVQUFNTSxHQUFHLEdBQUcsS0FBS0MsU0FBTCxDQUFlLFVBQUFiLElBQUksRUFBSTtBQUNqQ1ksUUFBQUEsR0FBRyxDQUFDRixXQUFKO0FBQ0FKLFFBQUFBLElBQUksQ0FBQ04sSUFBRCxDQUFKO0FBQ0QsT0FIVyxDQUFaO0FBSUQiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIEV2ZW50RnVuYzxUPiA9IChkYXRhOiBUKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgSUV2ZW50PFQ+IHtcbiAgc3RhY2s6IHsgZnVuYzogRXZlbnRGdW5jPFQ+OyBpZDogbnVtYmVyIH1bXTtcbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnQ8VD4ge1xuICBwcml2YXRlIGV2ZW50OiBJRXZlbnQ8VD47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ldmVudCA9IHtcbiAgICAgIHN0YWNrOiBbXSxcbiAgICAgIGluZGV4OiAwXG4gICAgfTtcbiAgfVxuXG4gIGV4Y3V0ZShkYXRhPzogVCkge1xuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5ldmVudC5zdGFjaykge1xuICAgICAgaWYgKGRhdGEpIGl0ZW0uZnVuYyhkYXRhKTtcbiAgICAgIGVsc2UgaXRlbS5mdW5jKHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZShmdW5jOiBFdmVudEZ1bmM8VD4pIHtcbiAgICBjb25zdCBpZCA9IHRoaXMuZXZlbnQuaW5kZXg7XG4gICAgdGhpcy5ldmVudC5zdGFjay5wdXNoKHsgZnVuYywgaWQgfSk7XG4gICAgdGhpcy5ldmVudC5pbmRleCsrO1xuICAgIGNvbnN0IHVuU3Vic2NyaWJlID0gKCkgPT4ge1xuICAgICAgdGhpcy5ldmVudC5zdGFjayA9IHRoaXMuZXZlbnQuc3RhY2suZmlsdGVyKFxuICAgICAgICBpdGVtID0+IGl0ZW0uaWQgIT09IGlkICYmIGl0ZW1cbiAgICAgICk7XG4gICAgfTtcbiAgICByZXR1cm4geyB1blN1YnNjcmliZSB9O1xuICB9XG5cbiAgb25jZShmdW5jOiBFdmVudEZ1bmM8VD4pIHtcbiAgICBjb25zdCBvZmYgPSB0aGlzLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgIG9mZi51blN1YnNjcmliZSgpO1xuICAgICAgZnVuYyhkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzUHJvbWlzZSA9ICh0aW1lbGltaXQ/OiBudW1iZXIpID0+XG4gICAgbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZWplY3QoKTtcbiAgICAgIH0sIHRpbWVsaW1pdCk7XG4gICAgICB0aGlzLm9uY2UoZGF0YSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xufVxuIl19