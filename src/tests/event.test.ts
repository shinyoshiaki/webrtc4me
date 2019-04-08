import Event from "../utill/event";

const testEvent = new Event<{ msg: string }>();

test("event", () => {
  const { unSubscribe } = testEvent.subscribe((data, id) => {
    console.log(id, data);
    expect(data.msg).toBe("1");
  });

  testEvent.subscribe((data, id) => {
    console.log(id, data);
    expect(data.msg).toBe("1");
  });

  testEvent.excute({ msg: "1" });

  expect(testEvent.event.stack.length).toBe(2);
  unSubscribe();
  expect(testEvent.event.stack.length).toBe(1);
});
