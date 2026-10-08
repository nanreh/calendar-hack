import React, { useState, useRef } from "react";
import { repo } from "./ch/planrepo";
import { endOfWeek, addWeeks, isAfter } from "date-fns";
import type { RacePlan } from "./ch/dategrid";
import { build, swap, swapDow } from "./ch/planbuilder";
import { CalendarGrid } from "./components/CalendarGrid";
import { toIcal } from "./ch/icalservice";
import { toCsv } from "./ch/csvService";
import { download } from "./ch/downloadservice";
import UnitsButtons from "./components/UnitsButtons";
import PlanAndDate from "./components/PlanAndDate";
import UndoButton from "./components/UndoButton";
import history from "./defy/history";
import {
  useQueryParams,
  StringParam,
  DateParam,
  NumberParam,
} from "use-query-params";
import { PlanDetailsCard } from "./components/PlanDetailsCard";
import type { WeekStartsOn } from "./ch/datecalc";
import { WeekStartsOnValues } from "./ch/datecalc";
import WeekStartsOnPicker from "./components/WeekStartsOnPicker";
import { useMountEffect } from "./ch/hooks";
import type {
  Units,
  PlanSummary,
  dayOfWeek,
  PlanMode,
  TrainingPlan,
} from "types/app";
import { getLocaleUnits } from "./ch/localize";
import { isPlanRemoved } from "./ch/config";
import { parseYamlContent } from "./ch/yamlService";
import type { PlanSource } from "./ch/planSource";
import { parsePlanLink, parsePlanRef, toPlanRef } from "./ch/planSource";
import { loadPlanFromSource } from "./ch/planLoader";

const App = () => {
  const [{ u, p, d, s, plan }, setq] = useQueryParams({
    u: StringParam,
    p: StringParam,
    d: DateParam,
    s: NumberParam,
    // where a shared custom plan is hosted, e.g. "gist:someuser/0fddae86"
    plan: StringParam,
  });
  const [selectedUnits, setSelectedUnits] = useState<Units>(
    u === "mi" || u === "km" ? u : getLocaleUnits(),
  );
  const [selectedPlan, setSelectedPlan] = useState(repo.find(p || ""));
  const [racePlan, setRacePlan] = useState<RacePlan | undefined>(undefined);
  const [undoHistory, setUndoHistory] = useState([] as RacePlan[]);
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
    s === 0 || s === 1 || s === 6 ? s : WeekStartsOnValues.Monday,
  );
  const [planEndDate, setPlanEndDate] = useState(
    d && isAfter(d, new Date())
      ? d
      : addWeeks(endOfWeek(new Date(), { weekStartsOn: weekStartsOn }), 20),
  );
  const [planMode, setPlanMode] = useState<PlanMode>(plan ? "byop" : "select");
  const [byopError, setByopError] = useState<string | null>(null);
  const [byopLoading, setByopLoading] = useState<boolean>(false);
  const [byopPlan, setByopPlan] = useState<TrainingPlan | null>(null);
  // where the custom plan was loaded from, null for a plan loaded from a file
  const [byopSource, setByopSource] = useState<PlanSource | null>(null);
  const initStarted = useRef(false);

  const onPlanModeChange = async (mode: PlanMode) => {
    setPlanMode(mode);
    setByopPlan(null);
    setByopSource(null);
    setByopError(null);
    if (mode === "byop") {
      setRacePlan(undefined);
      setUndoHistory([]);
      setq({ p: undefined, plan: undefined });
    } else if (mode === "select") {
      if (!isPlanRemoved(selectedPlan)) {
        const rp = build(
          await repo.fetch(selectedPlan),
          planEndDate,
          weekStartsOn,
        );
        setRacePlan(rp);
        setUndoHistory([rp]);
        setq(getParams(selectedUnits, selectedPlan, planEndDate, weekStartsOn));
      }
    }
  };

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    // listen for changes to the URL and force the app to re-render
    history.listen(() => {
      forceUpdate();
    });
  }, []);

  const getParams = (
    units: Units,
    plan: PlanSummary,
    date: Date,
    weekStartsOn: WeekStartsOn,
  ) => {
    return {
      u: units,
      p: plan[0],
      plan: undefined,
      d: date,
      s: weekStartsOn,
    };
  };

  // URL parameters for a custom plan. A plan loaded from a file has no source to record,
  // so its URL describes only how the calendar is laid out.
  const getByopParams = (
    source: PlanSource | null,
    units: Units,
    date: Date,
    weekStartsOn: WeekStartsOn,
  ) => {
    return {
      u: units,
      p: undefined,
      plan: source ? toPlanRef(source) : undefined,
      d: date,
      s: weekStartsOn,
    };
  };

  const showByopPlan = (plan: TrainingPlan, source: PlanSource | null) => {
    const rp = build(plan, planEndDate, weekStartsOn);
    setRacePlan(rp);
    setUndoHistory([rp]);
    setByopPlan(plan);
    setByopSource(source);
    setq(getByopParams(source, selectedUnits, planEndDate, weekStartsOn));
  };

  const onByopFileLoad = async (content: string) => {
    setByopLoading(true);
    setByopError(null);
    const result = await parseYamlContent(content);
    if (result.success && result.plan) {
      showByopPlan(result.plan, null);
    } else {
      setByopError(result.error || "Failed to load plan");
    }
    setByopLoading(false);
  };

  const loadByopSource = async (source: PlanSource) => {
    setByopLoading(true);
    setByopError(null);
    const result = await loadPlanFromSource(source);
    if (result.success && result.plan) {
      showByopPlan(result.plan, source);
    } else {
      setByopError(result.error || "Failed to load plan");
    }
    setByopLoading(false);
  };

  // Load the plan named by the URL's "plan" parameter.
  const loadSharedPlan = async (ref: string) => {
    const source = parsePlanRef(ref);
    if (!source) {
      setByopError("This link does not point to a plan that can be loaded.");
      return;
    }
    await loadByopSource(source);
  };

  // Load a plan from a link typed or pasted into the form.
  const onByopLinkLoad = async (link: string) => {
    const source = parsePlanLink(link);
    if (!source) {
      setByopError("Only GitHub Gist links are supported.");
      return;
    }
    await loadByopSource(source);
  };

  const initialLoad = async (
    plan: PlanSummary,
    endDate: Date,
    units: Units,
    weekStartsOn: WeekStartsOn,
  ) => {
    if (isPlanRemoved(plan)) {
      setq(getParams(units, plan, endDate, weekStartsOn));
      return;
    }
    const racePlan = build(await repo.fetch(plan), endDate, weekStartsOn);
    setRacePlan(racePlan);
    setUndoHistory([...undoHistory, racePlan]);
    setq(getParams(units, plan, endDate, weekStartsOn));
  };

  useMountEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    if (plan) {
      loadSharedPlan(plan);
    } else {
      initialLoad(selectedPlan, planEndDate, selectedUnits, weekStartsOn);
    }
  });

  const onSelectedPlanChange = async (plan: PlanSummary) => {
    setSelectedPlan(plan);
    if (isPlanRemoved(plan)) {
      setRacePlan(undefined);
      setUndoHistory([]);
      setq(getParams(selectedUnits, plan, planEndDate, weekStartsOn));
      return;
    }
    const racePlan = build(await repo.fetch(plan), planEndDate, weekStartsOn);
    setRacePlan(racePlan);
    setUndoHistory([racePlan]);
    setq(getParams(selectedUnits, plan, planEndDate, weekStartsOn));
  };

  const onSelectedEndDateChange = async (date: Date) => {
    setPlanEndDate(date);
    if (planMode === "byop") {
      if (byopPlan) {
        const rp = build(byopPlan, date, weekStartsOn);
        setRacePlan(rp);
        setUndoHistory([rp]);
        setq(getByopParams(byopSource, selectedUnits, date, weekStartsOn));
      }
      return;
    }
    if (isPlanRemoved(selectedPlan)) {
      setq(getParams(selectedUnits, selectedPlan, date, weekStartsOn));
      return;
    }
    const racePlan = build(await repo.fetch(selectedPlan), date, weekStartsOn);
    setRacePlan(racePlan);
    setUndoHistory([racePlan]);
    setq(getParams(selectedUnits, selectedPlan, date, weekStartsOn));
  };

  const onSelectedUnitsChanged = (u: Units) => {
    setSelectedUnits(u);
    if (planMode === "byop") {
      setq(getByopParams(byopSource, u, planEndDate, weekStartsOn));
    } else {
      setq(getParams(u, selectedPlan, planEndDate, weekStartsOn));
    }
  };

  const onWeekStartsOnChanged = async (v: WeekStartsOn) => {
    setWeekStartsOn(v);
    if (planMode === "byop") {
      if (byopPlan) {
        const rp = build(byopPlan, planEndDate, v);
        setRacePlan(rp);
        setUndoHistory([rp]);
        setq(getByopParams(byopSource, selectedUnits, planEndDate, v));
      }
      return;
    }
    const rp = build(await repo.fetch(selectedPlan), planEndDate, v);
    setRacePlan(rp);
    setUndoHistory([rp]);
    setq(getParams(selectedUnits, selectedPlan, planEndDate, v));
  };

  function swapDates(d1: Date, d2: Date): void {
    if (racePlan) {
      const newRacePlan = swap(racePlan, d1, d2);
      setRacePlan(newRacePlan);
      setUndoHistory([...undoHistory, newRacePlan]);
    }
  }

  function doSwapDow(dow1: dayOfWeek, dow2: dayOfWeek) {
    if (racePlan) {
      const newRacePlan = swapDow(racePlan, dow1, dow2);
      setRacePlan(newRacePlan);
      setUndoHistory([...undoHistory, newRacePlan]);
    }
  }

  function downloadIcalHandler() {
    if (racePlan) {
      const eventsStr = toIcal(racePlan, selectedUnits);
      if (eventsStr) {
        download(eventsStr, "plan", "ics");
      }
    }
  }

  function downloadCsvHandler() {
    if (racePlan) {
      const eventsStr = toCsv(racePlan, selectedUnits, weekStartsOn);
      if (eventsStr) {
        download(eventsStr, "plan", "csv");
      }
    }
  }

  function undoHandler() {
    if (undoHistory?.length >= 0) {
      undoHistory.pop();
    }
    setRacePlan(undoHistory[undoHistory.length - 1]);
  }

  return (
    <>
      <PlanAndDate
        availablePlans={repo.available}
        selectedPlan={selectedPlan}
        selectedDate={planEndDate}
        dateChangeHandler={onSelectedEndDateChange}
        selectedPlanChangeHandler={onSelectedPlanChange}
        weekStartsOn={weekStartsOn}
        planMode={planMode}
        onPlanModeChange={onPlanModeChange}
        onByopFileLoad={onByopFileLoad}
        onByopLinkLoad={onByopLinkLoad}
        byopError={byopError}
        byopLoading={byopLoading}
        byopPlanLoaded={planMode === "byop" && racePlan !== undefined}
      />
      {(planMode === "byop" ? racePlan : !isPlanRemoved(selectedPlan)) && (
        <>
          <div className="second-toolbar">
            <div className="units">
              <UnitsButtons
                units={selectedUnits}
                unitsChangeHandler={onSelectedUnitsChanged}
              />
            </div>
          </div>
          <div className="second-toolbar">
            <button className="app-button" onClick={downloadIcalHandler}>
              Download iCal
            </button>
            <button className="app-button" onClick={downloadCsvHandler}>
              Download CSV
            </button>
            <UndoButton
              disabled={undoHistory.length <= 1}
              undoHandler={undoHandler}
            />
          </div>
          <PlanDetailsCard racePlan={racePlan} />
          <div className="second-toolbar">
            <WeekStartsOnPicker
              weekStartsOn={weekStartsOn}
              changeHandler={onWeekStartsOnChanged}
            />
          </div>
        </>
      )}
      <div className="main-ui">
        {planMode === "select" && isPlanRemoved(selectedPlan) ? (
          <div className="plan-removed-message">
            <h2>THIS PLAN HAS BEEN REMOVED</h2>
            <p>
              Human Kinetics, publisher of the book this plan comes from, has
              requested the removal of this plan.
            </p>
            <p>This makes me sad, I love these books and I know you do too.</p>
            <p>It's disappointing.</p>
            <p>But if they don't want to be here then they shouldn't be.</p>
            <p>No point in dwelling on it.</p>
            <p>Go for a run.</p>
            <br />
            <p>• Advanced Marathoning, Third Edition</p>
            <p>• Advanced Marathoning, Fourth Edition</p>
            <p>• Faster Road Racing: 5k to Half Marathon</p>
          </div>
        ) : (
          racePlan && (
            <CalendarGrid
              racePlan={racePlan}
              units={selectedUnits}
              weekStartsOn={weekStartsOn}
              swapDates={swapDates}
              swapDow={doSwapDow}
            />
          )
        )}
      </div>
    </>
  );
};

export default App;
