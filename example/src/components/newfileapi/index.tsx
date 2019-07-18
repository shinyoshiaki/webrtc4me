import React, { FC, useEffect } from "react";
import WebRTC, { blob2Arraybuffer } from "../../../../src";
import useFile from "../../hooks/useFile";

const label = "example_file";

const NewFileApi: FC<{ peer?: WebRTC }> = ({ peer }) => {
  const [_, setFile, onSetFile] = useFile();

  useEffect(() => {
    if (!peer) return;
    peer.onData.subscribe(msg => {
      console.log(msg);
      if (msg.label === label) {
        const blob = new Blob([msg.data as ArrayBuffer]);
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = "some.png";
        anchor.href = url;
        anchor.click();
      }
    });
  }, [peer]);

  onSetFile(async file => {
    const abs = await blob2Arraybuffer(file);
    peer.send(abs, label);
  });

  return (
    <div>
      <p>new file api</p>
      <input type="file" onChange={setFile} />
    </div>
  );
};

export default NewFileApi;
