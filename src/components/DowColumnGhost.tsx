import type { Ref } from "react";
import { format } from "date-fns";
import { DragHandle } from "./DragHandle";
import { WorkoutCardView } from "./WorkoutCard";
import { BlankCard } from "./BlankCard";
import type { dayOfWeek, Units, Week, DayDetails } from "types/app";

interface Props {
  // the parent registers this node as the native drag image
  ref: Ref<HTMLDivElement>;
  // which column to render (null until a header is grabbed)
  dow: dayOfWeek | null;
  weeks: Week<DayDetails>[];
  units: Units;
  // grid geometry measured by CalendarGrid, so the replica matches the
  // on-screen column
  columnWidth: number;
  headerHeight: number;
  weekHeights: number[];
}

/**
 * Off-screen replica of one whole day-of-week column. DayOfWeekHeader
 * registers it as the native drag image on grab, so the browser moves a
 * full-column image with the cursor. It must stay laid out (not
 * display:none / zero-size) or the browser cannot snapshot it; it is moved
 * off-screen instead (see .dow-ghost).
 */
export const DowColumnGhost = ({
  ref,
  dow,
  weeks,
  units,
  columnWidth,
  headerHeight,
  weekHeights,
}: Props) => {
  return (
    <div ref={ref} className="dow-ghost" style={{ width: columnWidth }}>
      {dow && (
        <>
          <div style={{ height: headerHeight }}>
            <div className="day-header">
              <DragHandle viewBox="0 0 32 36" />
              <div>{dow}</div>
            </div>
          </div>
          {weeks.map((week, i) => {
            const day = week.days.find((d) => format(d.date, "EEEE") === dow);
            if (!day) return null;
            return (
              <div
                key={week.weekNum}
                className="day-cell"
                style={{ height: weekHeights[i] }}
              >
                {day.event ? (
                  <WorkoutCardView
                    dayDetails={day.event}
                    date={day.date}
                    units={units}
                  />
                ) : (
                  <BlankCard date={day.date} />
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
