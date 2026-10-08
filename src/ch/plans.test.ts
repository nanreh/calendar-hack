import { readdirSync, readFileSync } from "fs";
import { isPlanRemoved } from "./config";
import { plans } from "./planList";
import { parseYamlContent } from "./yamlService";
import { servePublicFiles } from "../../test/servePublicFiles";

// Checks that span more than one file, which the JSON schema (see `npm run validatePlans`) cannot express:
// the plan list and the YAML files have to agree, and every plan has to load the way the app loads it.

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
  });
});
