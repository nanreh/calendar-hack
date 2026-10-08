import type { PlanSummary } from "types/app";

// Where the app is served from. It ends with a slash: the web server drops the query string when
// it redirects the address without one, which would lose the plan from a shared link.
const basePath = "/hacks/calendarhack/";

const AppConfig = {
  basePath,
  plansPath: basePath + "plans/yaml/",
};

export const Config = AppConfig;

export const REMOVED_PLANS = new Set([
  "coogan_pbr_mara_up_to_65",
  "frr_5k_01",
  "frr_5k_02",
  "frr_5k_03",
  "frr_8k10k_01",
  "frr_8k10k_02",
  "frr_8k10k_03",
  "frr_15k_10m_01",
  "frr_15k_10m_02",
  "frr_15k_10m_03",
  "frr_bt_01",
  "frr_bt_02",
  "frr_bt_03",
  "frr_multiple_distances_01",
  "frr_multiple_distances_02",
  "frr_multiple_distances_03",
  "pfitz_half_12_47",
  "pfitz_half_12_63",
  "pfitz_half_12_84",
  "pfitz_half_12_100",
  "pfitz_12_55",
  "pfitz_12_55_4th",
  "pfitz_12_70",
  "pfitz_12_70_4th",
  "pfitz_12_85",
  "pfitz_12_85_4th",
  "pfitz_12_more_than_85",
  "pfitz_12_more_than_85_4th",
  "pfitz_18_55",
  "pfitz_18_55_4th",
  "pfitz_18_70",
  "pfitz_18_70_4th",
  "pfitz_18_85",
  "pfitz_18_85_4th",
  "pfitz_18_more_than_85",
  "pfitz_18_more_than_85_4th",
  "pfitz_04_multi",
  "pfitz_04_multi_4th",
  "pfitz_06_multi",
  "pfitz_06_multi_4th",
  "pfitz_08_multi",
  "pfitz_08_multi_4th",
  "pfitz_10_multi",
  "pfitz_10_multi_4th",
  "pfitz_55_recovery",
  "pfitz_55_recovery_4th",
  "pfitz_70_recovery",
  "pfitz_70_recovery_4th",
  "pfitz_85_recovery",
  "pfitz_85_recovery_4th",
  "pfitz_more_than_85_recovery",
  "pfitz_more_than_85_recovery_4th",
]);

export const isPlanRemoved = (plan: PlanSummary) => REMOVED_PLANS.has(plan[0]);
