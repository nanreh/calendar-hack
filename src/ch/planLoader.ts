import type { PlanSource } from "./planSource";
import { planFetchUrl, planSourceHost, planSourceLabel } from "./planSource";
import type { YamlLoadResult } from "./yamlService";
import { parseYamlContent } from "./yamlService";

export interface SharedPlanResult extends YamlLoadResult {
  // the plan's text as fetched, present when the plan loaded
  yaml?: string;
}

// The largest plan hosted here is about 15 kB. Anything far beyond that is not a training plan.
const MAX_PLAN_BYTES = 200_000;

function failure(error: string): SharedPlanResult {
  return { success: false, error };
}

// Fetch a plan from where it is hosted and load it. Never throws: every failure comes back as a
// message that can be shown to the person who followed the link.
export async function loadPlanFromSource(
  source: PlanSource,
): Promise<SharedPlanResult> {
  const where = planSourceLabel(source);
  const host = planSourceHost(source);

  let response: Response;
  try {
    response = await fetch(planFetchUrl(source));
  } catch {
    // A browser reports a blocked cross-origin response the same way as a network failure,
    // so this cannot say which it was.
    return failure(
      `Could not load the plan from ${where}. ${host} may be unreachable, or the plan may no longer be available.`,
    );
  }

  if (response.status === 404) {
    return failure(
      `No plan was found at ${where}. It may have been deleted, or it may have expired or been made private.`,
    );
  }
  if (response.status === 429) {
    return failure(
      `${host} is limiting requests right now. Wait a moment and try again.`,
    );
  }
  if (!response.ok) {
    return failure(
      `${host} could not provide the plan (error ${response.status}). Try again later.`,
    );
  }

  let yaml: string;
  try {
    yaml = await response.text();
  } catch {
    return failure(`The plan at ${where} could not be read.`);
  }

  if (yaml.trim() === "") {
    return failure(`The file at ${where} is empty.`);
  }
  if (yaml.length > MAX_PLAN_BYTES) {
    return failure(`The file at ${where} is too large to be a training plan.`);
  }
  if (/^\s*<(!doctype|html)/i.test(yaml)) {
    return failure(
      `${host} returned a web page instead of the plan at ${where}. The plan may be private.`,
    );
  }

  const result = await parseYamlContent(yaml);
  if (!result.success || !result.plan) {
    return failure(
      `The file at ${where} is not a valid plan. ${result.error ?? ""}`.trim(),
    );
  }
  return { success: true, plan: result.plan, yaml };
}
