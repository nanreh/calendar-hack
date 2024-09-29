import React from "react";
import Select from "../defy/components/Select";
import { PlanSummary } from "types/app";

interface Props {
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  planChangeHandler: (p: PlanSummary) => void;
}

const PlanPicker = ({
  availablePlans,
  selectedPlan,
  planChangeHandler,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSelection = availablePlans.find(
      (p) => p[1] === (event.target.value as string)
    );
    if (newSelection) {
      planChangeHandler(newSelection);
    } else {
      throw new Error("Invalid selection: " + event.target.value);
    }
  };

  const planOptions = availablePlans.map((ap) => (
    <option key={ap[1]} value={ap[1]}>
      ({ap[2]}) {ap[1]}
    </option>
  ));

  return (
    <Select value={selectedPlan[1]} onChange={handleChange}>
      {planOptions}
    </Select>
  );
};

export default PlanPicker;
