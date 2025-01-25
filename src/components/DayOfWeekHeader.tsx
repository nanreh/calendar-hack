import { DragHandle } from "./DragHandle";
import { useDrop, useDrag } from "react-dnd";
import { ItemTypes } from "../ch/ItemTypes";
import { dayOfWeek } from "types/app";

interface Props {
  dow: dayOfWeek;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
  setSelectedDow: (dow: dayOfWeek | undefined) => void;
  setHoveringDow: (dow: dayOfWeek | undefined) => void;
}

export const DayOfWeekHeader = ({
  dow,
  swapDow,
  setSelectedDow,
  setHoveringDow,
}: Props) => {
  const canSwapWith = (other: dayOfWeek) => {
    return dow !== other;
  };

  // TODO Things are structurally awkward here. We're dragging + dropping these headers but we need to
  // send state "updwards" so the UI can draw itself. Restructure to clean this up.
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.DOW,
    item: { id: dow },
    end: () => {
      setSelectedDow(undefined);
      setHoveringDow(undefined);
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  //const [{ isOver, canDrop }, drop] = useDrop({
  const [{}, drop] = useDrop({
    accept: ItemTypes.DOW,
    canDrop: (item: { id: dayOfWeek }) => canSwapWith(item.id),
    drop: (item: { id: dayOfWeek }) => {
      swapDow(dow, item.id);
    },
    collect: (monitor) => {
      if (monitor.isOver()) {
        if (monitor.canDrop()) {
          setHoveringDow(dow);
        } else {
          setSelectedDow(dow);
          setHoveringDow(undefined);
        }
      }
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  return (
    <div className={`week-header ${isDragging ? "dragging" : ""}`}>
      <div ref={drop}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div ref={dragPreview}>
            <div className="day-header" ref={drag}>
              <DragHandle viewBox="0 0 32 36" />
              <div>{dow}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
