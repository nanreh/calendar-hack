import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { WeekStartsOn } from "../ch/datecalc";
import { format } from "../ch/localize";

interface Props {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
  weekStartsOn: WeekStartsOn;
}
interface ButtonProps {
  selectedDate: Date;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
class DateInputButton extends React.Component<ButtonProps> {
  render() {
    if (!this.props.selectedDate) {
      return <p></p>;
    }
    return (
      <button className="app-button" onClick={this.props.onClick}>
        <span>{format(this.props.selectedDate)}</span>
      </button>
    );
  }
}

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
export class DateControl extends React.Component<Props> {
  render() {
    const input = (
      <DateInputButton
        selectedDate={this.props.selectedDate}
        onClick={() => {}}
      />
    );

    const { selectedDate, onDateChanged, weekStartsOn } = this.props;
    return (
      <div className="date-picker-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={onDateChanged}
          dateFormat="P"
          customInput={input}
          calendarStartDay={weekStartsOn}
        />
      </div>
    );
  }
}
