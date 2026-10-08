import { repo } from "./planrepo";
import { isPlanRemoved } from "./config";
import { plans } from "./planList";

function mockFetch(response: Partial<Response>) {
  const fetchMock = jest.fn(async () => response as Response);
  globalThis.fetch = fetchMock;
  return fetchMock;
}

describe("PlanRepo", function () {
  describe("available", function () {
    it("should list every plan", function () {
      expect(repo.available).toHaveLength(plans.length);
    });

    it("should list removed plans after all other plans", function () {
      const firstRemoved = repo.available.findIndex(isPlanRemoved);
      expect(firstRemoved).toBeGreaterThan(0);
      expect(repo.available.slice(firstRemoved).every(isPlanRemoved)).toBe(
        true,
      );
    });

    it("should otherwise keep the order of the plan list", function () {
      expect(repo.available.filter((p) => !isPlanRemoved(p))).toEqual(
        plans.filter((p) => !isPlanRemoved(p)),
      );
    });
  });

  describe("find", function () {
    it("should find a plan by id", function () {
      expect(repo.find("c25k")[1]).toBe("Couch to 5K");
    });

    it("should fall back to a default plan for an unknown id", function () {
      expect(repo.find("no_such_plan")[0]).toBe("higdon_int_mara1");
      expect(repo.find("")[0]).toBe("higdon_int_mara1");
    });
  });

  describe("fetch", function () {
    it("should request the plan's JSON file", async function () {
      const plan = { id: "c25k" };
      const fetchMock = mockFetch({ ok: true, json: async () => plan });

      expect(await repo.fetch(repo.find("c25k"))).toBe(plan);
      expect(fetchMock).toHaveBeenCalledWith(
        "/hacks/calendarhack/plans/json/c25k.json",
      );
    });

    it("should serve a repeated request from the cache", async function () {
      const plan = { id: "higdon_nov_mara1" };
      const fetchMock = mockFetch({ ok: true, json: async () => plan });
      const summary = repo.find("higdon_nov_mara1");

      const first = await repo.fetch(summary);
      const second = await repo.fetch(summary);

      expect(second).toBe(first);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("should reject and not cache a failed request", async function () {
      const summary = repo.find("higdon_nov_mara2");
      const error = { message: "not found" };
      mockFetch({ ok: false, json: async () => error });
      await expect(repo.fetch(summary)).rejects.toBe(error);

      const plan = { id: "higdon_nov_mara2" };
      const fetchMock = mockFetch({ ok: true, json: async () => plan });
      expect(await repo.fetch(summary)).toBe(plan);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
