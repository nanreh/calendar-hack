import React from "react";
import { AvailablePlan } from "../ch/planrepo";
import Select from "../defy/components/Select";

interface Props {
  availablePlans: Array<AvailablePlan>;
  selectedPlan: AvailablePlan;
  planChangeHandler: (p: AvailablePlan) => void;
}

const PlanPicker: React.FC<Props> = ({
  availablePlans,
  selectedPlan,
  planChangeHandler,
}) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSelection = availablePlans.find(
      (p) => p.name === (event.target.value as string)
    );
    if (newSelection) {
      planChangeHandler(newSelection);
    } else {
      throw new Error("Invalid selection: " + event.target.value);
    }
  };

  const planOptions = availablePlans.map((ap) => (
    <option key={ap.name} value={ap.name}>
      ({ap.type}) {ap.name}
    </option>
  ));

  return (
    <Select value={selectedPlan.name} onChange={handleChange}>
      {planOptions}
    </Select>
  );
};

export default PlanPicker;
