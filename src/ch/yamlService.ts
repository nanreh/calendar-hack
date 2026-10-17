import { parse } from "yaml";
import { Ajv, type ErrorObject } from "ajv";
import type {
  TrainingPlan,
  PlannedWorkout,
  WeekSchedule,
  Tags,
  Units,
  RaceType,
} from "types/app";

export interface YamlLoadResult {
  success: boolean;
  plan?: TrainingPlan;
  error?: string;
}

interface RawWorkout {
  title: string;
  description?: string;
  tags?: string[];
  distance?: number | number[];
  goalRace?: boolean;
}

interface RawWeek {
  description?: string;
  workouts: RawWorkout[];
}

interface RawPlan {
  schemaVersion?: number;
  id: string;
  name: string;
  description: string;
  units: string;
  type: string;
  source: string;
  schedule: RawWeek[];
}

const schemaCache: Map<number, object> = new Map();

async function fetchSchema(version: number): Promise<object> {
  if (schemaCache.has(version)) {
    return schemaCache.get(version)!;
  }
  const response = await fetch(
    `/hacks/calendarhack/schema/plan-schema-v${version}.json`,
  );
  if (!response.ok) {
    throw new Error(`Failed to load schema v${version}`);
  }
  const schema = await response.json();
  schemaCache.set(version, schema);
  return schema;
}

function normalizeDistance(distance: number | number[] | undefined): number[] {
  if (distance === undefined) {
    return [];
  }
  if (Array.isArray(distance)) {
    return distance;
  }
  return [distance];
}

function normalizeTags(tags: string[] | undefined): Tags[] {
  if (!tags) {
    return [];
  }
  return tags as Tags[];
}

function convertRawPlanToTrainingPlan(raw: RawPlan): TrainingPlan {
  const schedule: WeekSchedule[] = raw.schedule.map((week) => ({
    description: week.description,
    workouts: week.workouts.map((workout): PlannedWorkout => ({
      title: workout.title,
      description: workout.description || "",
      tags: normalizeTags(workout.tags),
      distance: normalizeDistance(workout.distance),
      units: raw.units as Units,
      ...(workout.goalRace ? { goalRace: true } : {}),
    })),
  }));

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    units: raw.units as Units,
    type: raw.type as RaceType,
    source: raw.source,
    schedule,
  };
}

// Rules for the goal race that the schema can't express, as they span the whole schedule.
function goalRaceError(raw: RawPlan): string | undefined {
  const goalRaces = (raw.schedule ?? [])
    .flatMap((week) => week?.workouts ?? [])
    .filter((workout) => workout?.goalRace);
  if (goalRaces.length > 1) {
    return `Only one workout can be the goal race, but ${goalRaces.length} are`;
  }
  if (goalRaces.length === 1 && !goalRaces[0].title?.trim()) {
    return "The goal race needs a title";
  }
  return undefined;
}

// A failed pattern would be reported as the regular expression itself, which doesn't help anyone
// fix their plan, so the value and the description of what was expected are given instead.
// Needs the validator to be compiled with verbose: true.
function describeError(e: ErrorObject): string {
  if (e.keyword === "pattern" && e.parentSchema?.description) {
    return `${e.instancePath} ${JSON.stringify(e.data)} is not in the expected format. ${e.parentSchema.description}`;
  }
  return `${e.instancePath} ${e.message}`;
}

export async function parseYamlContent(
  content: string,
): Promise<YamlLoadResult> {
  try {
    if (!content.trim()) {
      return { success: false, error: "No content provided" };
    }

    // Parse YAML
    let rawPlan: RawPlan;
    try {
      rawPlan = parse(content) as RawPlan;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `Invalid YAML syntax: ${message}` };
    }

    if (!rawPlan || typeof rawPlan !== "object") {
      return {
        success: false,
        error: "YAML content is not a valid plan object",
      };
    }

    // Determine schema version (default to 1 if not specified)
    const schemaVersion = rawPlan.schemaVersion ?? 1;

    // Fetch and validate against schema
    let schema: object | undefined;
    try {
      schema = await fetchSchema(schemaVersion);
    } catch {
      // If schema can't be loaded, skip validation
      console.warn("Could not load schema, skipping validation");
    }

    if (schema) {
      const ajv = new Ajv({ allErrors: true, verbose: true });
      const validate = ajv.compile(schema);
      if (!validate(rawPlan)) {
        const errors = validate.errors?.map(describeError).join("; ");
        return { success: false, error: `Schema validation failed: ${errors}` };
      }
    }

    const goalError = goalRaceError(rawPlan);
    if (goalError) {
      return { success: false, error: goalError };
    }

    const plan = convertRawPlanToTrainingPlan(rawPlan);
    return { success: true, plan };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: `Unexpected error: ${message}` };
  }
}
