import React from "react";
import styled from "styled-components";
import { DateControl } from "./DateControl";
import { Units } from "../defy/models";
import PlanPicker from "./PlanPicker";
import { AvailablePlan } from "../ch/planrepo";

interface Props {
  units: Units;
  availablePlans: AvailablePlan[];
  selectedPlan: AvailablePlan;
  selectedDate: Date;
  dateChangeHandler: (d: Date) => void;
  selectedPlanChangeHandler: (p: AvailablePlan) => void;
  unitsChangeHandler: (u: Units) => void;
  downloadHandler: () => void;
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

const PlanAndDate: React.FC<Props> = ({
  units,
  unitsChangeHandler,
  selectedPlan,
  selectedPlanChangeHandler,
  availablePlans,
  selectedDate,
  dateChangeHandler,
  downloadHandler,
}) => {
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
      />
    </Root>
  );
};

export default PlanAndDate;
