import { format } from "date-fns";
import { RacePlan } from "./dategrid";
import { getWeekDistance, render, renderDist } from "./rendering";
import { Units } from "types/app";
import { getDaysHeader, WeekStartsOn } from "./datecalc";


export function toCsv(plan: RacePlan, units: Units, weekStartsOn: WeekStartsOn): string | undefined {
    // one line per week, one column per day with description of workout
    const daysOfWeek = getDaysHeader(weekStartsOn)
    const header = ["Week", "Distance"];
    for (const dayOfWeek of daysOfWeek) {
      header.push(dayOfWeek);
    }
    const rows = [
      header,
    ];
  
    let weeks = plan.dateGrid.weeks;
    for (let i = 0; i < weeks.length; i++) {
      const row: string[] = [];
      const currWeek = weeks[i];
      const distance = getWeekDistance(currWeek, units);
      if (i === weeks.length - 1) {
        row.push("Final Training Week!");
      } else {
        row.push(`Training Week ${1 + i}`);
      }
      if (distance[0] > 0) {
        row.push(renderDist(distance, units, units));
      } else {
        row.push("");
      }
  
      for (var j = 0; j < currWeek.days.length; j++) {
        const currWorkout = currWeek.days[j];
        let date = format(currWorkout.date, 'yyyy-MM-dd');
        if (currWorkout.event) {
          let [title, desc] = render(currWorkout.event, plan.sourceUnits, units);
          let text = date + ": " + title;
          desc = desc.replace(/(\r\n|\n|\r)/gm, "\n");
          if (desc.replace(/\s/g, "") !== "") {
            // append desc if we have one
            text += " " + desc;
          }
          text = text.replace(/(\")/gm, "\"\""); // replace " with ""
          row.push('"' + text + '"');
        } else {
          row.push('"' + date + '"');
        }
      }
      rows.push(row);
    }
    let csvContent = rows.map(e => e.join(",")).join("\n");
    return csvContent;
  }
  