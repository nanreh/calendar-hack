import {
  subDays,
  startOfWeek,
  endOfWeek,
  startOfDay,
  differenceInCalendarDays,
} from "date-fns";
import { dayOfWeek } from "./dategrid";

export interface PlanDates {
  start: Date; // first day of first week we will render
  planStartDate: Date; // day the race plan will start
  planEndDate: Date; // day the race plan will end
  end: Date; // last day of the last week we will render
  weekCount: number;
}

export const WeekStartsOnValues = {
  Sunday: 0,
  Monday: 1,
  Saturday: 6,
} as const;

export type WeekStartsOn =
  (typeof WeekStartsOnValues)[keyof typeof WeekStartsOnValues];

// plan always has numOfDays % 7 === 0
export function calcPlanDates(
  numWeeksInPlan: number,
  planEndsOn: Date,
  weekStartsOn: WeekStartsOn
): PlanDates {
  const daysInPlan = numWeeksInPlan * 7;
  const planStartsOn = subDays(planEndsOn, daysInPlan - 1);
  const end = startOfDay(endOfWeek(planEndsOn, { weekStartsOn: weekStartsOn }));
  const start = startOfDay(
    startOfWeek(planStartsOn, { weekStartsOn: weekStartsOn })
  );
  const totalDays = 1 + differenceInCalendarDays(end, start);
  if (0 !== totalDays % 7) {
    throw new Error("total days %7 !==0: " + totalDays);
  }
  const weekCount = totalDays / 7;
  let result = {
    start: start,
    planStartDate: planStartsOn,
    planEndDate: planEndsOn, // before or on race day
    end: end, // race day or beyond
    weekCount: weekCount,
  };
  return result;
}

export function getDaysHeader(weekStartsOn: WeekStartsOn): dayOfWeek[] {
  if (weekStartsOn === WeekStartsOnValues.Monday) {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  }
  if (weekStartsOn === WeekStartsOnValues.Sunday) {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  } else {
    return [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];
  }
}
