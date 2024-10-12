import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button";
import { WeekStartsOn } from "../ch/datecalc";
import { format } from "../ch/localize";

interface Props {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
  weekStartsOn: WeekStartsOn
}
interface ButtonProps {
  selectedDate: Date;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const DatePickerWrapper = styled.div`
  z-index: 1000;
`;

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
class DateInputButton extends React.Component<ButtonProps> {
  render() {
        if (!this.props.selectedDate ) {
            return <p></p>;
        }
        return (
          <Button onClick={this.props.onClick}>
            <span>{format(this.props.selectedDate)}</span>
          </Button>
        );
  }
}

// using a class component to avoid "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
export class DateControl extends React.Component<Props> {

  render() {
    const input = (
      <DateInputButton
        selectedDate={this.props.selectedDate}
        onClick={(e: React.MouseEvent<HTMLElement>) => {}}
      />
    );

    const { selectedDate, onDateChanged, weekStartsOn } = this.props;
    return (
      <DatePickerWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChanged}
          dateFormat="P"
          customInput={input}
          calendarStartDay={weekStartsOn}
        />
      </DatePickerWrapper>
    );
  }
}
