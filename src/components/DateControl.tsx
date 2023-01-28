import React from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/esm/locale";
import { Button } from "./Button";

interface Props {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
}
interface ButtonProps {
  value: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

registerLocale("enGB", enGB);

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
class DateInputButton extends React.Component<ButtonProps> {
  render() {
    return (
      <Button onClick={this.props.onClick}>
        <span>{this.props.value}</span>
      </Button>
    );
  }
}

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
export class DateControl extends React.Component<Props> {
  private input = (
    <DateInputButton
      value="Date"
      onClick={(e: React.MouseEvent<HTMLElement>) => {}}
    />
  );
  render() {
    const { selectedDate, onDateChanged } = this.props;
    return (
      <DatePicker
        selected={selectedDate}
        onChange={onDateChanged}
        locale="enGB"
        customInput={this.input}
      />
    );
  }
}
