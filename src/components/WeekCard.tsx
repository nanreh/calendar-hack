import { RacePlan, key } from "../ch/dategrid";
import { format } from "date-fns";
import { DayCell } from "./DayCell";
import { Week, DayDetails, Units, dayOfWeek } from "types/app";

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

export const WeekCard = ({
  week,
  units,
  swap,
  selectedDow,
  hoveringDow,
  selectedWeek,
  hoveringWeek,
}: Props) => {
  return (
    <div>
      {week.days.map((d, _) => (
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
