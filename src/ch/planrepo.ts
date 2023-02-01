import fetch from "cross-fetch";
import { RaceType, Units } from "../defy/models";
import { Tags } from "./models";
import { Config } from "./config";

export interface AvailablePlan {
  url: string;
  id: string;
  name: string;
  type: RaceType;
}

export interface PlannedWorkout {
  title: string;
  description: string;
  tags: Tags[];
  distance: number;
  units: Units;
}

export interface WeekSchedule {
  description: string | undefined;
  workouts: PlannedWorkout[]; // guaranteed to be length 7
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  units: Units;
  type: RaceType;
  schedule: WeekSchedule[];
  source: string;
}

export const availablePlans: AvailablePlan[] = [
  {
    url: Config.plansPath + "c25k.json",
    id: "c25k",
    name: "Couch to 5K",
    type: "5K",
  },
  {
    url: Config.plansPath + "c25k_rbp.json",
    id: "c25k_rbp",
    name: "Couch to 5K -- Runner's Blueprint",
    type: "5K",
  },
  {
    url: Config.plansPath + "frr_5k_01.json",
    id: "frr_5k_01",
    name: "Faster Road Racing: 5K Schedule 1",
    type: "5K",
  },
  {
    url: Config.plansPath + "frr_5k_02.json",
    id: "frr_5k_02",
    name: "Faster Road Racing: 5K Schedule 2",
    type: "5K",
  },
  {
    url: Config.plansPath + "frr_5k_03.json",
    id: "frr_5k_03",
    name: "Faster Road Racing: 5K Schedule 3",
    type: "5K",
  },
  {
    url: Config.plansPath + "frr_8k10k_01.json",
    id: "frr_8k10k_01",
    name: "Faster Road Racing: 8K-10K Schedule 1",
    type: "10K",
  },
  {
    url: Config.plansPath + "frr_8k10k_02.json",
    id: "frr_8k10k_02",
    name: "Faster Road Racing: 8K-10K Schedule 2",
    type: "10K",
  },
  {
    url: Config.plansPath + "frr_8k10k_03.json",
    id: "frr_8k10k_03",
    name: "Faster Road Racing: 8K-10K Schedule 3",
    type: "10K",
  },
  {
    url: Config.plansPath + "hansons_c210k.json",
    id: "hansons_c210k",
    name: "Hansons Couch Potato to 10k",
    type: "10K",
  },
  {
    url: Config.plansPath + "hansons_adv_half.json",
    id: "hansons_adv_half",
    name: "Hansons Advanced Half Marathon",
    type: "Half Marathon",
  },
  {
    url: Config.plansPath + "hansons_beg_half.json",
    id: "hansons_beg_half",
    name: "Hansons Beginner Half Marathon",
    type: "Half Marathon",
  },
  {
    url: Config.plansPath + "pfitz_half_12_47.json",
    id: "pfitz_half_12_47",
    name: "Faster Road Racing: Half Marathon Schedule 1, 31 to 47 miles per Week",
    type: "Half Marathon",
  },
  {
    url: Config.plansPath + "higdon_adv_mara1.json",
    id: "higdon_adv_mara1",
    name: "Hal Higdon: Advanced 1",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_adv_mara2.json",
    id: "higdon_adv_mara2",
    name: "Hal Higdon: Advanced 2",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_int_mara1.json",
    id: "higdon_int_mara1",
    name: "Hal Higdon: Intermediate 1",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_int_mara2.json",
    id: "higdon_int_mara2",
    name: "Hal Higdon: Intermediate 2",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_nov_mara1.json",
    id: "higdon_nov_mara1",
    name: "Hal Higdon: Novice 1",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_nov_mara2.json",
    id: "higdon_nov_mara2",
    name: "Hal Higdon: Novice 2",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_mara3.json",
    id: "higdon_mara3",
    name: "Hal Higdon: Marathon 3",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "higdon_half3.json",
    id: "higdon_half3",
    name: "Hal Higdon: Half Marathon 3",
    type: "Half Marathon",
  },
  {
    url: Config.plansPath + "hansons_adv_mara.json",
    id: "hansons_adv_mara",
    name: "Hansons Advanced Marathon",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "hansons_beg_mara.json",
    id: "hansons_beg_mara",
    name: "Hansons Beginner Marathon",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_12_55.json",
    id: "pfitz_12_55",
    name: "Pfitzinger/Douglas: Up to 55 miles per week, 12-week schedule",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_12_70.json",
    id: "pfitz_12_70",
    name: "Pfitzinger/Douglas: 55 to 70 Miles per Week, 12-week schedule",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_18_55.json",
    id: "pfitz_18_55",
    name: "Pfitzinger/Douglas: Up to 55 miles per week, 18-week schedule",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_18_70.json",
    id: "pfitz_18_70",
    name: "Pfitzinger/Douglas: 55 to 70 Miles per Week, 18-week schedule",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_18_85.json",
    id: "pfitz_18_85",
    name: "Pfitzinger/Douglas: 70 to 85 Miles per Week, 18-week schedule",
    type: "Marathon",
  },
  {
    url: Config.plansPath + "pfitz_multi_4.json",
    id: "pfitz_multi_4",
    name: "Pfitzinger/Douglas: Multiple Marathons, 4 Weeks Between Marathons",
    type: "Marathon",
  },
];

var initialMap: { [id: string]: AvailablePlan } = {};
export const availablePlansById = availablePlans.reduce(function (m, p) {
  m[p.id] = p;
  return m;
}, initialMap);

// A repository of training plans. Fetches plans on demand and caches them in memory.
class PlanRepo {
  private readonly _cache = new Map<string, TrainingPlan>();
  private readonly _available: AvailablePlan[];
  constructor(available: AvailablePlan[]) {
    this._available = available;
  }

  get available(): AvailablePlan[] {
    return this._available;
  }

  // For testing
  isCached(a: AvailablePlan): boolean {
    return this._cache.has(a.url);
  }

  async fetch(a: AvailablePlan): Promise<TrainingPlan> {
    return await fetchWithCache(a.url, this._cache);
  }
}

// Fetch a T from a URL.
export async function fetchFromUrl<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    return Promise.reject(error);
  }
  let result = await res.json();
  return result;
}

// Fetch a T from a URL, use the provided cache.
export async function fetchWithCache<T>(
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

export { PlanRepo };
