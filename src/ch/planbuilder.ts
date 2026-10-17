import { addDays, eachDayOfInterval } from "date-fns";
import type { WeekStartsOn } from "./datecalc";
import { calcPlanDates } from "./datecalc";
import type { RacePlan } from "./dategrid";
import { DateGrid } from "./dategrid";
import type {
  DayDetails,
  dayOfWeek,
  PlannedWorkout,
  TrainingPlan,
  Units,
} from "types/app";

function renderDayDetails(
  sourceUnits: Units,
  plannedWorkout: PlannedWorkout | undefined,
): DayDetails | undefined {
  // a workout with a blank title is a placeholder for a day with nothing planned
  if (plannedWorkout && plannedWorkout.title.trim() !== "") {
    return {
      title: plannedWorkout.title,
      desc: plannedWorkout.description,
      tags: plannedWorkout.tags,
      dist: plannedWorkout.distance,
      sourceUnits: sourceUnits,
    };
  } else {
    return undefined;
  }
}

function getWorkouts(trainingPlan: TrainingPlan): PlannedWorkout[] {
  const result = new Array<PlannedWorkout>();
  for (let w = 0; w < trainingPlan.schedule.length; w++) {
    const currWeek = trainingPlan.schedule[w];
    for (let d = 0; d < currWeek.workouts.length; d++) {
      result.push(currWeek.workouts[d]);
    }
  }
  return result;
}

// The date picked in the app is the day of the plan's goal race, if it has one, or else its last
// day. Everything after that works from the last day, so these convert between the two.

// Position of the goal race among all the plan's days, or -1 if it has none.
function goalRaceIndex(trainingPlan: TrainingPlan): number {
  return getWorkouts(trainingPlan).findIndex((w) => w.goalRace);
}

// Days from the goal race to the plan's last day, 0 if it has no goal race.
function daysAfterGoalRace(trainingPlan: TrainingPlan): number {
  const index = goalRaceIndex(trainingPlan);
  return index < 0 ? 0 : trainingPlan.schedule.length * 7 - 1 - index;
}

export function hasGoalRace(trainingPlan: TrainingPlan): boolean {
  return goalRaceIndex(trainingPlan) >= 0;
}

export function planEndDate(trainingPlan: TrainingPlan, date: Date): Date {
  return addDays(date, daysAfterGoalRace(trainingPlan));
}

// The date to show in the app for a plan that ends on the given day.
export function dateForPlanEnd(trainingPlan: TrainingPlan, end: Date): Date {
  return addDays(end, -daysAfterGoalRace(trainingPlan));
}

// Lays out the plan so its goal race, or its last day if it has none, falls on the given date.
export function build(
  trainingPlan: TrainingPlan,
  date: Date,
  weekStartsOn: WeekStartsOn,
): RacePlan {
  const planDates = calcPlanDates(
    trainingPlan.schedule.length,
    planEndDate(trainingPlan, date),
    weekStartsOn,
  );
  const workoutsToPlace = getWorkouts(trainingPlan);
  const map = new Map<Date, DayDetails>();
  eachDayOfInterval({
    start: planDates.planStartDate,
    end: planDates.planEndDate,
  }).forEach((currDate) => {
    const dayDetails = renderDayDetails(
      trainingPlan.units,
      workoutsToPlace.shift(),
    );
    if (dayDetails) {
      map.set(currDate, dayDetails);
    }
  });
  const dateGrid = new DateGrid(map, weekStartsOn);
  return {
    raceType: trainingPlan.type,
    planDates: planDates,
    dateGrid: dateGrid,
    sourceUnits: trainingPlan.units,
    description: trainingPlan.description,
    sourceUrl: trainingPlan.source,
    goalRaceDate: hasGoalRace(trainingPlan) ? date : undefined,
  };
}

export function swap(racePlan: RacePlan, d1: Date, d2: Date): RacePlan {
  const newPlan = {
    planDates: racePlan.planDates,
    raceType: racePlan.raceType,
    title: racePlan.raceType,
    dateGrid: racePlan.dateGrid.clone(),
    sourceUnits: racePlan.sourceUnits,
    description: racePlan.description,
    sourceUrl: racePlan.sourceUrl,
    goalRaceDate: racePlan.goalRaceDate,
  };
  newPlan.dateGrid.swap(d1, d2);
  return newPlan;
}

export function swapDow(
  racePlan: RacePlan,
  dow1: dayOfWeek,
  dow2: dayOfWeek,
): RacePlan {
  const newPlan = {
    planDates: racePlan.planDates,
    raceType: racePlan.raceType,
    title: racePlan.raceType,
    dateGrid: racePlan.dateGrid.clone(),
    sourceUnits: racePlan.sourceUnits,
    description: racePlan.description,
    sourceUrl: racePlan.sourceUrl,
    goalRaceDate: racePlan.goalRaceDate,
  };
  newPlan.dateGrid.swapDow(dow1, dow2);
  return newPlan;
}
