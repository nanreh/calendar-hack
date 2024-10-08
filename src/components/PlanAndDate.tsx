import React from "react";
import styled from "styled-components";
import { DateControl } from "./DateControl";
import PlanPicker from "./PlanPicker";
import { Units, PlanSummary } from "types/app";
import { WeekStartsOn } from "../ch/datecalc";

interface Props {
  units: Units;
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  selectedDate: Date;
  dateChangeHandler: (d: Date) => void;
  selectedPlanChangeHandler: (p: PlanSummary) => void;
  unitsChangeHandler: (u: Units) => void;
  downloadHandler: () => void;
  weekStartsOn: WeekStartsOn;
}

const Title = styled.h3`
  display: inline;
  margin: 0 0.4em;
  color: ${(props) => props.theme.colors.buttonBg};
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em 0 5px 0;
  color: ${(props) => props.theme.colors.controlsTitle};
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    flex-direction: column;
  }
`;

const PlanAndDate = ({
  selectedPlan,
  selectedPlanChangeHandler,
  availablePlans,
  selectedDate,
  dateChangeHandler,
  weekStartsOn,
}: Props) => {
  return (
    <Root>
      <PlanPicker
        availablePlans={availablePlans}
        selectedPlan={selectedPlan}
        planChangeHandler={selectedPlanChangeHandler}
      />
      <Title>ending on</Title>
      <DateControl
        selectedDate={selectedDate}
        onDateChanged={dateChangeHandler}
        weekStartsOn={weekStartsOn}
      />
    </Root>
  );
};

export default PlanAndDate;
