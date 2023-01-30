import * as React from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { DayDetails } from "../ch/models";
import { Units } from "../defy/models";

export const DatelineStyle = styled.div`
  text-align: center;
  background-color: ${(props) => props.theme.colors.datelineBg};
  color: ${(props) => props.theme.colors.datelineTxt};
  font-weight: 700;
  font-size: 0.8em;
  border-radius: 0.25rem 0.25rem 0 0;
`;

interface DatelineProps {
  dayDetails: DayDetails;
  date: Date;
  units: Units;
}

export const Dateline: React.FC<DatelineProps> = ({
  dayDetails,
  date,
  units,
}) => {
  return (
    <>
      <DatelineStyle>{format(date, "M/d/yyyy")}</DatelineStyle>
    </>
  );
};
