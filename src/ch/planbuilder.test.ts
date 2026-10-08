import { build } from "./planbuilder";
import { WeekStartsOnValues } from "./datecalc";
import type { PlannedWorkout, TrainingPlan } from "types/app";

const workout = (title: string) => ({ title }) as PlannedWorkout;

function planOf(...weeks: string[][]): TrainingPlan {
  return {
    id: "test",
    name: "Test plan",
    description: "",
    units: "mi",
    type: "Marathon",
    source: "",
    schedule: weeks.map((titles) => ({
      description: undefined,
      workouts: titles.map(workout),
    })),
  };
}

describe("Plan builder", function () {
  // Sunday, so the plan's Monday-first weeks line up with the calendar
  const endDate = new Date(2027, 3, 25);

  it("should place the last workout on the end date", function () {
    const plan = planOf(["a", "b", "c", "d", "e", "f", "g"]);
    const racePlan = build(plan, endDate, WeekStartsOnValues.Monday);

    expect(racePlan.dateGrid.getEvent(endDate)?.title).toBe("g");
    expect(racePlan.dateGrid.getEvent(new Date(2027, 3, 19))?.title).toBe("a");
  });

  it("should leave days with a blank title empty", function () {
    const plan = planOf(
      ["a", "b", "c", "d", "e", "f", "g"],
      ["Race", "", "", "", "", "", " "],
    );
    const racePlan = build(plan, endDate, WeekStartsOnValues.Monday);
    const lastWeek = racePlan.dateGrid.weeks[1];

    expect(racePlan.dateGrid.weekCount).toBe(2);
    expect(lastWeek.days.map((d) => d.event?.title)).toEqual([
      "Race",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });
});
