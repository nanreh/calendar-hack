import { format } from "../ch/localize";

interface Props {
  $date: Date;
}

export const Dateline = ({ $date }: Props) => {
  return (
    <>
      <div className="dateline">
        {format($date)}
      </div>
    </>
  );
};
