import { DateControl } from "./DateControl";
import PlanFinder from "./PlanFinder";
import { PlanSummary, PlanMode } from "types/app";
import { WeekStartsOn } from "../ch/datecalc";

interface Props {
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  selectedDate: Date;
  dateChangeHandler: (d: Date) => void;
  selectedPlanChangeHandler: (p: PlanSummary) => void;
  weekStartsOn: WeekStartsOn;
  // BYOP props
  planMode: PlanMode;
  onPlanModeChange: (mode: PlanMode) => void;
  onByopFileLoad: (content: string) => void;
  byopError: string | null;
  byopLoading: boolean;
  byopPlanLoaded: boolean;
}

const PlanAndDate = ({
  selectedPlan,
  selectedPlanChangeHandler,
  availablePlans,
  selectedDate,
  dateChangeHandler,
  weekStartsOn,
  planMode,
  onPlanModeChange,
  onByopFileLoad,
  byopError,
  byopLoading,
  byopPlanLoaded,
}: Props) => {
  return (
    <div className="plan-and-date">
      <div className="plan-and-date-row">
        <PlanFinder
          mode={planMode}
          onModeChange={onPlanModeChange}
          availablePlans={availablePlans}
          selectedPlan={selectedPlan}
          planChangeHandler={selectedPlanChangeHandler}
          onByopFileLoad={onByopFileLoad}
          byopError={byopError}
          byopLoading={byopLoading}
          byopPlanLoaded={byopPlanLoaded}
        />
      </div>
{planMode === "select" && (
        <div className="plan-and-date-row">
          <h3>ending on</h3>
          <DateControl
            selectedDate={selectedDate}
            onDateChanged={dateChangeHandler}
            weekStartsOn={weekStartsOn}
          />
        </div>
      )}
    </div>
  );
};

export default PlanAndDate;
