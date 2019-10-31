import Event from "../../core";

export function Buffer<T>(length: number, event: Event<T>) {
  const observable = new Event<T>();
  const pool: T[] = [];
  let fulled = false;
  event.subscribe(e => {
    if (!fulled && pool.length === length) {
      pool.forEach(observable.execute);
      fulled = true;
    }
    if (fulled) {
      observable.execute(e);
    } else {
      pool.push(e);
    }
  });

  const { subscribe, asPromise, once } = observable;
  return { subscribe, asPromise, once };
}
