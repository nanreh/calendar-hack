import React from "react";
import { PlanSummary } from "types/app";
import { REMOVED_PLANS } from "../ch/config";

interface Props {
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  planChangeHandler: (p: PlanSummary) => void;
  onUploadCustomSelected: () => void;
  isCustomUploadActive: boolean;
}

const UPLOAD_CUSTOM_VALUE = "__upload_custom__";

const PlanPicker = ({
  availablePlans,
  selectedPlan,
  planChangeHandler,
  onUploadCustomSelected,
  isCustomUploadActive,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    if (value === UPLOAD_CUSTOM_VALUE) {
      onUploadCustomSelected();
      return;
    }
    const newSelection = availablePlans.find(
      (p) => p[1] === value,
    );
    if (newSelection) {
      planChangeHandler(newSelection);
    } else {
      throw new Error("Invalid selection: " + event.target.value);
    }
  };

  const planOptions = availablePlans.map((ap) => {
    const isRemoved = REMOVED_PLANS.has(ap[0]);
    const label = isRemoved
      ? `❌ (${ap[2]}) ${ap[1]}`
      : `(${ap[2]}) ${ap[1]}`;
    return (
      <option
        key={ap[1]}
        value={ap[1]}
        style={isRemoved ? { color: "red" } : undefined}
      >
        {label}
      </option>
    );
  });

  return (
    <select className="select" value={isCustomUploadActive ? UPLOAD_CUSTOM_VALUE : selectedPlan[1]} onChange={handleChange}>
      {planOptions}
      <option value={UPLOAD_CUSTOM_VALUE}>(Custom) Upload Custom</option>
    </select>
  );
};

export default PlanPicker;
