import React from "react";
import { render } from "../ch/rendering";
import { Dateline } from "./Dateline";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../ch/ItemTypes";
import { DragHandle } from "./DragHandle";
import type { DayDetails, Units } from "types/app";

interface Props {
  dayDetails: DayDetails;
  date: Date;
  units: Units;
  swap: (d1: Date, d2: Date) => void;
}

function renderDesc(
  dayDetails: DayDetails,
  from: Units,
  to: Units,
): React.ReactElement {
  const [title, rawDesc] = render(dayDetails, from, to);
  // Only render the description if it differs from the title
  // In the ical file we always render both and we automatically render the description using the same text as title if description is empty
  const desc =
    title.replace(/\s/g, "") === rawDesc.replace(/\s/g, "") ? "" : rawDesc;
  return (
    <>
      <p>
        <span className="workout-title">{title}</span>
      </p>
      {desc && (
        <p>
          <span className="workout-description">{desc}</span>
        </p>
      )}
    </>
  );
}

export const WorkoutCard = ({ dayDetails, date, units }: Props) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.DAY,
    item: { date: date, dayDetails: dayDetails, units: units },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: dayDetails !== undefined,
    }),
  });

  return (
    <div
      ref={(node) => {
        preview(node);
      }}
      className={`workout-card ${isDragging ? "dragging" : ""}`}
    >
      <Dateline $date={date} />
      <div className="workout-content">
        <div
          ref={(node) => {
            drag(node);
          }}
        >
          <DragHandle viewBox="0 0 32 36" />
        </div>
        {renderDesc(dayDetails, dayDetails.sourceUnits, units)}
      </div>
    </div>
  );
};
