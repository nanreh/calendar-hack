import React from "react";
import { Units } from "../defy/models";
import { DayDetails } from "../ch/models";
import { render } from "../ch/rendering";
import { Card, Content } from "./WorkoutUx";
import { Dateline } from "./Dateline";
import styled from "styled-components";
import { useDrag, DragSourceMonitor } from "react-dnd";
import ItemTypes from "../ch/ItemTypes";
import { DragHandle } from "./DragHandle";
import { Preview, PreviewGenerator } from "react-dnd-multi-backend";
import { RacePlanContext } from "../context/planContext";

export interface WorkoutCardProps {
  dayDetails: DayDetails;
  updateDayDetails: (dayDetails: DayDetails) => void;
  date: Date;
  units: Units;
}

type DragSourceProps = {
  isDragging: boolean;
  dayDetails: DayDetails | undefined;
};

const DragSource = styled.div<DragSourceProps>`
  height: 100%;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;

const TextArea = styled.textarea`
  width: 100%;
`;

function renderDesc(dayDetails: DayDetails, from: Units, to: Units): string {
  let [title, desc] = render(dayDetails, from, to);
  return title + "\n" + desc;
}

const generateDayPreview: PreviewGenerator = ({ itemType, item, style }) => {
  return (
    <div
      style={{
        ...style,
      }}
    >
      <Content>
        <DragHandle viewBox="0 0 32 36" />
        <p>
          {renderDesc(item.dayDetails, item.dayDetails.sourceUnits, item.units)}
        </p>
      </Content>
    </div>
  );
};

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  dayDetails,
  updateDayDetails,
  date,
  units,
}) => {
  const rpContext = React.useContext(RacePlanContext);
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      date: date,
      type: ItemTypes.DAY,
      dayDetails: dayDetails,
      units: units,
    },
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
  let [title, desc] = render(dayDetails, dayDetails.sourceUnits, units);

  return (
    <Card>
      <Dateline dayDetails={dayDetails} units={units} date={date} />
      <DragSource isDragging={isDragging} dayDetails={dayDetails} ref={preview}>
        <Preview generator={generateDayPreview} />
        <Content>
          <div ref={drag}>
            <DragHandle viewBox="0 0 32 36" />
          </div>
          {rpContext?.isEditing && (
            <>
              <TextArea
                value={title}
                onChange={(v) =>
                  updateDayDetails({
                    ...dayDetails,
                    title: v.target.value,
                  })
                }
              />
              {desc && (
                <TextArea
                  value={desc}
                  onChange={(v) =>
                    updateDayDetails({
                      ...dayDetails,
                      desc: v.target.value,
                    })
                  }
                />
              )}
            </>
          )}
          {!rpContext?.isEditing && (
            <p>{render(dayDetails, dayDetails.sourceUnits, units)}</p>
          )}
        </Content>
      </DragSource>
    </Card>
  );
};
