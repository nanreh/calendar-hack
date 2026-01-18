import { toCsv } from "./csvService";
import { build } from "./planbuilder";
import { TrainingPlan, PlannedWorkout, Tags } from "types/app";
import { WeekStartsOnValues } from "./datecalc";

function createWorkout(title: string, distance: number[] = [], description = ""): PlannedWorkout {
  return {
    title,
    description,
    tags: [] as Tags[],
    distance,
    units: "mi",
  };
}

function createTestPlan(): TrainingPlan {
  return {
    id: "test_plan",
    name: "Test Plan",
    description: "A test training plan",
    units: "mi",
    type: "Marathon",
    source: "https://example.com",
    schedule: [
      {
        description: "Week 1",
        workouts: [
          createWorkout("Rest"),
          createWorkout("{3} run", [3]),
          createWorkout("{4} run", [4]),
          createWorkout("{3} run", [3]),
          createWorkout("Rest"),
          createWorkout("{6}", [6]),
          createWorkout("Cross"),
        ],
      },
      {
        description: "Week 2",
        workouts: [
          createWorkout("Rest"),
          createWorkout("{4} run", [4]),
          createWorkout("{5} run", [5]),
          createWorkout("{4} run", [4]),
          createWorkout("Rest"),
          createWorkout("{8}", [8]),
          createWorkout("Cross"),
        ],
      },
    ],
  };
}

describe("CsvService", function () {
  describe("toCsv", function () {
    it("should generate CSV with header row", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21); // Sunday Jan 21, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      const lines = csv!.split("\n");
      expect(lines[0]).toBe("Week,Distance,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday");
    });

    it("should include week distance in output", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      const lines = csv!.split("\n");
      // Week 1 has 3+4+3+6 = 16 miles
      expect(lines[1]).toContain("16 mi");
    });

    it("should label final week correctly", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      const lines = csv!.split("\n");
      expect(lines[2]).toContain("Final Training Week!");
    });

    it("should include workout titles in cells", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      expect(csv).toContain("Rest");
      expect(csv).toContain("Cross");
    });

    it("should convert units when requested", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "km", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      expect(csv).toContain("km");
    });

    it("should handle Sunday week start", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 20); // Saturday Jan 20, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Sunday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Sunday);

      expect(csv).toBeDefined();
      const lines = csv!.split("\n");
      expect(lines[0]).toBe("Week,Distance,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday");
    });

    it("should handle Saturday week start", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 19); // Friday Jan 19, 2024
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Saturday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Saturday);

      expect(csv).toBeDefined();
      const lines = csv!.split("\n");
      expect(lines[0]).toBe("Week,Distance,Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday");
    });

    it("should include dates in workout cells", function () {
      const plan = createTestPlan();
      const raceDate = new Date(2024, 0, 21);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      expect(csv).toContain("2024-01-08");
      expect(csv).toContain("2024-01-21");
    });

    it("should escape quotes in content", function () {
      const plan: TrainingPlan = {
        id: "test_plan",
        name: "Test Plan",
        description: "A test plan",
        units: "mi",
        type: "Marathon",
        source: "https://example.com",
        schedule: [
          {
            description: "Week 1",
            workouts: [
              createWorkout('Run "fast"', [5]),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
            ],
          },
        ],
      };
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      // Quotes should be escaped as ""
      expect(csv).toContain('""fast""');
    });

    it("should handle workout descriptions", function () {
      const plan: TrainingPlan = {
        id: "test_plan",
        name: "Test Plan",
        description: "A test plan",
        units: "mi",
        type: "Marathon",
        source: "https://example.com",
        schedule: [
          {
            description: "Week 1",
            workouts: [
              createWorkout("Tempo", [6], "Run at tempo pace"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
              createWorkout("Rest"),
            ],
          },
        ],
      };
      const raceDate = new Date(2024, 0, 14);
      const racePlan = build(plan, raceDate, WeekStartsOnValues.Monday);

      const csv = toCsv(racePlan, "mi", WeekStartsOnValues.Monday);

      expect(csv).toBeDefined();
      expect(csv).toContain("Run at tempo pace");
    });
  });
});
