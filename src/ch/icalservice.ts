import { createEvents, EventAttributes } from "ics";
import { addDays } from "date-fns";
import { RacePlan } from "./dategrid";
import { getWeekDistance, render, renderDist } from "./rendering";
import { Units } from "types/app";

// public for testing
export function toDate(d: Date): [number, number, number] {
  return [d.getFullYear(), 1 + d.getMonth(), d.getDate()];
}

export function toIcal(plan: RacePlan, units: Units): string | undefined {
  const events = new Array<EventAttributes>();
  let weekDesc = null;
  let weeks = plan.dateGrid.weeks;
  for (let i = 0; i < weeks.length; i++) {
    const currWeek = weeks[i];
    const distance = getWeekDistance(currWeek, units);
    if (i === weeks.length - 1) {
      weekDesc = "Final Training Week!";
    } else {
      weekDesc = `Training Week ${1 + i}`;
    }
    if (distance > 0) {
      weekDesc += " Distance: " + renderDist(distance, units, units);
    }
    events.push({
      title: weekDesc,
      description: weekDesc,
      start: toDate(currWeek.days[0].date),
      end: toDate(addDays(currWeek.days[6].date, 1)), // end dates are non-inclusive in iCal
    });

    for (var j = 0; j < currWeek.days.length; j++) {
      const currWorkout = currWeek.days[j];
      if (currWorkout.event) {
        let [title, desc] = render(currWorkout.event, plan.sourceUnits, units);
        desc = desc.replace(/(\r\n|\n|\r)/gm, "\n");
        // if desc is not set, use title
        if (desc.replace(/\s/g, "") === "") {
          desc = title;
        }
        events.push({
          title: title,
          description: desc,
          start: toDate(currWorkout.date),
          end: toDate(addDays(currWorkout.date, 1)), // end dates are non-inclusive in iCal
        });
      }
    }
  }
  let res = createEvents(events);
  if (res.error) {
    console.log("Error creating iCal events: " + res.error);
    return undefined;
  }
  return res.value;
}