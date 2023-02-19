import { eachDayOfInterval, format } from "date-fns";
import { register, unregister } from "timezone-mock";
import { calcPlanDates, PlanDates, WeekStartsOnValues } from "./datecalc";
import { DateGrid } from "./dategrid";
import { toDate, toIcal } from "./icalservice";
import { RacePlan } from "./models";

beforeAll(() => {
  register("Europe/London");
});

afterAll(() => {
  unregister();
});

it("should handle date intervals in which timezone offset changes (e.g. daylight savings)", () => {
  // Date range includes March 26 2023 when London enters daylight savings
  const dates: Date[] = eachDayOfInterval({
    start: new Date(2023, 2, 25),
    end: new Date(2023, 2, 28),
  });

  const actual = dates.map(toDate);
  const expected = [
    [2023, 3, 25],
    [2023, 3, 26],
    [2023, 3, 27],
    [2023, 3, 28],
  ];
  expect(actual).toEqual(expected);
});
