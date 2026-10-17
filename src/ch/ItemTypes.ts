import type { dayOfWeek, Units, DayDetails } from "types/app";

export const ItemTypes = {
  DAY: "DAY",
  DOW: "DOW",
  WEEK: "WEEK",
};

// the items carried by each drag type
export type DayDragItem = {
  date: Date;
  dayDetails: DayDetails;
  units: Units;
};
export type DowDragItem = { id: dayOfWeek };
export type DragItem = DayDragItem | DowDragItem;
