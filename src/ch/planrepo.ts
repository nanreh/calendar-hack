import fetch from "cross-fetch";
import { Config } from "./config";
import { plans } from "./planList";
import { PlanSummary, TrainingPlan } from "types/app";
import { parseYamlContent } from "./yamlService";

function url(summary: PlanSummary) {
  return Config.plansPath + summary[0] + ".yaml";
}

// A repository of training plans. Fetches plans on demand and caches them in memory.
class PlanRepo {
  private readonly _cache = new Map<string, TrainingPlan>();
  private readonly _available: PlanSummary[];
  private readonly _byId: { [id: string]: PlanSummary };

  constructor(available: PlanSummary[]) {
    this._available = available;

    var initialMap: { [id: string]: PlanSummary } = {};
    this._byId = plans.reduce(function (m, p) {
      m[p[0]] = p;
      return m;
    }, initialMap);
  }

  get available(): PlanSummary[] {
    return this._available;
  }

  find(planId: string): PlanSummary {
    return this._byId[planId] ? this._byId[planId] : this._byId['higdon_int_mara1']; // arbitrary choice
  }

  get first(): PlanSummary {
    return this._available[0];
  }

  // For testing
  isCached(a: PlanSummary): boolean {
    return this._cache.has(url(a));
  }

  async fetch(a: PlanSummary): Promise<TrainingPlan> {
    return await fetchWithCache(url(a), this._cache);
  }
}

// Fetch a TrainingPlan from a YAML URL.
async function fetchPlanFromUrl(url: string): Promise<TrainingPlan> {
  const res = await fetch(url);
  if (!res.ok) {
    return Promise.reject(new Error(`Failed to fetch plan: ${res.status}`));
  }
  const yamlContent = await res.text();
  const result = await parseYamlContent(yamlContent);
  if (!result.success || !result.plan) {
    return Promise.reject(new Error(result.error || "Failed to parse plan"));
  }
  return result.plan;
}

// Fetch a TrainingPlan from a URL, use the provided cache.
async function fetchWithCache(
  url: string,
  cache: Map<string, TrainingPlan>,
): Promise<TrainingPlan> {
  // check in cache
  if (cache.has(url)) {
    let result = cache.get(url);
    if (!result) {
      throw Error("Assertion error: cached object not found");
    }
    return result;
  }
  const res = await fetchPlanFromUrl(url);
  // add to cache and resolve
  cache.set(url, res);
  return res;
}

export const repo = new PlanRepo(plans);
