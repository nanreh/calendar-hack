import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import { Button } from "./Button";
import { WeekStartsOn } from "../ch/datecalc";

interface Props {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
  weekStartsOn: WeekStartsOn
}
interface ButtonProps {
  value: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

registerLocale("enGB", enGB);

export const DatePickerWrapper = styled.div`
  z-index: 1000;
`;

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
    const { selectedDate, onDateChanged, weekStartsOn } = this.props;
    return (
      <DatePickerWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChanged}
          locale="enGB"
          customInput={this.input}
          calendarStartDay={weekStartsOn}
        />
      </DatePickerWrapper>
    );
  }
}
