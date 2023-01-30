import { eachDayOfInterval } from "date-fns";
import { calcPlanDates, WeekStartsOn } from "./datecalc";
import { DateGrid, dayOfWeek } from "./dategrid";
import { TrainingPlan, PlannedWorkout } from "./planrepo";
import { RacePlan, DayDetails } from "./models";
import { Units } from "../defy/models";

function renderDayDetails(
  date: Date,
  sourceUnits: Units,
  plannedWorkout: PlannedWorkout | undefined
): DayDetails | undefined {
  if (plannedWorkout) {
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
  weekStartsOn: WeekStartsOn
): RacePlan {
  const planDates = calcPlanDates(
    trainingPlan.schedule.length,
    raceDate,
    weekStartsOn
  );
  //console.log(`planDates: ${JSON.stringify(planDates)}`)
  const workoutsToPlace = getWorkouts(trainingPlan);
  const map = new Map<Date, DayDetails>();
  eachDayOfInterval({
    start: planDates.planStartDate,
    end: planDates.planEndDate,
  }).forEach((currDate) => {
    const dayDetails = renderDayDetails(
      currDate,
      trainingPlan.units,
      workoutsToPlace.shift()
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
  dow2: dayOfWeek
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
