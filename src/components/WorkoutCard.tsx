import type {
  PointerEvent as ReactPointerEvent,
  ReactElement,
  RefObject,
} from "react";
import { render } from "../ch/rendering";
import { Dateline } from "./Dateline";
import { useDrag } from "react-dnd";
import { ItemTypes, type DayDragItem } from "../ch/ItemTypes";
import { DragHandle } from "./DragHandle";
import type { DayDetails, Units } from "types/app";

interface Props {
  dayDetails: DayDetails;
  date: Date;
  units: Units;
  // shared off-screen card replica (CardGhost) and a callback to make it
  // show this card before the drag starts; forwarded from CalendarGrid
  // via DayCell
  cardGhostRef: RefObject<HTMLDivElement | null>;
  onPrepareDragImage: (item: DayDragItem) => void;
}

interface ViewProps {
  dayDetails: DayDetails;
  date: Date;
  units: Units;
  dragRef?: (node: HTMLDivElement | null) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

function renderDesc(
  dayDetails: DayDetails,
  from: Units,
  to: Units,
): ReactElement {
  const [title, rawDesc] = render(dayDetails, from, to);
  // Only render the description if it differs from the title
  // In the ical file we always render both and we automatically render the description with the same text as title if description is empty
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

/**
 * Presentational view of a workout card without any drag-and-drop hooks.
 * Used by the off-screen drag images (DowColumnGhost, CardGhost), where
 * registering nested drag sources would be pointless.
 */
export const WorkoutCardView = ({
  dayDetails,
  date,
  units,
  dragRef,
  onPointerDown,
}: ViewProps) => {
  return (
    <div className="workout-card" onPointerDown={onPointerDown}>
      <Dateline $date={date} />
      <div className="workout-content">
        <div ref={dragRef}>
          <DragHandle viewBox="0 0 32 36" />
        </div>
        {renderDesc(dayDetails, dayDetails.sourceUnits, units)}
      </div>
    </div>
  );
};

export const WorkoutCard = ({
  dayDetails,
  date,
  units,
  cardGhostRef,
  onPrepareDragImage,
}: Props) => {
  const [, drag, preview] = useDrag({
    type: ItemTypes.DAY,
    item: { date: date, dayDetails: dayDetails, units: units },
  });

  // the drag image is an off-screen replica (CardGhost), not this live
  // node: after a few drop/re-render cycles the browser may snapshot the
  // live node with stale (blank) layers, while the replica is always
  // freshly painted
  function onGrab(e: ReactPointerEvent<HTMLDivElement>) {
    const ghost = cardGhostRef.current;
    if (!ghost) return;
    // make the replica show this card; the update is committed before the
    // browser paints, i.e. before the drag image is snapshotted
    onPrepareDragImage({ date: date, dayDetails: dayDetails, units: units });
    const rect = e.currentTarget.getBoundingClientRect();
    // (offsetX, offsetY) is the image point placed under the cursor;
    // "cursor minus the card top-left" overlays the replica exactly on the
    // place the real card just occupied
    preview(ghost, {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  }

  return (
    <WorkoutCardView
      dayDetails={dayDetails}
      date={date}
      units={units}
      dragRef={drag}
      onPointerDown={onGrab}
    />
  );
};
