import { Dateline } from "./Dateline";

export const BlankCard = ({ date }: { date: Date }) => {
  return (
    <div className="blank-card">
      <Dateline $date={date} />
      <div className="blank-content" />
    </div>
  );
};
