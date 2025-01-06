import { repo } from "./planrepo";

describe("PlanRepo", function () {
  /* This is an integration test. Was useful during dev but slow. Disabled for now, should maybe mock the request later. */
  it.skip("should load all available plans", async function () {
    const fetches = repo.available.map(repo.fetch, repo);
    const p = Promise.all(fetches);
    const fetched = await p;
    // Check each plan for sanity
    for (const plan of fetched) {
      expect(
        plan.type === "Marathon" ||
          plan.type === "Half Marathon" ||
          plan.type === "5K",
      ).toBe(true);
      expect(plan.schedule.length % 7).toBe(0);
    }
  });

  it.skip("should have cached all plans", () => {
    expect(
      repo.available.map(repo.isCached, repo).every((b) => true === b),
    ).toBe(true);
  });

  describe("Available Plans", function () {
    it.skip("should have valid RaceType values", function () {
      for (const p of repo.available) {
        expect(
          p[2] === "Marathon" || p[2] === "Half Marathon" || p[2] === "5K",
        ).toBe(true);
      }
    });
  });
});
