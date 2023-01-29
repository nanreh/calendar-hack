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

const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
`;
const UnitWrapper = styled.div`
  display: flex;
  gap: 2px;
  justify-items: center;
`;
const UnitInput = styled.input.attrs({ type: "number" })`
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
            <EditWrapper>
              <UnitWrapper>
                <UnitInput
                  type="number"
                  value={dayDetails.dist}
                  onChange={(v) =>
                    updateDayDetails({
                      ...dayDetails,
                      dist: v.target.value ? Number(v.target.value) : undefined,
                    })
                  }
                />
                <span>{dayDetails.sourceUnits}</span>
              </UnitWrapper>
              <TextArea
                value={dayDetails.title}
                onChange={(v) =>
                  updateDayDetails({
                    ...dayDetails,
                    title: v.target.value,
                  })
                }
              />
              {dayDetails.desc && (
                <TextArea
                  value={dayDetails.desc}
                  onChange={(v) =>
                    updateDayDetails({
                      ...dayDetails,
                      desc: v.target.value,
                    })
                  }
                />
              )}
            </EditWrapper>
          )}
          {!rpContext?.isEditing && (
            <p>{render(dayDetails, dayDetails.sourceUnits, units)}</p>
          )}
        </Content>
      </DragSource>
    </Card>
  );
};
