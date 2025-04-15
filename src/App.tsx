import React, { useState } from "react";
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
import { Units, PlanSummary, dayOfWeek } from "types/app";
import { getLocaleUnits } from "./ch/localize";

const App = () => {
  const [{ u, p, d, s }, setq] = useQueryParams({
    u: StringParam,
    p: StringParam,
    d: DateParam,
    s: NumberParam,
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

  useMountEffect(() => {
    initialLoad(selectedPlan, planEndDate, selectedUnits, weekStartsOn);
  });

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

  const initialLoad = async (
    plan: PlanSummary,
    endDate: Date,
    units: Units,
    weekStartsOn: WeekStartsOn,
  ) => {
    const racePlan = build(await repo.fetch(plan), endDate, weekStartsOn);
    setRacePlan(racePlan);
    setUndoHistory([...undoHistory, racePlan]);
    setq(getParams(units, plan, endDate, weekStartsOn));
  };

  const onSelectedPlanChange = async (plan: PlanSummary) => {
    const racePlan = build(await repo.fetch(plan), planEndDate, weekStartsOn);
    setSelectedPlan(plan);
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
    const racePlan = build(await repo.fetch(selectedPlan), planEndDate, v);
    setWeekStartsOn(v);
    setRacePlan(racePlan);
    setUndoHistory([racePlan]);
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
      />
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
      <div className="main-ui">
        {racePlan && (
          <CalendarGrid
            racePlan={racePlan}
            units={selectedUnits}
            weekStartsOn={weekStartsOn}
            swapDates={swapDates}
            swapDow={doSwapDow}
          />
        )}
      </div>
    </>
  );
};

export default App;
