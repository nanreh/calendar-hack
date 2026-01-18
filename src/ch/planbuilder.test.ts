import { build, swap, swapDow } from "./planbuilder";
import { TrainingPlan, PlannedWorkout, Tags } from "types/app";
import { WeekStartsOnValues } from "./datecalc";

function createWorkout(title: string, distance: number[] = []): PlannedWorkout {
  return {
    title,
    description: "",
    tags: [] as Tags[],
    distance,
    units: "mi",
  };
}

function createSimplePlan(numWeeks: number): TrainingPlan {
  const schedule = [];
  for (let w = 0; w < numWeeks; w++) {
    const workouts: PlannedWorkout[] = [];
    for (let d = 0; d < 7; d++) {
      workouts.push(createWorkout(`W${w + 1}D${d + 1}`, d === 0 ? [] : [d + 1]));
    }
    schedule.push({ description: `Week ${w + 1}`, workouts });
  }
  return {
    id: "test_plan",
    name: "Test Plan",
    description: "A test plan",
    units: "mi",
    type: "Marathon",
    source: "https://example.com",
    schedule,
  };
}

describe("PlanBuilder", function () {
  describe("build", function () {
    it("should build a race plan from a training plan", function () {
      const plan = createSimplePlan(2);
      const raceDate = new Date(2024, 0, 14); // Sunday Jan 14, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      expect(racePlan.raceType).toBe("Marathon");
      expect(racePlan.sourceUnits).toBe("mi");
      expect(racePlan.description).toBe("A test plan");
      expect(racePlan.sourceUrl).toBe("https://example.com");
      expect(racePlan.dateGrid.weekCount).toBe(2);
    });

    it("should place workouts on correct dates", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14); // Sunday Jan 14, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const days = racePlan.dateGrid.days;
      expect(days.length).toBe(7);
      expect(days[0].event?.title).toBe("W1D1");
      expect(days[6].event?.title).toBe("W1D7");
    });

    it("should handle different week start days", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 13); // Saturday Jan 13, 2024

      const racePlanSunday = build(plan, raceDate, WeekStartsOnValues.Sunday);
      expect(racePlanSunday.dateGrid.first).toEqual(new Date(2024, 0, 7));

      const racePlanMonday = build(plan, raceDate, WeekStartsOnValues.Monday);
      expect(racePlanMonday.dateGrid.first).toEqual(new Date(2024, 0, 1));
    });

    it("should preserve workout distances", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const days = racePlan.dateGrid.days;
      expect(days[0].event?.dist).toEqual([]);
      expect(days[1].event?.dist).toEqual([2]);
      expect(days[2].event?.dist).toEqual([3]);
    });
  });

  describe("swap", function () {
    it("should swap two dates", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const d1 = new Date(2024, 0, 8); // Monday
      const d2 = new Date(2024, 0, 9); // Tuesday

      expect(racePlan.dateGrid.getEvent(d1)?.title).toBe("W1D1");
      expect(racePlan.dateGrid.getEvent(d2)?.title).toBe("W1D2");

      const swapped = swap(racePlan, d1, d2);

      expect(swapped.dateGrid.getEvent(d1)?.title).toBe("W1D2");
      expect(swapped.dateGrid.getEvent(d2)?.title).toBe("W1D1");
    });

    it("should not mutate original plan", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const d1 = new Date(2024, 0, 8);
      const d2 = new Date(2024, 0, 9);

      const original = racePlan.dateGrid.getEvent(d1)?.title;
      swap(racePlan, d1, d2);

      expect(racePlan.dateGrid.getEvent(d1)?.title).toBe(original);
    });

    it("should preserve other plan properties after swap", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const d1 = new Date(2024, 0, 8);
      const d2 = new Date(2024, 0, 9);

      const swapped = swap(racePlan, d1, d2);

      expect(swapped.raceType).toBe(racePlan.raceType);
      expect(swapped.sourceUnits).toBe(racePlan.sourceUnits);
      expect(swapped.description).toBe(racePlan.description);
      expect(swapped.sourceUrl).toBe(racePlan.sourceUrl);
    });
  });

  describe("swapDow", function () {
    it("should swap all days of week", function () {
      const plan = createSimplePlan(2);
      const raceDate = new Date(2024, 0, 21); // Sunday Jan 21, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      // Monday and Tuesday across 2 weeks
      const mon1 = new Date(2024, 0, 8);
      const tue1 = new Date(2024, 0, 9);
      const mon2 = new Date(2024, 0, 15);
      const tue2 = new Date(2024, 0, 16);

      expect(racePlan.dateGrid.getEvent(mon1)?.title).toBe("W1D1");
      expect(racePlan.dateGrid.getEvent(tue1)?.title).toBe("W1D2");
      expect(racePlan.dateGrid.getEvent(mon2)?.title).toBe("W2D1");
      expect(racePlan.dateGrid.getEvent(tue2)?.title).toBe("W2D2");

      const swapped = swapDow(racePlan, "Monday", "Tuesday");

      expect(swapped.dateGrid.getEvent(mon1)?.title).toBe("W1D2");
      expect(swapped.dateGrid.getEvent(tue1)?.title).toBe("W1D1");
      expect(swapped.dateGrid.getEvent(mon2)?.title).toBe("W2D2");
      expect(swapped.dateGrid.getEvent(tue2)?.title).toBe("W2D1");
    });

    it("should not mutate original plan", function () {
      const plan = createSimplePlan(1);
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const mon = new Date(2024, 0, 8);
      const original = racePlan.dateGrid.getEvent(mon)?.title;

      swapDow(racePlan, "Monday", "Tuesday");

      expect(racePlan.dateGrid.getEvent(mon)?.title).toBe(original);
    });
  });
});
