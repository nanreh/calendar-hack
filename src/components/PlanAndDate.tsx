import React, { useRef } from "react";
import yaml from "js-yaml";
import { DateControl } from "./DateControl";
import PlanPicker from "./PlanPicker";
import { PlanSummary, TrainingPlan } from "types/app";
import { WeekStartsOn } from "../ch/datecalc";

interface Props {
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  selectedDate: Date;
  dateChangeHandler: (d: Date) => void;
  selectedPlanChangeHandler: (p: PlanSummary) => void;
  weekStartsOn: WeekStartsOn;
  onUploadCustomSelected: () => void;
  onCustomPlanLoaded: (plan: TrainingPlan) => void;
  showUploadButton: boolean;
}

const PlanAndDate = ({
  selectedPlan,
  selectedPlanChangeHandler,
  availablePlans,
  selectedDate,
  dateChangeHandler,
  weekStartsOn,
  onUploadCustomSelected,
  onCustomPlanLoaded,
  showUploadButton,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const plan = yaml.load(e.target?.result as string) as TrainingPlan;
        if (!plan.id || !plan.name || !plan.type || !plan.schedule) {
          alert("Invalid plan file: missing required fields (id, name, type, schedule).");
          return;
        }
        onCustomPlanLoaded(plan);
      } catch {
        alert("Failed to parse YAML file. Please ensure it is a valid training plan.");
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-uploaded
    event.target.value = "";
  };

  return (
    <div className="plan-and-date">
      <PlanPicker
        availablePlans={availablePlans}
        selectedPlan={selectedPlan}
        planChangeHandler={selectedPlanChangeHandler}
        onUploadCustomSelected={onUploadCustomSelected}
      />
      {showUploadButton && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            className="app-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Plan File
          </button>
        </>
      )}
      <h3>ending on</h3>
      <DateControl
        selectedDate={selectedDate}
        onDateChanged={dateChangeHandler}
        weekStartsOn={weekStartsOn}
      />
    </div>
  );
};

export default PlanAndDate;
