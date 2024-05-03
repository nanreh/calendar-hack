import React from "react";
import { Units } from "@/defy/models";
import { DayDetails } from "@/ch/models";
import { render } from "@/ch/rendering";
import { Card, Content } from "./WorkoutUx";
import { Dateline } from "./Dateline";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import ItemTypes from "../ch/ItemTypes";
import { DragHandle } from "./DragHandle";

// import { Preview, PreviewGenerator } from "react-dnd-multi-backend";

export interface WorkoutCardProps {
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
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`;

function renderDesc(dayDetails: DayDetails, from: Units, to: Units): string {
  let [title, desc] = render(dayDetails, from, to);
  return title + "\n" + desc;
}

// const generateDayPreview: PreviewGenerator = ({ itemType, item, style }) => {
//   return (
//     <div
//       style={{
//         ...style,
//       }}
//     >
//       <Content>
//         <DragHandle viewBox="0 0 32 36" />
//         <p>
//           {renderDesc(item.dayDetails, item.dayDetails.sourceUnits, item.units)}
//         </p>
//       </Content>
//     </div>
//   );
// };

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  dayDetails,
  date,
  units,
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.DAY,
    item: () => {
      if (!dayDetails) {
        return null; // cancel the drag operation if dayDetails is undefined
      }
      return {
        date: date,
        dayDetails: dayDetails,
        units: units,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card>
      <Dateline dayDetails={dayDetails} units={units} date={date} />
      <DragSource
        $isDragging={isDragging}
        $dayDetails={dayDetails}
        ref={preview}
      >
        {/*<Preview generator={generateDayPreview} />*/}
        <Content>
          <div ref={drag}>
            <DragHandle viewBox="0 0 32 36" />
          </div>
          <p>{renderDesc(dayDetails, dayDetails.sourceUnits, units)}</p>
        </Content>
      </DragSource>
    </Card>
  );
};
