import React from "react";
import { render } from "../ch/rendering";
import { Card, Content } from "./WorkoutUx";
import { Dateline } from "./Dateline";
import styled from "styled-components";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { ItemTypes } from "../ch/ItemTypes";
import { DragHandle } from "./DragHandle";
import { DayDetails, Units } from "types/app";

interface Props {
  dayDetails: DayDetails;
  date: Date;
  units: Units;
  swap: (d1: Date, d2: Date) => void;
}

type DragSourceProps = {
  $isDragging: boolean;
  $dayDetails: DayDetails | undefined;
};

const DragSource = styled.div<DragSourceProps>`
  height: 100%;
`;

function renderDesc(dayDetails: DayDetails, from: Units, to: Units): string {
  let [title, desc] = render(dayDetails, from, to);
  return title + "\n" + desc;
}

export const WorkoutCard = ({ dayDetails, date, units }: Props) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.DAY,
    item: { date: date, dayDetails: dayDetails, units: units },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: dayDetails !== undefined,
    }),
    end: (item: { date: Date } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
      }
    },
  });

  return (
    <DragSource
      $isDragging={isDragging}
      $dayDetails={dayDetails}
      ref={preview}
    >
      <Card $isDragging={isDragging}>
          <Dateline dayDetails={dayDetails} units={units} date={date} />
          <Content>
            <div ref={drag}>
              <DragHandle viewBox="0 0 32 36" />
            </div>
            <p>{renderDesc(dayDetails, dayDetails.sourceUnits, units)}</p>
          </Content>
      </Card>
    </DragSource>
  );
};
