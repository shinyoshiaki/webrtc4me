"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Stream", {
  enumerable: true,
  get: function get() {
    return _stream.default;
  }
});
Object.defineProperty(exports, "FileShare", {
  enumerable: true,
  get: function get() {
    return _file.default;
  }
});
exports.Utill = exports.default = void 0;

var _core = _interopRequireDefault(require("./core"));

var _stream = _interopRequireDefault(require("./modules/stream"));

var _file = _interopRequireDefault(require("./modules/file"));

var Utill = _interopRequireWildcard(require("./utill/media"));

exports.Utill = Utill;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var _default = _core.default;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiV2ViUlRDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBTEFBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztlQU9lQyxhIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG5pbXBvcnQgV2ViUlRDIGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vbW9kdWxlcy9zdHJlYW1cIjtcbmltcG9ydCBGaWxlU2hhcmUgZnJvbSBcIi4vbW9kdWxlcy9maWxlXCI7XG5pbXBvcnQgKiBhcyBVdGlsbCBmcm9tIFwiLi91dGlsbC9tZWRpYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBXZWJSVEM7XG5cbmV4cG9ydCB7IFN0cmVhbSwgVXRpbGwsIEZpbGVTaGFyZSB9O1xuIl19