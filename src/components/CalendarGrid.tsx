import { useLayoutEffect, useRef, useState } from "react";
import { useDragLayer } from "react-dnd";
import { ItemTypes, type DayDragItem, type DowDragItem } from "../ch/ItemTypes";
import type { RacePlan } from "../ch/dategrid";
import { key } from "../ch/dategrid";
import { DayCell } from "./DayCell";
import { WeekSummary } from "./WeekSummary";
import { DayOfWeekHeader } from "./DayOfWeekHeader";
import { DowColumnGhost } from "./DowColumnGhost";
import { CardGhost } from "./CardGhost";
import { DowColumnIndicator } from "./DowColumnIndicator";
import { getWeekDistance, sumWeekDistance } from "../ch/rendering";
import { format } from "date-fns";
import type { WeekStartsOn } from "../ch/datecalc";
import { getDaysHeader } from "../ch/datecalc";
import type { Units, dayOfWeek, Week, DayDetails } from "types/app";

interface Props {
  racePlan: RacePlan;
  units: Units;
  weekStartsOn: WeekStartsOn;
  swapDates: (d1: Date, d2: Date) => void;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
}

// grid geometry used to size the off-screen drag image (see DowColumnGhost)
interface GridMetrics {
  columns: { dow: dayOfWeek; width: number }[];
  headerHeight: number;
  weekHeights: number[];
}

function findMaxDistance(weeks: Week<DayDetails>[]): number[] {
  let maxOfMins = 0;
  let maxOfMaxes = 0;
  let hasRanges = false;

  for (let i = 0; i < weeks.length; i++) {
    const dist = sumWeekDistance(weeks[i]);

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

function calcCumulativeDistances(
  weeks: Week<DayDetails>[],
  units: Units,
): number[][] {
  const result: number[][] = [];
  let runningMin = 0;
  let runningMax = 0;
  let hasRange = false;

  for (const week of weeks) {
    const weekDist = getWeekDistance(week, units);
    if (weekDist.length === 1) {
      runningMin += weekDist[0];
      runningMax += weekDist[0];
    } else if (weekDist.length === 2) {
      runningMin += weekDist[0];
      runningMax += weekDist[1];
      hasRange = true;
    }
    result.push(hasRange ? [runningMin, runningMax] : [runningMax]);
  }

  return result;
}

export const CalendarGrid = ({
  racePlan,
  units,
  weekStartsOn,
  swapDates,
  swapDow,
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);
  // off-screen column replica (drag image); ghostDow is the column it shows
  const ghostRef = useRef<HTMLDivElement>(null);
  const [ghostDow, setGhostDow] = useState<dayOfWeek | null>(null);
  // off-screen card replica (drag image); ghostCard is the card it shows
  const cardGhostRef = useRef<HTMLDivElement>(null);
  const [ghostCard, setGhostCard] = useState<DayDragItem | null>(null);
  // grid geometry for the drag image, re-measured on plan/resize changes
  const [metrics, setMetrics] = useState<GridMetrics | null>(null);
  // the item being dragged (if any); these only change at drag start/end,
  // so this hook never re-renders the grid on pointer moves; the source is
  // dimmed ("lifting") and targets framed (see DayCell, DowColumnIndicator)
  const { draggingDow, draggingDate } = useDragLayer((monitor) => {
    if (!monitor.isDragging()) {
      return { draggingDow: undefined, draggingDate: undefined };
    }
    if (monitor.getItemType() === ItemTypes.DOW) {
      return {
        draggingDow: (monitor.getItem() as DowDragItem).id,
        draggingDate: undefined,
      };
    }
    if (monitor.getItemType() === ItemTypes.DAY) {
      return {
        draggingDow: undefined,
        draggingDate: (monitor.getItem() as DayDragItem).date,
      };
    }
    return { draggingDow: undefined, draggingDate: undefined };
  });

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const rows = Array.from(grid.querySelectorAll<HTMLElement>(".week-grid"));
      const headerRow = rows[0];
      if (!headerRow) return;
      const chips = Array.from(
        headerRow.querySelectorAll<HTMLElement>("[data-dow]"),
      );
      const columns = chips.map((chip) => ({
        dow: chip.dataset.dow as dayOfWeek,
        width: chip.getBoundingClientRect().width,
      }));
      if (columns.length === 0) return;
      setMetrics({
        columns,
        headerHeight: chips[0].getBoundingClientRect().height,
        weekHeights: rows
          .slice(1)
          .map((row) => row.getBoundingClientRect().height),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [gridRef, racePlan, units, weekStartsOn]);

  const maxDistance = findMaxDistance(racePlan.dateGrid.weeks);
  const cumulativeDistances = calcCumulativeDistances(
    racePlan.dateGrid.weeks,
    units,
  );

  // the finish flag's week: the week of the plan's goal race if it has one,
  // otherwise the plan's final week
  const goalRace = racePlan.goalRaceDate;
  const raceWeekNum = goalRace
    ? racePlan.dateGrid.weeks.findIndex((w) =>
        w.days.some((d) => key(d.date) === key(goalRace)),
      )
    : -1;
  const finishWeekNum =
    raceWeekNum >= 0 ? raceWeekNum : racePlan.dateGrid.weekCount - 1;

  function getWeek(w: Week<DayDetails>, cumulativeDistance: number[]) {
    const weekDist = sumWeekDistance(w);

    let isHighestMileage = false;
    if (maxDistance[0] > 0) {
      if (weekDist.length === 1) {
        isHighestMileage =
          maxDistance.length === 1 && weekDist[0] === maxDistance[0];
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
          isFinishWeek={w.weekNum === finishWeekNum}
          isHighestMileage={isHighestMileage}
          cumulativeDistance={cumulativeDistance}
        />
        {w.days.map((d) => {
          // date value, not identity: the drag item may hold another Date
          // instance for the same day
          const dow = format(d.date, "EEEE");
          const sourceLifted =
            draggingDow === dow ||
            (draggingDate !== undefined &&
              draggingDate.getTime() === d.date.getTime());
          return (
            <DayCell
              key={key(d.date)}
              date={d.date}
              units={units}
              swap={swapDates}
              swapDow={swapDow}
              dayDetails={d.event}
              cardGhostRef={cardGhostRef}
              onPrepareDragImage={(item: DayDragItem) => setGhostCard(item)}
              lifting={sourceLifted}
            />
          );
        })}
      </div>
    );
  }

  function getHeader() {
    return (
      <div className="week-grid">
        <div key={"blank-left"} />
        {getDaysHeader(weekStartsOn).map((headerDow) => {
          const dow = headerDow as dayOfWeek;
          return (
            <DayOfWeekHeader
              key={dow}
              dow={dow}
              lifting={draggingDow === dow}
              swapDow={swapDow}
              ghostRef={ghostRef}
              onPrepareDragImage={() => setGhostDow(dow)}
            />
          );
        })}
      </div>
    );
  }

  const ghostColumn =
    (ghostDow && metrics?.columns.find((c) => c.dow === ghostDow)) || null;
  const cardColumn =
    (ghostCard &&
      metrics?.columns.find((c) => c.dow === format(ghostCard.date, "EEEE"))) ||
    null;

  return (
    <div className="calendar-grid" ref={gridRef}>
      {getHeader()}
      {racePlan.dateGrid.weeks.map((w, i) =>
        getWeek(w, cumulativeDistances[i]),
      )}
      <DowColumnIndicator gridRef={gridRef} />
      <DowColumnGhost
        ref={ghostRef}
        dow={ghostDow}
        weeks={racePlan.dateGrid.weeks}
        units={units}
        columnWidth={ghostColumn?.width ?? 0}
        headerHeight={metrics?.headerHeight ?? 0}
        weekHeights={metrics?.weekHeights ?? []}
      />
      <CardGhost
        ref={cardGhostRef}
        card={ghostCard}
        cardWidth={cardColumn?.width ?? 0}
      />
    </div>
  );
};
