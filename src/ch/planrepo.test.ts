import { repo } from "./planrepo";
import { isPlanRemoved } from "./config";
import { plans } from "./planList";
import { servePublicFiles } from "../../test/servePublicFiles";

const planUrl = (id: string) => `/hacks/calendarhack/plans/yaml/${id}.yaml`;

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
    it("should request and parse the plan's YAML file", async function () {
      const fetchMock = servePublicFiles();

      const plan = await repo.fetch(repo.find("c25k"));

      expect(fetchMock).toHaveBeenCalledWith(planUrl("c25k"));
      expect(plan.id).toBe("c25k");
      expect(plan.schedule).toHaveLength(8);
      expect(plan.schedule[0].workouts).toHaveLength(7);
    });

    it("should serve a repeated request from the cache", async function () {
      const fetchMock = servePublicFiles();
      const summary = repo.find("higdon_nov_mara1");

      const first = await repo.fetch(summary);
      const second = await repo.fetch(summary);

      expect(second).toBe(first);
      const requests = fetchMock.mock.calls.filter(
        ([url]) => url === planUrl("higdon_nov_mara1"),
      );
      expect(requests).toHaveLength(1);
    });

    it("should reject and not cache a failed request", async function () {
      const summary = repo.find("higdon_nov_mara2");
      globalThis.fetch = jest.fn(
        async () => ({ ok: false, status: 404 }) as Response,
      );
      await expect(repo.fetch(summary)).rejects.toThrow(
        "Failed to fetch plan: 404",
      );

      servePublicFiles();
      expect((await repo.fetch(summary)).id).toBe("higdon_nov_mara2");
    });

    it("should reject a plan that fails schema validation", async function () {
      const schema = servePublicFiles();
      globalThis.fetch = jest.fn(async (url: RequestInfo | URL) =>
        String(url).endsWith(".yaml")
          ? ({
              ok: true,
              text: async () => "id: broken\nunits: furlongs",
            } as Response)
          : schema(url),
      );

      await expect(repo.fetch(repo.find("higdon_adv_mara1"))).rejects.toThrow(
        "Schema validation failed",
      );
    });
  });
});
