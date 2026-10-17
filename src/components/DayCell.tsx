import type { RefObject } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes, type DayDragItem, type DragItem } from "../ch/ItemTypes";
import { format } from "date-fns";
import { WorkoutCard } from "./WorkoutCard";
import { BlankCard } from "./BlankCard";
import type { DayDetails, Units, dayOfWeek } from "types/app";

interface Props {
  dayDetails: DayDetails | undefined;
  date: Date;
  units: Units;
  swap: (d1: Date, d2: Date) => void;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
  // shared off-screen card replica (CardGhost) and a callback to make it
  // show this cell's card before the drag starts; forwarded from
  // CalendarGrid to WorkoutCard
  cardGhostRef: RefObject<HTMLDivElement | null>;
  onPrepareDragImage: (item: DayDragItem) => void;
  // true while this cell (or, for DOW drags, its whole column) is the
  // source of the drag in progress; the source is dimmed, never framed
  lifting: boolean;
}

export const DayCell = ({
  dayDetails,
  date,
  units,
  swap,
  swapDow,
  cardGhostRef,
  onPrepareDragImage,
  lifting,
}: Props) => {
  const thisDow = format(date, "EEEE") as dayOfWeek;

  function canDropItem(item: DragItem) {
    if ("date" in item) {
      // date value, not identity: the drag item may hold another Date
      // instance for the same day
      return dayDetails !== undefined && date.getTime() !== item.date.getTime();
    }
    return item.id !== thisDow;
  }

  const [{ isOver, canDrop, itemType }, drop] = useDrop({
    accept: [ItemTypes.DAY, ItemTypes.DOW],
    canDrop: canDropItem,
    drop: (item: DragItem) => {
      if ("date" in item) {
        swap(date, item.date);
      } else {
        swapDow(thisDow, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
    }),
  });

  // frame the hovered cell while a card (not a column) is dragged, except
  // over the source cell itself; column drags are framed by the
  // DowColumnIndicator instead
  const showFrame = itemType === ItemTypes.DAY && isOver && !lifting;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className={`day-cell ${lifting ? "lifting" : ""}`}
        ref={(node) => {
          drop(node);
        }}
      >
        {dayDetails && (
          <WorkoutCard
            dayDetails={dayDetails}
            date={date}
            units={units}
            cardGhostRef={cardGhostRef}
            onPrepareDragImage={onPrepareDragImage}
          />
        )}
        {!dayDetails && <BlankCard date={date} />}
        {showFrame && (
          <div className={`drop-frame ${canDrop ? "" : "blocked"}`} />
        )}
      </div>
    </div>
  );
};
