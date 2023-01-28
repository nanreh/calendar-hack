import * as React from "react";
import styled from "styled-components";
import { dayOfWeek } from "../ch/dategrid";
import { DragHandle } from "./DragHandle";
import { useDrop, useDrag, DragSourceMonitor } from "react-dnd";
import ItemTypes from "../ch/ItemTypes";
import { Preview, PreviewGenerator } from "react-dnd-multi-backend";

interface Props {
  dow: dayOfWeek;
  swapDow: (dow1: dayOfWeek, dow2: dayOfWeek) => void;
  selectDow: (dow: dayOfWeek | undefined) => void;
  hoverDow: (dow: dayOfWeek | undefined) => void;
}

const Root = styled.div`
  svg {
    width: 1em;
  }
  div {
    text-align: center;
    width: 100%;
  }
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-content: stretch;
  align-items: center;
  padding: 2px 4px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.colors.dowHeaderBg};
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    display: none;
  }
`;

type DragSourceProps = {
  isDragging: boolean;
  dow: dayOfWeek;
};
const DragSource = styled.div<DragSourceProps>`
  height: 100%;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;

type DropTargetProps = {
  isOver: boolean;
  canDrop: boolean;
};
const DropTarget = styled.div<DropTargetProps>`
  height: 100%;
  opacity: ${(props) => (props.isOver ? 0.5 : 1)};
`;

const generateDowPreview: PreviewGenerator = ({ itemType, item, style }) => {
  return (
    <div
      style={{
        ...style,
      }}
    >
      <Root>
        <DragHandle viewBox="0 0 32 36" />
        <div>{item.dow}</div>
      </Root>
    </div>
  );
};

export const DayOfWeekHeader: React.FC<Props> = ({
  dow,
  swapDow,
  selectDow,
  hoverDow,
}) => {
  const [{ isOver, canDrop, droppedItem }, drop] = useDrop({
    accept: ItemTypes.DOW,
    canDrop: () => true,
    drop: () => {
      swapDow(dow, droppedItem.dow);
      return;
    },
    collect: (monitor) => {
      if (monitor.isOver()) {
        hoverDow(dow);
      }
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        droppedItem: monitor.getItem(),
      };
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.DOW, dow: dow },
    collect: (monitor) => {
      if (monitor.isDragging()) {
        selectDow(dow);
      }
      return {
        isDragging: monitor.isDragging(),
      };
    },
    begin: (monitor: DragSourceMonitor) => {
      selectDow(dow);
    },
    end: (item: { dow: dayOfWeek } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        selectDow(undefined);
        hoverDow(undefined);
      }
    },
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <DragSource isDragging={isDragging} dow={dow}>
        <DropTarget isOver={isOver} canDrop={canDrop} ref={drop}>
          <Preview generator={generateDowPreview} />
          <div ref={preview}>
            <Root ref={drag}>
              <DragHandle viewBox="0 0 32 36" />
              <div>{dow}</div>
            </Root>
          </div>
        </DropTarget>
      </DragSource>
    </div>
  );
};
