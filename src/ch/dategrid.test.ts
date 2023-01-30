import { DateGrid } from "./dategrid";
import { parse, format, eachDayOfInterval } from "date-fns";
import { WeekStartsOnValues } from "./datecalc";

const dparse = (s: string) => parse(s, "MM/dd/yyyy", new Date());
const fmt = (d: Date) => format(d, "MM/dd/yyyy");

type Event = { desc: string };

describe("Plan", function () {
  it("initially empty grid", function () {
    let p = new DateGrid(new Map(), WeekStartsOnValues.Monday);
    expect(p).not.toBeNull();
    expect(p.min).toBeUndefined();
    expect(p.max).toBeUndefined();
    expect(p.first).toBeUndefined();
    expect(p.last).toBeUndefined();
    expect(p.days).toEqual([]);
    expect(p.weeks).toEqual([]);
    expect(p.weekCount).toEqual(0);
  });

  it("grid spanning one week with one date on it", function () {
    const m = new Map();
    const d = dparse("4/19/2020"); // A Sunday
    const testEvent = { desc: "event-1" };
    const expectedDays = [
      { date: dparse("4/13/2020"), event: undefined },
      { date: dparse("4/14/2020"), event: undefined },
      { date: dparse("4/15/2020"), event: undefined },
      { date: dparse("4/16/2020"), event: undefined },
      { date: dparse("4/17/2020"), event: undefined },
      { date: dparse("4/18/2020"), event: undefined },
      { date: dparse("4/19/2020"), event: testEvent },
    ];
    m.set(d, testEvent);
    let p = new DateGrid<Event>(m, WeekStartsOnValues.Monday);
    expect(p).not.toBeNull();
    expect(p.min).toEqual(d);
    expect(p.max).toEqual(d);
    expect(p.first).toEqual(dparse("4/13/2020"));
    expect(p.last).toEqual(d);
    expect(p.days).toEqual(expectedDays);
    expect(p.weekCount).toEqual(1);
    expect(p.weeks).toEqual([
      { weekNum: 0, dist: 0, desc: "Week 0", days: expectedDays },
    ]);
  });

  it("grid spanning two weeks with two dates on it", function () {
    const m = new Map();
    const eventOne = { desc: "event-1" };
    const eventTwo = { desc: "event-2" };
    m.set(dparse("5/7/2020"), eventOne); // Thursday
    m.set(dparse("5/16/2020"), eventTwo); // Saturday
    const expectedDaysWeek1 = [
      { date: dparse("5/4/2020"), event: undefined },
      { date: dparse("5/5/2020"), event: undefined },
      { date: dparse("5/6/2020"), event: undefined },
      { date: dparse("5/7/2020"), event: eventOne },
      { date: dparse("5/8/2020"), event: undefined },
      { date: dparse("5/9/2020"), event: undefined },
      { date: dparse("5/10/2020"), event: undefined },
    ];
    const expectedDaysWeek2 = [
      { date: dparse("5/11/2020"), event: undefined },
      { date: dparse("5/12/2020"), event: undefined },
      { date: dparse("5/13/2020"), event: undefined },
      { date: dparse("5/14/2020"), event: undefined },
      { date: dparse("5/15/2020"), event: undefined },
      { date: dparse("5/16/2020"), event: eventTwo },
      { date: dparse("5/17/2020"), event: undefined },
    ];
    let p = new DateGrid<Event>(m, WeekStartsOnValues.Monday);
    expect(p).not.toBeNull();
    expect(p.min).toEqual(dparse("5/7/2020"));
    expect(p.max).toEqual(dparse("5/16/2020"));
    expect(p.first).toEqual(dparse("5/4/2020"));
    expect(p.last).toEqual(dparse("5/17/2020"));
    expect(p.days).toEqual(expectedDaysWeek1.concat(expectedDaysWeek2));
    expect(p.weekCount).toEqual(2);
    expect(p.weeks).toEqual([
      { weekNum: 0, dist: 0, desc: "Week 0", days: expectedDaysWeek1 },
      { weekNum: 1, dist: 0, desc: "Week 1", days: expectedDaysWeek2 },
    ]);
  });

  it("Should swap two dates correctly", function () {
    const firstDay = dparse("04/13/2020");
    const secondDay = dparse("04/14/2020");
    const lastDay = dparse("04/19/2020");
    const m = new Map();
    eachDayOfInterval({ start: firstDay, end: lastDay }).forEach((d) => {
      m.set(d, { desc: format(d, "MM/dd/yyyy") });
    });
    const p = new DateGrid(m, WeekStartsOnValues.Monday);
    expect(p.days.length).toEqual(7);
    expect(p.getEvent(firstDay)).toEqual({ desc: "04/13/2020" });
    expect(p.getEvent(secondDay)).toEqual({ desc: "04/14/2020" });
    p.swap(firstDay, secondDay);
    expect(p.getEvent(firstDay)).toEqual({ desc: "04/14/2020" });
    expect(p.getEvent(secondDay)).toEqual({ desc: "04/13/2020" });
  });

  it("Test swap Saturdays and Mondays", function () {
    const firstDay = dparse("03/02/2020");
    const lastDay = dparse("04/05/2020");
    const m = new Map();
    eachDayOfInterval({ start: firstDay, end: lastDay }).forEach((d) => {
      m.set(d, { desc: format(d, "EEEE MM/dd/yyyy") });
    });
    const p = new DateGrid(m, WeekStartsOnValues.Monday);
    expect(p.days.length).toEqual(35);

    expect(() => p.getEvent(dparse("03/01/2020"))).toThrow(
      /is not within interval/
    );
    expect(p.getEvent(dparse("03/02/2020"))).toEqual({
      desc: "Monday 03/02/2020",
    });
    expect(p.getEvent(dparse("03/03/2020"))).toEqual({
      desc: "Tuesday 03/03/2020",
    });
    expect(p.getEvent(dparse("04/05/2020"))).toEqual({
      desc: "Sunday 04/05/2020",
    });

    p.swapDow("Tuesday", "Wednesday");
    const tuesdays = [
      "03/03/2020",
      "03/10/2020",
      "03/17/2020",
      "03/24/2020",
      "03/31/2020",
    ];
    expect(p.selectAll("Tuesday").map(fmt)).toEqual(tuesdays);
    const wednesdays = [
      "03/04/2020",
      "03/11/2020",
      "03/18/2020",
      "03/25/2020",
      "04/01/2020",
    ];
    expect(p.selectAll("Wednesday").map(fmt)).toEqual(wednesdays);
    tuesdays.forEach((s) =>
      expect(p.getEvent(dparse(s))?.desc.startsWith("Wednesday")).toBe(true)
    );
    wednesdays.forEach((s) =>
      expect(p.getEvent(dparse(s))?.desc.startsWith("Tuesday")).toBe(true)
    );
  });
});
