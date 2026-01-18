import yaml from "js-yaml";
import Ajv from "ajv";
import { TrainingPlan, PlannedWorkout, WeekSchedule, Tags, Units, RaceType } from "types/app";

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
}

interface RawWeek {
  description?: string;
  workouts: RawWorkout[];
}

interface RawPlan {
  id: string;
  name: string;
  description: string;
  units: string;
  type: string;
  source: string;
  schedule: RawWeek[];
}

let schemaCache: object | null = null;

async function fetchSchema(): Promise<object> {
  if (schemaCache) {
    return schemaCache;
  }
  const response = await fetch("/hacks/calendarhack/schema/plan-schema.json");
  if (!response.ok) {
    throw new Error("Failed to load schema");
  }
  schemaCache = await response.json();
  return schemaCache!;
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

export async function parseYamlContent(content: string): Promise<YamlLoadResult> {
  try {
    if (!content.trim()) {
      return { success: false, error: "No content provided" };
    }

    // Parse YAML
    let rawPlan: RawPlan;
    try {
      rawPlan = yaml.load(content) as RawPlan;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `Invalid YAML syntax: ${message}` };
    }

    if (!rawPlan || typeof rawPlan !== "object") {
      return { success: false, error: "YAML content is not a valid plan object" };
    }

    // Fetch and validate against schema
    let schema: object;
    try {
      schema = await fetchSchema();
    } catch {
      // If schema can't be loaded, skip validation
      console.warn("Could not load schema, skipping validation");
      const plan = convertRawPlanToTrainingPlan(rawPlan);
      return { success: true, plan };
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(rawPlan);

    if (!valid) {
      const errors = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join("; ");
      return { success: false, error: `Schema validation failed: ${errors}` };
    }

    const plan = convertRawPlanToTrainingPlan(rawPlan);
    return { success: true, plan };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: `Unexpected error: ${message}` };
  }
}
