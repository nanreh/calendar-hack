import { readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { isPlanRemoved } from "./config";
import { plans } from "./planList";

// Checks that span more than one file, which the JSON schema (see `yarn validatePlans`) cannot express:
// the plan list, the YAML sources and the generated JSON all have to agree.

const YAML_DIR = "public/plans/yaml";
const JSON_DIR = "public/plans/json";

function ids(dir: string, extension: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(extension))
    .map((f) => f.slice(0, -extension.length))
    .sort();
}

const yamlIds = ids(YAML_DIR, ".yaml");
const jsonIds = ids(JSON_DIR, ".json");
const readYaml = (id: string) =>
  parse(readFileSync(`${YAML_DIR}/${id}.yaml`, "utf8"));
const readJson = (id: string) =>
  JSON.parse(readFileSync(`${JSON_DIR}/${id}.json`, "utf8"));

describe("Plan files", function () {
  it("should have a YAML file for exactly the plans that are listed and not removed", function () {
    const listed = plans
      .filter((p) => !isPlanRemoved(p))
      .map((p) => p[0])
      .sort();
    expect(yamlIds).toEqual(listed);
  });

  it("should have a JSON file for every YAML file and no others", function () {
    expect(jsonIds).toEqual(yamlIds);
  });

  it("should not list the same plan id or name twice", function () {
    expect(new Set(plans.map((p) => p[0])).size).toBe(plans.length);
    expect(new Set(plans.map((p) => p[1])).size).toBe(plans.length);
  });

  describe.each(yamlIds)("%s", function (id) {
    const plan = readYaml(id);

    it("should have an id that matches its file name", function () {
      expect(plan.id).toBe(id);
    });

    it("should have the race type given in the plan list", function () {
      const summary = plans.find((p) => p[0] === id);
      expect(plan.type).toBe(summary?.[2]);
    });

    it("should have JSON that is up to date with the YAML (run `yarn convertPlans`)", function () {
      expect(readJson(id)).toEqual(plan);
    });
  });
});
