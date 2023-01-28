import { PlanDates } from "./datecalc";
import { DateGrid } from "./dategrid";
import { Units, RaceType } from "../defy/models";

export type Tags =
  | "Rest"
  | "Run"
  | "Cross Train"
  | "Hills"
  | "Speedwork"
  | "Long Run"
  | "Race";

export interface DayDetails {
  title: string;
  desc: string;
  tags: Tags[];
  dist: number;
  sourceUnits: Units;
}

// Race plan is a TrainingPlan rendered for a specific goal race day plus all of the various
// customizations applied to it by an end user.
export interface RacePlan {
  planDates: PlanDates;
  raceType: RaceType;
  dateGrid: DateGrid<DayDetails>;
  sourceUnits: Units;
  description: string;
  sourceUrl: string;
}
