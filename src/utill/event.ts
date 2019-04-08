type EventFunc<T> = (data: T, id: number) => void;

interface IEvent<T> {
  stack: { func: EventFunc<T>; id: number }[];
  index: number;
}

export default class Event<T> {
  event: IEvent<T>;

  constructor() {
    this.event = {
      stack: [],
      index: 0
    };
  }

  excute(data: T) {
    for (let item of this.event.stack) {
      item.func(data, item.id);
    }
  }

  subscribe(func: EventFunc<T>) {
    const id = this.event.index;
    this.event.stack.push({ func, id });
    this.event.index++;
    const unSubscribe = () => {
      this.event.stack = this.event.stack.filter(
        item => item.id !== id && item
      );
    };
    return { unSubscribe };
  }
}
