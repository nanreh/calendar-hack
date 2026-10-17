import type { Ref } from "react";
import { WorkoutCardView } from "./WorkoutCard";
import type { DayDragItem } from "../ch/ItemTypes";

interface Props {
  // the parent registers this node as the native drag image
  ref: Ref<HTMLDivElement>;
  // the card to render (null until a card is grabbed)
  card: DayDragItem | null;
  // width of the grid column the card sits in (measured by CalendarGrid),
  // so the replica matches the on-screen card
  cardWidth: number;
}

/**
 * Off-screen replica of the card being dragged. WorkoutCard registers it
 * as the native drag image on grab, so the browser moves a full-card
 * image with the cursor. It must stay laid out (not display:none /
 * zero-size) or the browser cannot snapshot it; it is moved off-screen
 * instead (see .card-ghost).
 */
export const CardGhost = ({ ref, card, cardWidth }: Props) => {
  return (
    <div ref={ref} className="card-ghost" style={{ width: cardWidth }}>
      {card && (
        <WorkoutCardView
          dayDetails={card.dayDetails}
          date={card.date}
          units={card.units}
        />
      )}
    </div>
  );
};
