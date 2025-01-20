import { format } from "../ch/localize";

interface Props {
  $date: Date;
  $blank?: boolean;
}

export const Dateline = ({ $date, $blank }: Props) => {
  return (
    <>
      <div className="dateline">
        {format($date)}
      </div>
    </>
  );
};
