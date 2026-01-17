import { PlanSummary, PlanMode } from "types/app";
import PlanPicker from "./PlanPicker";
import ByopForm from "./ByopForm";

interface Props {
  mode: PlanMode;
  onModeChange: (mode: PlanMode) => void;
  // Select mode props
  availablePlans: PlanSummary[];
  selectedPlan: PlanSummary;
  planChangeHandler: (p: PlanSummary) => void;
  // BYOP mode props
  onByopFileLoad: (content: string) => void;
  byopError: string | null;
  byopLoading: boolean;
  byopPlanLoaded: boolean;
}

const PlanFinder = ({
  mode,
  onModeChange,
  availablePlans,
  selectedPlan,
  planChangeHandler,
  onByopFileLoad,
  byopError,
  byopLoading,
  byopPlanLoaded,
}: Props) => {
  return (
    <div className="plan-finder">
      <div className="segmented-control">
        <button
          className={mode === "select" ? "selected" : ""}
          onClick={() => onModeChange("select")}
        >
          Select Plan
        </button>
        <button
          className={mode === "byop" ? "selected" : ""}
          onClick={() => onModeChange("byop")}
        >
          BYOP
        </button>
      </div>
      {mode === "select" ? (
        <PlanPicker
          availablePlans={availablePlans}
          selectedPlan={selectedPlan}
          planChangeHandler={planChangeHandler}
        />
      ) : (
        <ByopForm
          onFileLoad={onByopFileLoad}
          error={byopError}
          loading={byopLoading}
          planLoaded={byopPlanLoaded}
        />
      )}
    </div>
  );
};

export default PlanFinder;
