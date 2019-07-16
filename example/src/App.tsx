import React, { useState, useRef, useEffect, FC } from "react";
import { create, join } from "./webrtc/signaling";
import WebRTC, { getLocalVideo } from "../../src";
import FileShareExample from "./components/fileshare";
import NewFileApi from "./components/newfileapi";
import RadioBox from "./components/radiobox";

const App: FC = () => {
  const [roomId, setRoomId] = useState("");
  const [roomLabel, setRoomLabel] = useState("");
  const [text, setText] = useState("");
  const [trickle, setTrickle] = useState(false);
  const [stun, setstun] = useState(true);
  const [rtc, setRTC] = useState<WebRTC | undefined>(undefined);
  const videoRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    if (rtc) {
      rtc.onData.subscribe(raw => {
        if (raw.label === "share") setText(raw.data);
      });
    }
  }, [rtc]);

  const loadStream = async (peer: WebRTC) => {
    const local = await getLocalVideo();
    peer.onAddTrack.subscribe(stream => {
      if (videoRef) {
        videoRef.current.srcObject = stream;
      }

      if (!peer.isOffer) {
        peer.addTrack(local.getVideoTracks()[0], local);
      }
    });

    if (peer.isOffer) {
      peer.addTrack(local.getVideoTracks()[0], local);
    }
  };

  return (
    <div>
      <p>webrtc</p>
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
      <input
        onChange={e => {
          setRoomId(e.target.value);
        }}
        placeholder="roomId"
        value={roomId}
      />
      <button
        onClick={async () => {
          console.log("create");
          setRoomLabel("room:" + roomId + " create");
          setRoomId("");
          const rtc = await create(roomId, trickle, stun);
          setRTC(rtc);
          loadStream(rtc);
        }}
      >
        create
      </button>
      <button
        onClick={async () => {
          console.log("join");
          setRoomLabel("room:" + roomId + " join");
          setRoomId("");
          const rtc = await join(roomId, trickle, stun);
          setRTC(rtc);
          loadStream(rtc);
        }}
      >
        join
      </button>
      <br />
      <p>{roomLabel}</p>
      <video
        ref={videoRef}
        autoPlay={true}
        style={{ width: "300", height: "400" }}
      />
      <p>datachannel</p>
      <input
        value={text}
        onChange={e => {
          setText(e.target.value);
          if (rtc) rtc.send(e.target.value, "share");
        }}
        style={{ width: "40vw" }}
      />
      <div style={{ marginTop: 50 }}>
        <FileShareExample peer={rtc} />
      </div>
      {rtc && <NewFileApi peer={rtc} />}
    </div>
  );
};

export default App;
