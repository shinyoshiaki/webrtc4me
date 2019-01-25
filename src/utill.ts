interface option {
  width: number;
  height: number;
}

const defaultOption = { width: 1280, height: 720 };

export function getLocalVideo(option: Partial<option> = {}) {
  const opt = { ...defaultOption, ...option };
  return new Promise<MediaStream>((resolve: (v: MediaStream) => void) => {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: opt.width, height: opt.height }
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
