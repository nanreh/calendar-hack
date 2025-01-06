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

const Title = styled.span`
  font-weight: 700;
  font-size: 1em;
`;

const Description = styled.span`
  font-weight: 400;
  font-size: 0.8em;
`;

const DragSource = styled.div<DragSourceProps>`
  height: 100%;
`;

function renderDesc(
  dayDetails: DayDetails,
  from: Units,
  to: Units,
): React.ReactElement {
  let [title, desc] = render(dayDetails, from, to);
  // Only render the description if it differs from the title
  // In the ical file we always render both and we automatically render the description using the same text as title if description is empty
  if (title.replace(/\s/g, "") === desc.replace(/\s/g, "")) {
    return (
      <p>
        <Title>{title}</Title>
      </p>
    );
  }
  return (
    <>
      <p>
        <Title>{title}</Title>
      </p>
      <p>
        <Description>{desc}</Description>
      </p>
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
    end: (item: { date: Date } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
      }
    },
  });

  return (
    <DragSource $isDragging={isDragging} $dayDetails={dayDetails} ref={preview}>
      <Card $isDragging={isDragging}>
        <Dateline $date={date} />
        <Content>
          <div ref={drag}>
            <DragHandle viewBox="0 0 32 36" />
          </div>
          {renderDesc(dayDetails, dayDetails.sourceUnits, units)}
        </Content>
      </Card>
    </DragSource>
  );
};
