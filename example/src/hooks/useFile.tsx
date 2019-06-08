import { useState } from "react";

export default function useFile(): [File, (e: any) => void, (e: any) => void] {
  const [value, setvalue] = useState();
  let cb: any;
  const input = (e: any) => {
    const file = e.target.files[0];
    setvalue(file);
    if (cb) cb(file);
  };

  const onSetValue = (_cb: (a: any) => void) => (cb = _cb);
  return [value, input, onSetValue];
}
