export function getLocalVideo(option?: MediaTrackSettings) {
  return new Promise<MediaStream>((r) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: option || true,
      })
      .then((stream) => r(stream));
  });
}

export function getLocalAudio() {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        resolve(stream);
      });
  });
}

export function getLocalDesktop(option?: MediaTrackSettings) {
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    (navigator.mediaDevices as any)
      .getDisplayMedia({
        video: option || true,
      })
      .then((stream: any) => {
        resolve(stream);
      });
  });
}
