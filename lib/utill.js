"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalVideo = getLocalVideo;
exports.getLocalAudio = getLocalAudio;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOption = {
  width: 1280,
  height: 720
};

function getLocalVideo() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var opt = _objectSpread({}, defaultOption, option);

  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia;
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

function getLocalAudio() {
  return new Promise(function (resolve) {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(function (stream) {
      resolve(stream);
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsbC50cyJdLCJuYW1lcyI6WyJkZWZhdWx0T3B0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRMb2NhbFZpZGVvIiwib3B0aW9uIiwib3B0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJtZWRpYURldmljZXMiLCJhdWRpbyIsInZpZGVvIiwidGhlbiIsInN0cmVhbSIsImdldExvY2FsQXVkaW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBLElBQU1BLGFBQWEsR0FBRztBQUFFQyxFQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxFQUFBQSxNQUFNLEVBQUU7QUFBdkIsQ0FBdEI7O0FBRU8sU0FBU0MsYUFBVCxHQUFxRDtBQUFBLE1BQTlCQyxNQUE4Qix1RUFBSixFQUFJOztBQUMxRCxNQUFNQyxHQUFHLHFCQUFRTCxhQUFSLEVBQTBCSSxNQUExQixDQUFUOztBQUNBLFNBQU8sSUFBSUUsT0FBSixDQUF5QixVQUFDQyxPQUFELEVBQXVDO0FBQ3JFQyxJQUFBQSxTQUFTLENBQUNDLFlBQVYsR0FBeUJELFNBQVMsQ0FBQ0MsWUFBbkM7QUFDQUQsSUFBQUEsU0FBUyxDQUFDRSxZQUFWLENBQ0dELFlBREgsQ0FDZ0I7QUFDWkUsTUFBQUEsS0FBSyxFQUFFLElBREs7QUFFWkMsTUFBQUEsS0FBSyxFQUFFO0FBQUVYLFFBQUFBLEtBQUssRUFBRUksR0FBRyxDQUFDSixLQUFiO0FBQW9CQyxRQUFBQSxNQUFNLEVBQUVHLEdBQUcsQ0FBQ0g7QUFBaEM7QUFGSyxLQURoQixFQUtHVyxJQUxILENBS1EsVUFBQUMsTUFBTSxFQUFJO0FBQ2RQLE1BQUFBLE9BQU8sQ0FBQ08sTUFBRCxDQUFQO0FBQ0QsS0FQSDtBQVFELEdBVk0sQ0FBUDtBQVdEOztBQUVNLFNBQVNDLGFBQVQsR0FBeUI7QUFDOUIsU0FBTyxJQUFJVCxPQUFKLENBQXlCLFVBQUNDLE9BQUQsRUFBdUM7QUFDckVDLElBQUFBLFNBQVMsQ0FBQ0MsWUFBVixHQUF5QkQsU0FBUyxDQUFDQyxZQUFuQztBQUNBRCxJQUFBQSxTQUFTLENBQUNFLFlBQVYsQ0FDR0QsWUFESCxDQUNnQjtBQUFFRSxNQUFBQSxLQUFLLEVBQUUsSUFBVDtBQUFlQyxNQUFBQSxLQUFLLEVBQUU7QUFBdEIsS0FEaEIsRUFFR0MsSUFGSCxDQUVRLFVBQUFDLE1BQU0sRUFBSTtBQUNkUCxNQUFBQSxPQUFPLENBQUNPLE1BQUQsQ0FBUDtBQUNELEtBSkg7QUFLRCxHQVBNLENBQVA7QUFRRCIsInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBvcHRpb24ge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbiA9IHsgd2lkdGg6IDEyODAsIGhlaWdodDogNzIwIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFZpZGVvKG9wdGlvbjogUGFydGlhbDxvcHRpb24+ID0ge30pIHtcbiAgY29uc3Qgb3B0ID0geyAuLi5kZWZhdWx0T3B0aW9uLCAuLi5vcHRpb24gfTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE1lZGlhU3RyZWFtPigocmVzb2x2ZTogKHY6IE1lZGlhU3RyZWFtKSA9PiB2b2lkKSA9PiB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmdldFVzZXJNZWRpYSh7XG4gICAgICAgIGF1ZGlvOiB0cnVlLFxuICAgICAgICB2aWRlbzogeyB3aWR0aDogb3B0LndpZHRoLCBoZWlnaHQ6IG9wdC5oZWlnaHQgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKHN0cmVhbSA9PiB7XG4gICAgICAgIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsQXVkaW8oKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxNZWRpYVN0cmVhbT4oKHJlc29sdmU6ICh2OiBNZWRpYVN0cmVhbSkgPT4gdm9pZCkgPT4ge1xuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhO1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSwgdmlkZW86IGZhbHNlIH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICByZXNvbHZlKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgfSk7XG59XG4iXX0=