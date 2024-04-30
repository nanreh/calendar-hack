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
import { RaceType } from "@/defy/models";

interface Props {
  availablePlans: Array<AvailablePlan>;
  selectedPlan?: AvailablePlan;
  planChangeHandler: (p: AvailablePlan | undefined) => void;
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
      // Handle the case when newSelection is undefined
      // For example, you can call planChangeHandler with undefined
      planChangeHandler(undefined);
    }
  };

  const groupedPlans = availablePlans.reduce<Record<RaceType, AvailablePlan[]>>(
    (groups, plan) => {
      (groups[plan.type] = groups[plan.type] || []).push(plan);
      return groups;
    },
    {} as Record<RaceType, AvailablePlan[]>
  );

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
    <Select onValueChange={handleChange} value={selectedPlan?.id}>
      <SelectTrigger className="w-[480px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>{planGroups}</SelectContent>
    </Select>
  );
};

export default PlanPicker;
