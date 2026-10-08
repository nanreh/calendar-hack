import { DateControl } from "./DateControl";
import PlanFinder from "./PlanFinder";
import type { PlanSummary, PlanMode } from "types/app";
import type { WeekStartsOn } from "../ch/datecalc";
import type { PlanSource } from "../ch/planSource";

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
  onByopLinkLoad: (link: string) => void;
  byopError: string | null;
  byopLoading: boolean;
  byopPlanLoaded: boolean;
  byopPlanName: string | undefined;
  byopSource: PlanSource | null;
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
  onByopLinkLoad,
  byopError,
  byopLoading,
  byopPlanLoaded,
  byopPlanName,
  byopSource,
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
          onByopLinkLoad={onByopLinkLoad}
          byopError={byopError}
          byopLoading={byopLoading}
          byopPlanLoaded={byopPlanLoaded}
          byopPlanName={byopPlanName}
          byopSource={byopSource}
        />
      </div>
      {(planMode === "select" || byopPlanLoaded) && (
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
