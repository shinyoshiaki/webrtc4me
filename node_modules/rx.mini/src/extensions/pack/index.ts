import Event from "../../core";

export default function Pack() {
  let events: Event<any>[] = [];

  const event = <T>() => {
    const e = new Event<T>();
    events.push(e);
    return e;
  };

  const finishAll = () => {
    events.forEach(e => e.allUnsubscribe());
    events = [];
  };

  return { event, finishAll };
}
