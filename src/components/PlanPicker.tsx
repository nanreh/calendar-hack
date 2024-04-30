import React from "react";
import { AvailablePlan } from "../ch/planrepo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const handleChange = (value: string) => {
    const newSelection = availablePlans.find((p) => p.id === value);
    if (newSelection) {
      planChangeHandler(newSelection);
    } else {
      throw new Error("Invalid selection: " + value);
    }
  };

  const groupedPlans = availablePlans.reduce((groups, plan) => {
    (groups[plan.type] = groups[plan.type] || []).push(plan);
    return groups;
  }, {});

  const planGroups = Object.entries(groupedPlans).map(([type, plans]) => (
    <SelectGroup key={type}>
      <SelectLabel>{type}</SelectLabel>
      {plans.map((plan) => (
        <SelectItem key={plan.id} value={plan.id}>
          {plan.name}
        </SelectItem>
      ))}
    </SelectGroup>
  ));

  return (
    <Select onValueChange={handleChange} value={selectedPlan.id}>
      <SelectTrigger className="w-[480px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>{planGroups}</SelectContent>
    </Select>
  );
};

export default PlanPicker;
