import Event from "../utill/event";

const testEvent = new Event<{ msg: string }>();

test("event", () => {
  const { unSubscribe } = testEvent.subscribe(data => {
    expect(data.msg).toBe("1");
  });

  testEvent.subscribe(data => {
    expect(data.msg).toBe("1");
  });

  testEvent.excute({ msg: "1" });

  expect((testEvent as any).event.stack.length).toBe(2);
  unSubscribe();
  expect((testEvent as any).event.stack.length).toBe(1);

  testEvent.once(() => {
    expect((testEvent as any).event.stack.length).toBe(1);
  });
  expect((testEvent as any).event.stack.length).toBe(2);
  testEvent.excute({ msg: "1" });
});
