import { eachDayOfInterval } from "date-fns";
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

export function build(
  trainingPlan: TrainingPlan,
  raceDate: Date,
  weekStartsOn: WeekStartsOn,
): RacePlan {
  const planDates = calcPlanDates(
    trainingPlan.schedule.length,
    raceDate,
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
  };
  newPlan.dateGrid.swapDow(dow1, dow2);
  return newPlan;
}
