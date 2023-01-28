import * as React from "react";
import { Week, dayOfWeek, key } from "../ch/dategrid";
import { Units } from "../defy/models";
import { DayDetails, RacePlan } from "../ch/models";
import { format } from "date-fns";
import { DayCell } from "./DayCell";

interface Props {
  desc: string;
  week: Week<DayDetails>;
  units: Units;
  racePlan: RacePlan;
  swap: (d1: Date, d2: Date) => void;
  selectedDow: dayOfWeek | undefined;
  hoveringDow: dayOfWeek | undefined;
  selectedWeek: number | undefined;
  hoveringWeek: number | undefined;
}

export const WeekCard: React.FC<Props> = ({
  racePlan,
  desc,
  week,
  units,
  swap,
  selectedDow,
  hoveringDow,
  selectedWeek,
  hoveringWeek,
}) => {
  return (
    <div>
      {week.days.map((d, index) => (
        <div>
          <DayCell
            key={key(d.date)}
            date={d.date}
            dayDetails={d.event}
            units={units}
            swap={swap}
            selected={
              selectedDow === format(d.date, "EEEE") ||
              selectedWeek === week.weekNum
            }
            hovering={
              hoveringDow === format(d.date, "EEEE") ||
              hoveringWeek === week.weekNum
            }
          />
        </div>
      ))}
    </div>
  );
};
