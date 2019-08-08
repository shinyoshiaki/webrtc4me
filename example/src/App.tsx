import React, { useState, useRef, FC } from "react";
import { create, join } from "./webrtc/signaling";
import WebRTC, { getLocalVideo } from "../../src";
import FileShareExample from "./components/fileshare";
import RadioBox from "./components/radiobox";
import TextShare from "./components/textshare";
import NewFileApi from "./components/newfileapi";
import Event from "rx.mini";
import Videos from "./components/videos";
import ScreenShare from "./components/screenshare";
import useInput from "./hooks/useInput";

const App: FC = () => {
  const [roomId, setRoomId, clear] = useInput();
  const [roomLabel, setRoomLabel] = useState("");
  const [trickle, setTrickle] = useState(false);
  const [stun, setstun] = useState(true);
  const [rtc, setRTC] = useState<WebRTC | undefined>(undefined);
  const event = useRef({ stream: new Event<MediaStream>() });

  const createRoom = async () => {
    setRoomLabel("room:" + roomId + " create");
    clear();
    const rtc = await create(roomId, trickle, stun);
    setRTC(rtc);
    loadStream(rtc);
  };

  const joinRoom = async () => {
    setRoomLabel("room:" + roomId + " join");
    clear();
    const rtc = await join(roomId, trickle, stun);
    setRTC(rtc);
    loadStream(rtc);
  };

  const loadStream = async (peer: WebRTC) => {
    const local = await getLocalVideo();
    peer.onAddTrack.subscribe(stream => {
      event.current.stream.execute(stream);

      if (!peer.isOffer) {
        peer.addStream(local);
      }
    });

    if (peer.isOffer) {
      peer.addStream(local);
    }
  };

  return (
    <div>
      <p>webrtc{rtc && " connected"}</p>
      <div>
        trickle{trickle && " *"}
        <br />
        <RadioBox onChange={setTrickle} />
      </div>
      <br />
      <div>
        stun{stun && " *"}
        <br />
        <RadioBox onChange={setstun} initial={stun} />
      </div>
      <br />
      <input onChange={setRoomId} placeholder="roomId" value={roomId} />
      <button onClick={createRoom}>create</button>
      <button onClick={joinRoom}>join</button>
      <br />
      <p>{roomLabel}</p>

      <div style={{ width: "90vw" }}>
        <Videos streamEvent={event.current.stream} />
        <TextShare peer={rtc} />
        <FileShareExample peer={rtc} />
        <NewFileApi peer={rtc} />
        <ScreenShare peer={rtc} />
      </div>
    </div>
  );
};

export default App;
