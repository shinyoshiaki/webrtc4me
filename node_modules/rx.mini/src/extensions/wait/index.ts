import Event from "../../";

export default class Wait<T> {
  private candidates: { [id: string]: Event<T> } = {};

  constructor() {}

  private exist(id: string) {
    return Object.keys(this.candidates).includes(id);
  }

  delete(kid: string) {
    delete this.candidates[kid];
  }

  async create(id: string, job: () => Promise<T>) {
    if (this.exist(id)) {
      return { exist: this.candidates[id] };
    } else {
      const event = new Event<T>();
      this.candidates[id] = event;

      const result = await job();
      event.execute(result);
      this.delete(id);

      return { result };
    }
  }
}
