import { addEvent, OnData, excuteEvent } from "../core";

test("Event", () => {
  const event = {};
  addEvent<OnData>(event, () => {}, "one");
  addEvent<OnData>(event, () => {}, "two");
  addEvent<OnData>(event, () => {});
  addEvent<OnData>(event, () => {});
  console.log(event);
  excuteEvent(event);
  expect(Object.keys(event).length).toBe(4);
});
