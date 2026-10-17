import type { CSSProperties, RefObject } from "react";
import { useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";
import { ItemTypes, type DowDragItem } from "../ch/ItemTypes";
import type { dayOfWeek } from "types/app";

interface ColumnRange {
  dow: dayOfWeek;
  left: number;
  width: number;
}

interface GridGeometry {
  // the day-of-week columns, sorted left to right (viewport px)
  columns: ColumnRange[];
  top: number;
  bottom: number;
}

/**
 * Drop-target frame for day-of-week column drags — the only part of the
 * grid that reacts to cursor movement. The target flips only at the exact
 * midpoint between neighboring columns, so steady-state re-renders are
 * no-ops and the frame never flickers.
 */
export const DowColumnIndicator = ({
  gridRef,
}: {
  gridRef: RefObject<HTMLDivElement | null>;
}) => {
  const { isDowDrag, draggingDow, clientOffset } = useDragLayer((monitor) => {
    const isDowDrag =
      monitor.isDragging() && monitor.getItemType() === ItemTypes.DOW;
    return {
      isDowDrag,
      draggingDow: isDowDrag ? (monitor.getItem() as DowDragItem).id : null,
      clientOffset: monitor.getClientOffset(),
    };
  });

  const [geometry, setGeometry] = useState<GridGeometry | null>(null);

  // measure the grid once per drag
  useEffect(() => {
    if (!isDowDrag || !gridRef.current) {
      setGeometry(null);
      return;
    }
    if (geometry) {
      // already measured for this drag
      return;
    }
    const rows = Array.from(
      gridRef.current.querySelectorAll<HTMLElement>(".week-grid"),
    );
    const headerRow = rows[0];
    if (!headerRow) return;
    const headerRect = headerRow.getBoundingClientRect();
    const columns = Array.from(
      headerRow.querySelectorAll<HTMLElement>("[data-dow]"),
    ).map((chip) => {
      const rect = chip.getBoundingClientRect();
      return {
        dow: chip.dataset.dow as dayOfWeek,
        left: rect.left,
        width: rect.width,
      };
    });
    if (columns.length === 0) return;
    columns.sort((a, b) => a.left - b.left);
    const bottom = rows
      .slice(1)
      .map((row) => row.getBoundingClientRect().bottom)
      .reduce((max, b) => Math.max(max, b), headerRect.bottom);
    setGeometry({
      columns,
      top: headerRect.top,
      bottom,
    });
  }, [isDowDrag, geometry, gridRef]);

  // which column is the drop target: the columns are tiled with boundaries
  // at the midpoints between neighbors, so the target only flips at real
  // boundaries
  let target: ColumnRange | null = null;
  if (isDowDrag && draggingDow && clientOffset && geometry) {
    const { columns, top, bottom } = geometry;
    const { x, y } = clientOffset;
    const slack = 16; // the cursor usually floats a bit outside the grid
    const first = columns[0];
    const last = columns[columns.length - 1];
    if (
      x >= first.left &&
      x <= last.left + last.width &&
      y >= top - slack &&
      y <= bottom + slack
    ) {
      target = first;
      for (let i = 1; i < columns.length; i++) {
        const prev = columns[i - 1];
        const mid = (prev.left + prev.width + columns[i].left) / 2;
        if (x >= mid) {
          target = columns[i];
        } else {
          break;
        }
      }
      // dropping on the source column itself is a no-op, so don't frame it
      if (target.dow === draggingDow) {
        target = null;
      }
    }
  }

  const style: CSSProperties =
    target && geometry
      ? {
          left: target.left - 3,
          top: geometry.top - 3,
          width: target.width + 6,
          height: geometry.bottom - geometry.top + 6,
          visibility: "visible" as const,
          opacity: 1,
        }
      : {
          visibility: "hidden" as const,
          opacity: 0,
        };

  // the node stays mounted so the CSS transition can slide it from one
  // column to the next (re-mounting would kill the animation)
  return <div className="dow-target" style={style} />;
};
