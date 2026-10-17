import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useDrop, useDrag } from "react-dnd";
import { DragHandle } from "./DragHandle";
import { ItemTypes, type DowDragItem } from "../ch/ItemTypes";
import type { dayOfWeek } from "types/app";

interface Props {
  dow: dayOfWeek;
  // true while this column is the drag source (shown dimmed/lifted)
  lifting: boolean;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
  // shared off-screen column replica (DowColumnGhost) and a callback that
  // makes it show this column before the drag starts
  ghostRef: RefObject<HTMLDivElement | null>;
  onPrepareDragImage: () => void;
}

export const DayOfWeekHeader = ({
  dow,
  lifting,
  swapDow,
  ghostRef,
  onPrepareDragImage,
}: Props) => {
  // preview() is wired up in onGrab: the drag image is a full-column
  // off-screen replica, not just the header chip
  const [, drag, preview] = useDrag({
    type: ItemTypes.DOW,
    item: { id: dow },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.DOW,
    canDrop: (item: DowDragItem) => item.id !== dow,
    drop: (item: DowDragItem) => {
      swapDow(dow, item.id);
    },
  });

  const chipRef = useRef<HTMLDivElement>(null);

  function onGrab(e: ReactPointerEvent<HTMLDivElement>) {
    const chip = chipRef.current;
    const ghost = ghostRef.current;
    if (!chip || !ghost) return;
    // make the replica show this column; the update is committed before the
    // browser paints, i.e. before the drag image is snapshotted
    onPrepareDragImage();
    const rect = chip.getBoundingClientRect();
    // (offsetX, offsetY) is the image point placed under the cursor;
    // "cursor minus the column top-left" overlays the replica exactly on
    // the place the real column just occupied
    preview(ghost, {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  }

  return (
    <div className={`week-header ${lifting ? "lifting" : ""}`}>
      <div
        ref={(node) => {
          drop(node);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="day-header"
          data-dow={dow}
          ref={(node) => {
            drag(node);
            chipRef.current = node;
          }}
          onPointerDown={onGrab}
        >
          <DragHandle viewBox="0 0 32 36" />
          <div>{dow}</div>
        </div>
      </div>
    </div>
  );
};
