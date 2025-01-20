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

const PlanAndDate = ({
  selectedPlan,
  selectedPlanChangeHandler,
  availablePlans,
  selectedDate,
  dateChangeHandler,
  weekStartsOn,
}: Props) => {
  return (
    <div className="plan-and-date">
      <PlanPicker
        availablePlans={availablePlans}
        selectedPlan={selectedPlan}
        planChangeHandler={selectedPlanChangeHandler}
      />
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
