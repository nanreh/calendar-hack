import { DayDetails } from "@/ch/models";
import { Week } from "@/ch/dategrid";

export function calcWeeklyDistance(w: Week<DayDetails>): number {
  return w.days
    .map((d) => d.event)
    .reduce((a, e) => {
      return !e || !e.dist ? a : a + e.dist;
    }, 0);
}
