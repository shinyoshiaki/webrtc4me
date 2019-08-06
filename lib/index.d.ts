import WebRTC, { Signal, Message } from "./core";
import Stream from "./modules/stream";
import FileShare from "./modules/file";
import { getLocalVideo } from "./utill/media";
import { blob2Arraybuffer } from "./utill/arraybuffer";
import SendFile from "./modules/filequick";
export default WebRTC;
export { Stream, FileShare, getLocalVideo, blob2Arraybuffer, Signal, Message, SendFile };
