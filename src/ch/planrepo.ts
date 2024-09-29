import fetch from "cross-fetch";
import { Config } from "./config";
import { plans } from "./planList";
import { PlanSummary, TrainingPlan } from "types/app";

function url(summary: PlanSummary) {
  return Config.plansPath + summary[0] + ".json";
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
    return this._byId[planId] ? this._byId[planId] : this.first;
  }

  get first(): PlanSummary {
    return this._available[0];
  }

  // For testing
  isCached(a: PlanSummary): boolean {
    return this._cache.has(url(a));
  }

  async fetch(a: PlanSummary): Promise<TrainingPlan> {
    console.log("FETCH: " + JSON.stringify(a) + " " + url(a));
    return await fetchWithCache(url(a), this._cache);
  }
}

// Fetch a T from a URL.
async function fetchFromUrl<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    return Promise.reject(error);
  }
  let result = await res.json();
  return result;
}

// Fetch a T from a URL, use the provided cache.
async function fetchWithCache<T>(
  url: string,
  cache: Map<string, T>
): Promise<T> {
  // check in cache
  if (cache.has(url)) {
    //console.log("Cache hit!");
    let result = cache.get(url);
    if (!result) {
      throw Error("Assertion error: cached object not found");
    }
    return result;
  }
  //console.log(`Cache miss, fetching from: ${url}`);
  const res: T = await fetchFromUrl(url);
  // add to cache and resolve
  cache.set(url, res);
  //console.log(`returning result from: ${url}`);
  return res;
}

export const repo = new PlanRepo(plans);
