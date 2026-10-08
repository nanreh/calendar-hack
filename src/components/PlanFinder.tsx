import type { PlanSummary, PlanMode } from "types/app";
import type { PlanSource } from "../ch/planSource";
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
  onByopLinkLoad: (link: string) => void;
  byopError: string | null;
  byopLoading: boolean;
  byopPlanLoaded: boolean;
  byopPlanName: string | undefined;
  byopSource: PlanSource | null;
}

const PlanFinder = ({
  mode,
  onModeChange,
  availablePlans,
  selectedPlan,
  planChangeHandler,
  onByopFileLoad,
  onByopLinkLoad,
  byopError,
  byopLoading,
  byopPlanLoaded,
  byopPlanName,
  byopSource,
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
          onLinkLoad={onByopLinkLoad}
          error={byopError}
          loading={byopLoading}
          planLoaded={byopPlanLoaded}
          planName={byopPlanName}
          source={byopSource}
          onChangePlan={() => onModeChange("byop")}
        />
      )}
    </div>
  );
};

export default PlanFinder;
