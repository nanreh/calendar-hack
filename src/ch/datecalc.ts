import { subDays, startOfWeek, endOfWeek, startOfDay, differenceInCalendarDays } from 'date-fns'

export interface PlanDates {
    start: Date, // first monday of first week we will render
    planStartDate: Date, // day the race plan will start
    planEndDate: Date, // day the race plan will end
    end: Date,   // last sunday of the last week we will render
    weekCount: number
}

export function calcPlanDates(planWeeks: number, planEndsOn: Date): PlanDates {
    const end = startOfDay(endOfWeek(planEndsOn, { weekStartsOn: 1 }));
    const planStart = subDays(planEndsOn, planWeeks * 7 - 1);
    const start = startOfWeek(planStart, { weekStartsOn: 1 });
    const totalDays = 1 + differenceInCalendarDays(end, start);
    if (0 !== totalDays % 7) {
        throw new Error("total days %7 !==0: " + totalDays);
    }
    const weekCount = totalDays / 7;
    let result = {
        start: start,
        planStartDate: planStart,
        planEndDate: planEndsOn, // before or on race day
        end: end, // race day or beyond
        weekCount: weekCount
    }
    return result;
}
