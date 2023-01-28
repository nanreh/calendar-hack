import { availablePlans, PlanRepo } from "./planrepo";

let planrepo: PlanRepo;

describe("PlanRepo", function () {
  beforeAll(() => {
    planrepo = new PlanRepo(availablePlans);
  });

  /* This is an integration test. Was useful during dev but slow. Disabled for now, should maybe mock the request later. */
  it.skip("should load all available plans", async function () {
    const fetches = availablePlans.map(planrepo.fetch, planrepo);
    const p = Promise.all(fetches);
    const fetched = await p;
    // Check each plan for sanity
    for (const plan of fetched) {
      expect(
        plan.type === "Marathon" ||
          plan.type === "Half Marathon" ||
          plan.type === "5K"
      ).toBe(true);
      expect(plan.schedule.length % 7).toBe(0);
    }
  });

  it.skip("should have cached all plans", () => {
    expect(
      availablePlans.map(planrepo.isCached, planrepo).every((b) => true === b)
    ).toBe(true);
  });

  describe("Available Plans", function () {
    it.skip("should have valid RaceType values", function () {
      for (const p of availablePlans) {
        expect(
          p.type === "Marathon" || p.type === "Half Marathon" || p.type === "5K"
        ).toBe(true);
      }
    });
  });
});
