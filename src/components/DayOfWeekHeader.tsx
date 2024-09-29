import * as React from "react";
import styled from "styled-components";
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
  $isDragging: boolean;
  $dow: dayOfWeek;
};

const DragSource = styled.div<DragSourceProps>`
  height: 100%;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`;

type DropTargetProps = {
  $isOver: boolean;
  $canDrop: boolean;
};

const DropTarget = styled.div<DropTargetProps>`
  height: 100%;
  opacity: ${(props) => (props.$isOver ? 0.5 : 1)};
`;

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

  const [{ isOver, canDrop }, drop] = useDrop({
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
    <DragSource $isDragging={isDragging} $dow={dow}>
      <DropTarget $isOver={isOver} $canDrop={canDrop} ref={drop}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div ref={dragPreview}>
            <Root ref={drag}>
              <DragHandle viewBox="0 0 32 36" />
              <div>{dow}</div>
            </Root>
          </div>
        </div>
      </DropTarget>
    </DragSource>
  );
};
