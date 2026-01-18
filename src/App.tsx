import React, { useState, useRef } from "react";
import { repo } from "./ch/planrepo";
import { endOfWeek, addWeeks, isAfter } from "date-fns";
import { RacePlan } from "./ch/dategrid";
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
import { WeekStartsOn, WeekStartsOnValues } from "./ch/datecalc";
import WeekStartsOnPicker from "./components/WeekStartsOnPicker";
import { useMountEffect } from "./ch/hooks";
import { Units, PlanSummary, dayOfWeek, PlanMode } from "types/app";
import { getLocaleUnits } from "./ch/localize";
import { isPlanRemoved } from "./ch/config";
import { parseYamlContent } from "./ch/yamlService";
import LZString from "lz-string";

const encodeYaml = (yaml: string): string => {
  return LZString.compressToEncodedURIComponent(yaml);
};

const decodeYaml = (encoded: string): string | null => {
  return LZString.decompressFromEncodedURIComponent(encoded);
};

const App = () => {
  const [{ u, p, d, s, customplan }, setq] = useQueryParams({
    u: StringParam,
    p: StringParam,
    d: DateParam,
    s: NumberParam,
    customplan: StringParam,
  });
  const [selectedUnits, setSelectedUnits] = useState<Units>(
    u === "mi" || u === "km" ? u : getLocaleUnits(),
  );
  var [selectedPlan, setSelectedPlan] = useState(repo.find(p || ""));
  var [racePlan, setRacePlan] = useState<RacePlan | undefined>(undefined);
  var [undoHistory, setUndoHistory] = useState([] as RacePlan[]);
  var [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
    s === 0 || s === 1 || s === 6 ? s : WeekStartsOnValues.Monday,
  );
  var [planEndDate, setPlanEndDate] = useState(
    d && isAfter(d, new Date())
      ? d
      : addWeeks(endOfWeek(new Date(), { weekStartsOn: weekStartsOn }), 20),
  );
  const [planMode, setPlanMode] = useState<PlanMode>(customplan ? "byop" : "select");
  const [byopError, setByopError] = useState<string | null>(null);
  const [byopLoading, setByopLoading] = useState<boolean>(false);
  const [byopYaml, setByopYaml] = useState<string | null>(null);
  const initStarted = useRef(false);

  const onPlanModeChange = async (mode: PlanMode) => {
    setPlanMode(mode);
    if (mode === "byop") {
      setRacePlan(undefined);
      setUndoHistory([]);
      setByopError(null);
      setByopYaml(null);
      setq({ p: undefined, customplan: undefined });
    } else if (mode === "select") {
      setByopYaml(null);
      if (!isPlanRemoved(selectedPlan)) {
        const rp = build(await repo.fetch(selectedPlan), planEndDate, weekStartsOn);
        setRacePlan(rp);
        setUndoHistory([rp]);
        setq({ ...getParams(selectedUnits, selectedPlan, planEndDate, weekStartsOn), customplan: undefined });
      }
    }
  };

  useMountEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    if (customplan) {
      const yaml = decodeYaml(customplan);
      if (yaml) {
        loadCustomPlan(yaml);
      } else {
        setByopError("Failed to decode custom plan from URL");
      }
    } else {
      initialLoad(selectedPlan, planEndDate, selectedUnits, weekStartsOn);
    }
  });

  const loadCustomPlan = async (yaml: string) => {
    setByopLoading(true);
    const result = await parseYamlContent(yaml);
    if (result.success && result.plan) {
      const rp = build(result.plan, planEndDate, weekStartsOn);
      setRacePlan(rp);
      setUndoHistory([rp]);
      setByopYaml(yaml);
    } else {
      setByopError(result.error || "Failed to load custom plan");
    }
    setByopLoading(false);
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
      d: date,
      s: weekStartsOn,
    };
  };

  const onByopFileLoad = async (content: string) => {
    setByopLoading(true);
    setByopError(null);
    const result = await parseYamlContent(content);
    if (result.success && result.plan) {
      const rp = build(result.plan, planEndDate, weekStartsOn);
      setRacePlan(rp);
      setUndoHistory([rp]);
      setByopYaml(content);
      setq({ p: undefined, customplan: encodeYaml(content) });
    } else {
      setByopError(result.error || "Failed to load plan");
    }
    setByopLoading(false);
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
    const racePlan = build(await repo.fetch(selectedPlan), date, weekStartsOn);
    setPlanEndDate(date);
    setRacePlan(racePlan);
    setUndoHistory([racePlan]);
    setq(getParams(selectedUnits, selectedPlan, date, weekStartsOn));
  };

  const onSelectedUnitsChanged = (u: Units) => {
    setSelectedUnits(u);
    setq(getParams(u, selectedPlan, planEndDate, weekStartsOn));
  };

  const onWeekStartsOnChanged = async (v: WeekStartsOn) => {
    setWeekStartsOn(v);
    if (planMode === "byop" && byopYaml) {
      const result = await parseYamlContent(byopYaml);
      if (result.success && result.plan) {
        const rp = build(result.plan, planEndDate, v);
        setRacePlan(rp);
        setUndoHistory([rp]);
      }
    } else {
      const rp = build(await repo.fetch(selectedPlan), planEndDate, v);
      setRacePlan(rp);
      setUndoHistory([rp]);
      setq(getParams(selectedUnits, selectedPlan, planEndDate, v));
    }
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
            <button className="app-button" onClick={downloadIcalHandler}>Download iCal</button>
            <button className="app-button" onClick={downloadCsvHandler}>Download CSV</button>
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
            <p>Human Kinetics, publisher of the book this plan comes from, has requested the removal of this plan.</p>
            <p>This makes me sad, I love these books and I know you do too.</p>
            <p>It's disappointing.</p>
            <p>But if they don't want to be here then they shouldn't be.</p>
            <p>No point in dwelling on it.</p>
            <p>Go for a run.</p>
            <br/>
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
