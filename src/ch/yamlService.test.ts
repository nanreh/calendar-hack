import { parseYamlContent } from "./yamlService";

// Mock fetch for schema loading
global.fetch = jest.fn(() =>
  Promise.reject(new Error("Schema not available in test")),
) as jest.Mock;

// Silence console.warn for these tests (expected when schema fetch fails)
beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("YamlService", function () {
  describe("parseYamlContent", function () {
    const validYaml = `
schemaVersion: 1
id: test_plan
name: Test Plan
description: A test training plan
units: mi
type: Marathon
source: https://example.com
schedule:
  - workouts:
    - title: Rest
    - title: '{3} run'
      distance: 3
    - title: '{4} run'
      distance: 4
    - title: '{3} run'
      distance: 3
    - title: Rest
    - title: '{6}'
      distance: 6
    - title: Cross
`;

    it("should parse valid YAML content", async function () {
      const result = await parseYamlContent(validYaml);

      expect(result.success).toBe(true);
      expect(result.plan).toBeDefined();
      expect(result.plan?.id).toBe("test_plan");
      expect(result.plan?.name).toBe("Test Plan");
      expect(result.plan?.units).toBe("mi");
      expect(result.plan?.type).toBe("Marathon");
    });

    it("should normalize single distances to arrays", async function () {
      const result = await parseYamlContent(validYaml);

      expect(result.success).toBe(true);
      const workout = result.plan?.schedule[0].workouts[1];
      expect(workout?.distance).toEqual([3]);
    });

    it("should handle workouts without distance", async function () {
      const result = await parseYamlContent(validYaml);

      expect(result.success).toBe(true);
      const restWorkout = result.plan?.schedule[0].workouts[0];
      expect(restWorkout?.distance).toEqual([]);
    });

    it("should handle range distances", async function () {
      const yamlWithRange = `
schemaVersion: 1
id: test_plan
name: Test Plan
description: A test plan
units: mi
type: Marathon
source: https://example.com
schedule:
  - workouts:
    - title: Rest
    - title: '{8-10} run'
      distance: [8, 10]
    - title: Run
    - title: Run
    - title: Rest
    - title: Long
    - title: Cross
`;
      const result = await parseYamlContent(yamlWithRange);

      expect(result.success).toBe(true);
      const workout = result.plan?.schedule[0].workouts[1];
      expect(workout?.distance).toEqual([8, 10]);
    });

    it("should return error for empty content", async function () {
      const result = await parseYamlContent("");

      expect(result.success).toBe(false);
      expect(result.error).toBe("No content provided");
    });

    it("should return error for whitespace-only content", async function () {
      const result = await parseYamlContent("   \n\t  ");

      expect(result.success).toBe(false);
      expect(result.error).toBe("No content provided");
    });

    it("should return error for invalid YAML syntax", async function () {
      const invalidYaml = `
id: test
  bad indentation: here
    more: problems
`;
      const result = await parseYamlContent(invalidYaml);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid YAML syntax");
    });

    it("should return error for non-object YAML", async function () {
      const result = await parseYamlContent("just a string");

      expect(result.success).toBe(false);
      expect(result.error).toBe("YAML content is not a valid plan object");
    });

    it("should handle km units", async function () {
      const kmYaml = `
schemaVersion: 1
id: test_km
name: Test KM Plan
description: A test plan in km
units: km
type: Half Marathon
source: https://example.com
schedule:
  - workouts:
    - title: Rest
    - title: '{5} run'
      distance: 5
    - title: Run
    - title: Run
    - title: Rest
    - title: Long
    - title: Cross
`;
      const result = await parseYamlContent(kmYaml);

      expect(result.success).toBe(true);
      expect(result.plan?.units).toBe("km");
    });

    it("should handle plans without schemaVersion (defaults to 1)", async function () {
      const noVersionYaml = `
id: test_plan
name: Test Plan
description: A test plan
units: mi
type: 5K
source: https://example.com
schedule:
  - workouts:
    - title: Rest
    - title: Run
    - title: Run
    - title: Run
    - title: Rest
    - title: Long
    - title: Cross
`;
      const result = await parseYamlContent(noVersionYaml);

      expect(result.success).toBe(true);
      expect(result.plan?.id).toBe("test_plan");
    });

    it("should handle workout tags", async function () {
      const yamlWithTags = `
schemaVersion: 1
id: test_plan
name: Test Plan
description: A test plan
units: mi
type: Marathon
source: https://example.com
schedule:
  - workouts:
    - title: Rest
      tags: [Rest]
    - title: Easy Run
      tags: [Easy Run]
    - title: Run
    - title: Run
    - title: Rest
    - title: Long
      tags: [Long Run]
    - title: Cross
      tags: [Cross Train]
`;
      const result = await parseYamlContent(yamlWithTags);

      expect(result.success).toBe(true);
      expect(result.plan?.schedule[0].workouts[0].tags).toEqual(["Rest"]);
      expect(result.plan?.schedule[0].workouts[5].tags).toEqual(["Long Run"]);
    });

    it("should handle workout descriptions", async function () {
      const yamlWithDesc = `
schemaVersion: 1
id: test_plan
name: Test Plan
description: A test plan
units: mi
type: Marathon
source: https://example.com
schedule:
  - workouts:
    - title: Rest
    - title: Tempo Run
      description: Run at tempo pace for 20 minutes
    - title: Run
    - title: Run
    - title: Rest
    - title: Long
    - title: Cross
`;
      const result = await parseYamlContent(yamlWithDesc);

      expect(result.success).toBe(true);
      expect(result.plan?.schedule[0].workouts[1].description).toBe(
        "Run at tempo pace for 20 minutes",
      );
    });

    describe("goal race", function () {
      // validYaml with goalRace: true added to the workouts on the given days, counted from 0
      const withGoalRaces = (...days: number[]) => {
        let day = -1;
        return validYaml.replace(/^ {4}- title: .*$/gm, (line) => {
          day++;
          return days.includes(day) ? `${line}\n      goalRace: true` : line;
        });
      };

      it("should mark the goal race", async function () {
        const result = await parseYamlContent(withGoalRaces(5));

        expect(result.success).toBe(true);
        const workouts = result.plan!.schedule[0].workouts;
        expect(workouts[5].goalRace).toBe(true);
        expect(workouts.filter((w) => w.goalRace)).toHaveLength(1);
      });

      it("should refuse more than one goal race", async function () {
        const result = await parseYamlContent(withGoalRaces(1, 5));

        expect(result.success).toBe(false);
        expect(result.error).toBe(
          "Only one workout can be the goal race, but 2 are",
        );
      });

      it("should refuse a goal race without a title", async function () {
        const yaml = withGoalRaces(6).replace(
          "    - title: Cross\n",
          '    - title: ""\n',
        );
        const result = await parseYamlContent(yaml);

        expect(result.success).toBe(false);
        expect(result.error).toBe("The goal race needs a title");
      });
    });

    it("should default empty description to empty string", async function () {
      const result = await parseYamlContent(validYaml);

      expect(result.success).toBe(true);
      expect(result.plan?.schedule[0].workouts[0].description).toBe("");
    });
  });
});
