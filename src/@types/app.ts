export type PlanSummary = [string, string, RaceType];

export type Units = "mi" | "km";

export interface PlanDates {
  start: Date; // first day of first week we will render
  planStartDate: Date; // day the race plan will start
  planEndDate: Date; // day the race plan will end
  end: Date; // last day of the last week we will render
  weekCount: number;
}

export type Milestone = {
  name: string;
  distance: number;
};

export type RaceType =
  | "Base"
  | "Multiple Distances"
  | "Marathon"
  | "Half Marathon"
  | "5K"
  | "10K"
  | "15K/10M"
  | "50K"
  | "100K"
  | "100M";

export type RaceDistance = {
  name: string;
  distance: number;
  defaultTime: number;
};

export interface PlannedWorkout {
  title: string;
  description: string;
  tags: Tags[];
  distance: WorkoutDistance;
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

export type Tags =
  | "Rest"
  | "Easy Run"
  | "Run"
  | "Cross Train"
  | "Hills"
  | "Speedwork"
  | "Long Run"
  | "Race";

// A workout's distance in the plan's units: a single value or a [low, high] range.
export type WorkoutDistance = number | [number, number];

export interface DayDetails {
  title: string;
  desc: string;
  tags: Tags[];
  dist: WorkoutDistance;
  sourceUnits: Units;
}

export type dayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Day<T> {
  date: Date;
  event: T | undefined;
}

export interface Week<T> {
  weekNum: number;
  dist: number[];
  desc: string;
  days: Day<T>[];
}
