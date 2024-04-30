import React from "react";
import styled from "styled-components";
import { DateControl } from "./DateControl";
import { Units } from "@/defy/models";
import PlanPicker from "./PlanPicker";
import { AvailablePlan } from "@/ch/planrepo";

interface Props {
  units: Units;
  availablePlans: AvailablePlan[];
  selectedPlan?: AvailablePlan;
  selectedDate: Date;
  dateChangeHandler: (d: Date) => void;
  selectedPlanChangeHandler: (p: AvailablePlan | undefined) => void;
  unitsChangeHandler: (u: Units) => void;
  downloadHandler: () => void;
}

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
    <div className="flex items-center justify-center gap-5 w-full">
      <PlanPicker
        availablePlans={availablePlans}
        selectedPlan={selectedPlan}
        planChangeHandler={selectedPlanChangeHandler}
      />
      <h3 className="px-3 inline m-0.4 text-gray-500 dark:text-gray-400">
        ending on
      </h3>
      <DateControl
        selectedDate={selectedDate}
        onDateChanged={dateChangeHandler}
      />
    </div>
  );
};

export default PlanAndDate;
