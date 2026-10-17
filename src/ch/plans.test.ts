import { readdirSync, readFileSync } from "fs";
import { Ajv } from "ajv";
import { isPlanRemoved } from "./config";
import { plans } from "./planList";
import { renderStr } from "./rendering";
import { parseYamlContent } from "./yamlService";
import { servePublicFiles } from "../../test/servePublicFiles";

// Checks that span more than one file, which the JSON schema (see `npm run validatePlans`) cannot express:
// the plan list and the YAML files have to agree, every plan has to load and render the way the app
// does it, and the schema has to accept exactly the distances in curly braces that the app can render.

const YAML_DIR = "public/plans/yaml";

const yamlIds = readdirSync(YAML_DIR)
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => f.slice(0, -".yaml".length))
  .sort();

describe("Plan files", function () {
  beforeEach(servePublicFiles);

  it("should have a YAML file for exactly the plans that are listed and not removed", function () {
    const listed = plans
      .filter((p) => !isPlanRemoved(p))
      .map((p) => p[0])
      .sort();
    expect(yamlIds).toEqual(listed);
  });

  it("should not list the same plan id or name twice", function () {
    expect(new Set(plans.map((p) => p[0])).size).toBe(plans.length);
    expect(new Set(plans.map((p) => p[1])).size).toBe(plans.length);
  });

  it("should be able to load the sample plan offered to people writing their own", async function () {
    const result = await parseYamlContent(
      readFileSync("public/sampleplan.yaml", "utf8"),
    );
    expect(result.error).toBeUndefined();
    expect(result.plan?.schedule).toHaveLength(2);
  });

  describe.each(yamlIds)("%s", function (id) {
    const load = () =>
      parseYamlContent(readFileSync(`${YAML_DIR}/${id}.yaml`, "utf8"));

    it("should load and pass schema validation", async function () {
      const result = await load();
      expect(result.error).toBeUndefined();
      expect(result.success).toBe(true);
    });

    it("should have an id that matches its file name", async function () {
      expect((await load()).plan?.id).toBe(id);
    });

    it("should have the race type given in the plan list", async function () {
      const summary = plans.find((p) => p[0] === id);
      expect((await load()).plan?.type).toBe(summary?.[2]);
    });

    it("should render every workout in both units", async function () {
      const plan = (await load()).plan!;
      for (const week of plan.schedule) {
        for (const workout of week.workouts) {
          for (const to of ["mi", "km"] as const) {
            expect(() =>
              renderStr(workout.title, plan.units, to),
            ).not.toThrow();
            expect(() =>
              renderStr(workout.description, plan.units, to),
            ).not.toThrow();
          }
        }
      }
    });
  });
});

describe("Distances in curly braces", function () {
  const schema = JSON.parse(
    readFileSync("public/schema/plan-schema-v1.json", "utf8"),
  );
  const schemaAccepts = new Ajv().compile(schema.definitions.textWithDistances);
  const renders = (text: string) => {
    try {
      renderStr(text, "mi", "km");
      return true;
    } catch {
      return false;
    }
  };

  it.each([
    "Rest",
    "{5} run",
    "{2.5} run",
    "{2:3.2} run",
    "{13.1:21.1}",
    "{8-9:13-14} easy",
    "{5} run, then {2:3.2} fast",
    "Half Marathon ({13.1:21.1})",
    "First line\nSecond line {3}",
  ])("should accept %j in the schema and render it", function (text) {
    expect(schemaAccepts(text)).toBe(true);
    expect(renders(text)).toBe(true);
  });

  it.each([
    "{1-3:1.6-4.8} run",
    "{1-3} run",
    "{} run",
    "{five} run",
    "{5:} run",
    "{5 run",
    "5} run",
    "{ 5 } run",
  ])("should reject %j in the schema and fail to render it", function (text) {
    expect(schemaAccepts(text)).toBe(false);
    expect(renders(text)).toBe(false);
  });

  it("should explain a distance it cannot read when a plan is loaded", async function () {
    servePublicFiles();
    const day = (title: string) => `    - title: '${title}'\n`;
    const result = await parseYamlContent(
      [
        "id: bad_distance",
        "name: Bad distance",
        "description: A plan with a distance the app cannot read",
        "units: mi",
        "type: 10K",
        "source: https://example.com",
        "schedule:",
        "  - workouts:",
        "",
      ].join("\n") +
        day("{1-3:1.6-4.8} run") +
        day("Rest").repeat(6),
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      '/schedule/0/workouts/0/title "{1-3:1.6-4.8} run" is not in the expected format.',
    );
    expect(result.error).toContain("whole numbers only");
  });
});
