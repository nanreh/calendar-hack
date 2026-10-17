import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { WeekStartsOn } from "../ch/datecalc";
import { format } from "../ch/localize";

interface Props {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
  weekStartsOn: WeekStartsOn;
}
interface ButtonProps {
  selectedDate: Date;
  // injected by DatePicker when this is used as its customInput
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

const DateInputButton = ({ selectedDate, onClick, ref }: ButtonProps) => {
  if (!selectedDate) {
    return <p></p>;
  }
  return (
    <button className="app-button" onClick={onClick} ref={ref}>
      <span>{format(selectedDate)}</span>
    </button>
  );
};

export const DateControl = ({
  selectedDate,
  onDateChanged,
  weekStartsOn,
}: Props) => {
  return (
    <div className="date-picker-wrapper">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => date && onDateChanged(date)}
        dateFormat="P"
        customInput={<DateInputButton selectedDate={selectedDate} />}
        calendarStartDay={weekStartsOn}
      />
    </div>
  );
};
