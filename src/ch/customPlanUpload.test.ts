import yaml from "js-yaml";
import { repo } from "./planrepo";
import { TrainingPlan } from "types/app";

const validYaml = `
id: custom_test_plan
name: Test Plan
description: A test custom plan
units: km
source: test
type: 5K
schedule:
- workouts:
  - title: Rest
  - title: Easy Run
    description: Easy 3km run
    tags: [Run]
    distance: [3]
  - title: Rest
  - title: Easy Run
    description: Easy 3km run
    tags: [Run]
    distance: [3]
  - title: Rest
  - title: Long Run
    description: 5km run
    tags: [Long Run]
    distance: [5]
  - title: Rest
`;

const missingFieldsYaml = `
id: incomplete_plan
name: Incomplete Plan
description: Missing type and schedule
units: km
source: test
`;

const invalidYaml = `
id: bad_plan
name: [this is : broken
  - not valid yaml {{{}}}
`;

describe("Custom Plan Upload", () => {
  describe("YAML parsing", () => {
    it("should parse a valid YAML plan into a TrainingPlan", () => {
      const plan = yaml.load(validYaml) as TrainingPlan;
      expect(plan.id).toBe("custom_test_plan");
      expect(plan.name).toBe("Test Plan");
      expect(plan.type).toBe("5K");
      expect(plan.schedule).toHaveLength(1);
      expect(plan.schedule[0].workouts).toHaveLength(7);
    });

    it("should parse YAML missing required fields", () => {
      const plan = yaml.load(missingFieldsYaml) as TrainingPlan;
      expect(plan.id).toBe("incomplete_plan");
      expect(plan.type).toBeUndefined();
      expect(plan.schedule).toBeUndefined();
    });

    it("should throw on invalid YAML", () => {
      expect(() => yaml.load(invalidYaml)).toThrow();
    });
  });

  describe("PlanRepo.addCustomPlan", () => {
    it("should cache the plan and return a valid PlanSummary", () => {
      const plan = yaml.load(validYaml) as TrainingPlan;
      const summary = repo.addCustomPlan(plan);

      expect(summary[0]).toBe("custom_test_plan");
      expect(summary[1]).toBe("Test Plan");
      expect(summary[2]).toBe("5K");
    });

    it("should make the plan fetchable via repo.fetch()", async () => {
      const plan = yaml.load(validYaml) as TrainingPlan;
      const summary = repo.addCustomPlan(plan);
      const fetched = await repo.fetch(summary);

      expect(fetched.id).toBe("custom_test_plan");
      expect(fetched.schedule).toHaveLength(1);
    });

    it("should be findable by id after adding", () => {
      const plan = yaml.load(validYaml) as TrainingPlan;
      repo.addCustomPlan(plan);
      const found = repo.find("custom_test_plan");

      expect(found[0]).toBe("custom_test_plan");
      expect(found[1]).toBe("Test Plan");
    });
  });
});
