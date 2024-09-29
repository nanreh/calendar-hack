import * as React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../ch/ItemTypes";
import { WorkoutCard } from "./WorkoutCard";
import { BlankCard } from "./BlankCard";
import styled from "styled-components";
import { Overlay } from "./Overlay";
import { DayDetails, Units } from "types/app";

interface Props {
  dayDetails: DayDetails | undefined;
  date: Date;
  units: Units;
  swap: (d1: Date, d2: Date) => void;
  selected: boolean;
  hovering: boolean;
}

type DropTargetProps = {
  $isOver: boolean;
  $canDrop: boolean;
};

const DropTarget = styled.div<DropTargetProps>`
  height: 100%;
  opacity: ${(props) => (props.$isOver ? 0.5 : 1)};
`;

export const DayCell = ({
  dayDetails,
  date,
  units,
  swap,
  selected,
  hovering,
}: Props) => {
  function canSwap(d1: Date) {
    return dayDetails !== undefined;
  }

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.DAY,
    canDrop: () => canSwap(date),
    drop: (item: { date: Date }) => {
      swap(date, item.date);
      return;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      droppedItem: monitor.getItem(),
    }),
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <DropTarget $isOver={isOver} $canDrop={canDrop} ref={drop}>
        {dayDetails && (
          <WorkoutCard
            dayDetails={dayDetails}
            date={date}
            units={units}
            swap={swap}
          />
        )}
        {!dayDetails && <BlankCard date={date} />}
        {isOver && !canDrop && <Overlay color="pink" />}
        {isOver && canDrop && <Overlay color="lightgreen" />}

        {dayDetails && selected && <Overlay color="pink" />}
        {dayDetails && !selected && hovering && <Overlay color="lightgreen" />}
      </DropTarget>
    </div>
  );
};
