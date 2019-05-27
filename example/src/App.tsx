import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { create, join } from "./webrtc/signaling";
import { TextField } from "@material-ui/core";
import WebRTC from "./w4me";
import { getLocalVideo } from "./w4me/utill/media";

const App: FunctionComponent = () => {
  const [roomId, setRoomId] = useState("");
  const [roomLabel, setRoomLabel] = useState("");
  const [trickle, setTrickle] = useState(false);
  const [rtc, setRTC] = useState<WebRTC | undefined>(undefined);
  const [text, setText] = useState("");
  const videoRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    if (rtc) {
      rtc.onData.subscribe(raw => {
        if (raw.label === "share") setText(raw.data);
      });
    }
  }, [rtc]);

  const loadStream = async (peer: WebRTC) => {
    peer.onAddTrack.subscribe(stream => {
      if (videoRef) {
        videoRef.current.srcObject = stream;
      }
    });
    const stream = await getLocalVideo();
    if (peer.isOffer) {
      peer.addTrack(stream.getVideoTracks()[0], stream);
    } else {
      setTimeout(() => {
        peer.addTrack(stream.getVideoTracks()[0], stream);
      }, 2000);
    }
  };

  return (
    <div>
      <p>webrtc</p>
      <div>
        trickle
        <br />
        <input
          type="radio"
          checked={!trickle}
          onChange={() => setTrickle(!trickle)}
        />
        off
        <input
          type="radio"
          checked={trickle}
          onChange={() => setTrickle(!trickle)}
        />
        on
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
          const rtc = await create(roomId, trickle);
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
          const rtc = await join(roomId, trickle);
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
        style={{ width: "100%", height: "100%" }}
      />
      <p>datachannel</p>
      <TextField
        multiline
        value={text}
        onChange={e => {
          setText(e.target.value);
          if (rtc) rtc.send(e.target.value, "share");
        }}
        style={{ width: "40vw" }}
      />
    </div>
  );
};

export default App;
