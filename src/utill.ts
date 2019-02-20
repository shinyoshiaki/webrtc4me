export function getLocalVideo(option?: MediaTrackSettings) {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: option || true
      })
      .then(stream => {
        resolve(stream);
      });
  });
}

export function getLocalAudio() {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        resolve(stream);
      });
  });
}

export function getLocalDesktop(option?: MediaTrackSettings) {
  console.log("display");
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator
      .getDisplayMedia({
        video: option || true
      })
      .then((stream: any) => {
        resolve(stream);
      });
  });
}
