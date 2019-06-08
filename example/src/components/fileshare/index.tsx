import React, { FC, useEffect } from "react";
import useFile from "../../hooks/useFile";
import WebRTC, { FileShare } from "../../../../src";

const FileShareExample: FC<{ peer?: WebRTC }> = ({ peer }) => {
  const [_, setfile, onSetfile] = useFile();

  useEffect(() => {
    if (peer) {
      const fileshare = new FileShare(peer, "file");
      fileshare.event.subscribe(action => {
        switch (action.type) {
          case "downloaded":
            const { chunks, name } = action.payload;
            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);
            console.log({ url });
            const anchor = document.createElement("a");
            anchor.download = name;
            anchor.href = url;
            anchor.click();
            break;
        }
      });
    }
  }, [peer]);

  onSetfile(f => {
    if (peer) {
      const fileshare = new FileShare(peer, "file");
      fileshare.send(f);
    }
  });

  return (
    <div>
      <input type="file" onChange={setfile} />
    </div>
  );
};

export default FileShareExample;
