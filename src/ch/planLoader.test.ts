import { readFileSync } from "fs";
import { loadPlanFromSource } from "./planLoader";
import type { PlanSource } from "./planSource";
import { servePublicFiles } from "../../test/servePublicFiles";

const gist: PlanSource = {
  service: "gist",
  user: "someuser",
  id: "a47c4688520b1cf0e4e6a1f0f5f5c3d2",
};
const samplePlan = readFileSync("public/sampleplan.yaml", "utf8");

// Answer requests for hosted plans with the given response, and everything else (the schema) from public/.
function hostPlan(response: Partial<Response> | Error) {
  const publicFiles = servePublicFiles();
  const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
    if (!String(url).startsWith("https://")) return publicFiles(url);
    if (response instanceof Error) throw response;
    return { ok: true, status: 200, ...response } as Response;
  });
  globalThis.fetch = fetchMock;
  return fetchMock;
}

const hostText = (text: string) => hostPlan({ text: async () => text });

describe("Plan loader", function () {
  it("should load a plan from a Gist", async function () {
    const fetchMock = hostText(samplePlan);

    const result = await loadPlanFromSource(gist);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://gist.githubusercontent.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2/raw",
    );
    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
    expect(result.plan?.schedule).toHaveLength(2);
    expect(result.yaml).toBe(samplePlan);
  });

  it("should explain when the plan no longer exists", async function () {
    hostPlan({ ok: false, status: 404 });

    const result = await loadPlanFromSource(gist);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "No plan was found at gist.github.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2. It may have been deleted, or it may have expired or been made private.",
    );
  });

  it("should explain when the host has a problem", async function () {
    hostPlan({ ok: false, status: 503 });

    const result = await loadPlanFromSource(gist);

    expect(result.error).toBe(
      "gist.github.com could not provide the plan (error 503). Try again later.",
    );
  });

  it("should explain when the request fails outright", async function () {
    hostPlan(new TypeError("Failed to fetch"));

    const result = await loadPlanFromSource(gist);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "Could not load the plan from gist.github.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2. gist.github.com may be unreachable, or the plan may no longer be available.",
    );
  });

  it("should reject an empty file", async function () {
    hostText("  \n");
    expect((await loadPlanFromSource(gist)).error).toBe(
      "The file at gist.github.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2 is empty.",
    );
  });

  it("should reject a web page served in place of the plan", async function () {
    hostText("<!DOCTYPE html><html><body>Just a moment...</body></html>");
    expect((await loadPlanFromSource(gist)).error).toContain(
      "gist.github.com returned a web page instead of the plan",
    );
  });

  it("should reject a file far too large to be a plan", async function () {
    hostText("x".repeat(200_001));
    expect((await loadPlanFromSource(gist)).error).toBe(
      "The file at gist.github.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2 is too large to be a training plan.",
    );
  });

  it("should reject text that is not YAML", async function () {
    hostText("title: [unclosed");

    const result = await loadPlanFromSource(gist);

    expect(result.success).toBe(false);
    expect(result.error).toContain(
      "The file at gist.github.com/someuser/a47c4688520b1cf0e4e6a1f0f5f5c3d2 is not a valid plan. Invalid YAML syntax",
    );
  });

  it("should reject YAML that is not a plan, saying what is wrong", async function () {
    hostText(samplePlan.replace(/^units: .*$/m, "units: furlongs"));

    const result = await loadPlanFromSource(gist);

    expect(result.success).toBe(false);
    expect(result.error).toContain(
      "is not a valid plan. Schema validation failed",
    );
    expect(result.error).toContain("/units");
    expect(result.plan).toBeUndefined();
  });
});
