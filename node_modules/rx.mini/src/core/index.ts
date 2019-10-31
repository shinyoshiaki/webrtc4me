type EventExecute<T> = (data: T) => void;
type EventComplete = () => void;
type EventError = (e: any) => void;

type IEvent<T> = {
  stack: {
    execute: EventExecute<T>;
    complete?: EventComplete;
    error?: EventError;
    id: number;
  }[];
  index: number;
};

export default class Event<T = null> {
  private event: IEvent<T> = { stack: [], index: 0 };

  execute = (data: T) => {
    for (let item of this.event.stack) {
      item.execute(data);
    }
  };

  complete = () => {
    for (let item of this.event.stack) {
      if (item.complete) item.complete();
    }
    this.allUnsubscribe();
  };

  error = (e: any) => {
    for (let item of this.event.stack) {
      if (item.error) item.error(e);
    }
    this.allUnsubscribe();
  };

  allUnsubscribe = () => {
    this.event = { stack: [], index: 0 };
  };

  subscribe = (
    execute: EventExecute<T>,
    complete?: EventComplete,
    error?: EventError
  ) => {
    const id = this.event.index;
    this.event.stack.push({ execute, id, complete, error });
    this.event.index++;
    const unSubscribe = () => {
      this.event.stack = this.event.stack.filter(
        item => item.id !== id && item
      );
    };
    return { unSubscribe };
  };

  once = (
    execute: EventExecute<T>,
    complete?: EventComplete,
    error?: EventError
  ) => {
    const off = this.subscribe(
      data => {
        off.unSubscribe();
        execute(data);
      },
      complete,
      error
    );
  };

  asPromise = (timelimit?: number) =>
    new Promise<T>((resolve, reject) => {
      const timeout =
        timelimit &&
        setTimeout(() => {
          reject("Event asPromise timeout");
        }, timelimit);

      this.once(
        data => {
          if (timeout) clearTimeout(timeout);
          resolve(data);
        },
        () => {
          if (timeout) clearTimeout(timeout);
          resolve();
        },
        err => {
          if (timeout) clearTimeout(timeout);
          reject(err);
        }
      );
    });

  get returnTrigger() {
    const { execute, error, complete } = this;
    return { execute, error, complete };
  }

  get returnListener() {
    const { subscribe, once, asPromise } = this;
    return { subscribe, once, asPromise };
  }

  get length() {
    return this.event.stack.length;
  }
}
