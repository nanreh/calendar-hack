import * as React from "react";
import { RacePlan, key } from "../ch/dategrid";
import { DayCell } from "./DayCell";
import { WeekSummary } from "./WeekSummary";
import { DayOfWeekHeader } from "./DayOfWeekHeader";
import { format } from "date-fns";
import { getDaysHeader, WeekStartsOn } from "../ch/datecalc";
import { Units, dayOfWeek, Week, DayDetails } from "types/app";

interface Props {
  racePlan: RacePlan;
  units: Units;
  weekStartsOn: WeekStartsOn;
  swapDates: (d1: Date, d2: Date) => void;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
}

function calcWeeklyDistance(w: Week<DayDetails>): number[] {
  let min = 0;
  let max = 0;
  let hasRange = false;

  for (const day of w.days) {
    const e = day.event;
    if (!e || !e.dist) continue;

    if (typeof e.dist === "number") {
      max += e.dist;
    } else if (Array.isArray(e.dist) && e.dist.length === 2) {
      const [low, high] = e.dist;
      min += low;
      max += high;
      hasRange = true;
    }
  }
  return hasRange ? [min, max] : [max];
}


function findMaxDistance(weeks: Week<DayDetails>[]): number[] {
  let maxOfMins = 0;
  let maxOfMaxes = 0;
  let hasRanges = false;

  for (let i = 0; i < weeks.length; i++) {
    const dist = calcWeeklyDistance(weeks[i]);

    if (dist.length === 1) {
      const val = dist[0];
      if (val > maxOfMins) maxOfMins = val;
      if (val > maxOfMaxes) maxOfMaxes = val;
    } else if (dist.length === 2) {
      const [weekMin, weekMax] = dist;
      if (weekMin > maxOfMins) maxOfMins = weekMin;
      if (weekMax > maxOfMaxes) maxOfMaxes = weekMax;
      hasRanges = true;
    }
  }

  return hasRanges ? [maxOfMins, maxOfMaxes] : [maxOfMaxes];
}


export const CalendarGrid = ({
  racePlan,
  units,
  weekStartsOn,
  swapDates,
  swapDow,
}: Props) => {
  const [selectedDow, setSelectedDow] = React.useState<dayOfWeek | undefined>(
    undefined,
  );
  const [hoveringDow, setHoveringDow] = React.useState<dayOfWeek | undefined>(
    undefined,
  );
  const maxDistance = findMaxDistance(racePlan.dateGrid.weeks);

  function getWeek(w: Week<DayDetails>) {
    const weekDist = calcWeeklyDistance(w);

    let isHighestMileage = false;
    if (maxDistance[0] > 0) {
      if (weekDist.length === 1) {
        isHighestMileage = maxDistance.length === 1 && weekDist[0] === maxDistance[0];
      } else if (weekDist.length === 2) {
        isHighestMileage =
          maxDistance.length === 2 &&
          weekDist[0] === maxDistance[0] &&
          weekDist[1] === maxDistance[1];
      }
  }
  
    return (
      <div className="week-grid" key={`wr:${w.weekNum}`}>
        <WeekSummary
          key={`ws:${w.weekNum}`}
          desc={w.desc}
          week={w}
          units={units}
          racePlan={racePlan}
          isFirstWeek={w.weekNum === 0}
          isLastWeek={w.weekNum === racePlan.dateGrid.weekCount - 1}
          isHighestMileage={isHighestMileage}
        />
        {w.days.map((d, _) => (
          <DayCell
            key={key(d.date)}
            date={d.date}
            units={units}
            swap={swapDates}
            dayDetails={d.event}
            selected={selectedDow === format(d.date, "EEEE")}
            hovering={hoveringDow === format(d.date, "EEEE")}
          />
        ))}
      </div>
    );  
  }

  function getHeader() {
    return (
      <div className="week-grid">
        <div key={"blank-left"} />
        {getDaysHeader(weekStartsOn).map((dow, _) => (
          <DayOfWeekHeader
            key={dow}
            dow={dow as dayOfWeek}
            swapDow={swapDow}
            setSelectedDow={setSelectedDow}
            setHoveringDow={setHoveringDow}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="calendar-grid">
      {getHeader()}
      {racePlan.dateGrid.weeks.map((w, _) => getWeek(w))}
    </div>
  );
};
