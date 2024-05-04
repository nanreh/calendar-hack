import React, { useState } from "react";
import { Units } from "./defy/models";
import { RacePlan } from "./ch/models";
import { AvailablePlan, availablePlans, PlanRepo } from "./ch/planrepo";
import { addWeeks, endOfWeek, isAfter } from "date-fns";
import { dayOfWeek } from "./ch/dategrid";
import { build, swap, swapDow } from "./ch/planbuilder";
import { CalendarGrid } from "./components/CalendarGrid";
import { ThemeProvider } from "styled-components";
import { download, toIcal } from "./ch/icalservice";
import UnitsButtons from "./defy/components/UnitsButtons";
import PlanAndDate from "./components/PlanAndDate";
import Toolbar from "./defy/components/Toolbar";
import DownloadButton from "./components/DownloadButton";
import UndoButton from "./components/UndoButton";
import history from "./defy/history";
import {
  DateParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from "use-query-params";
import { PlanDetailsCard } from "./components/PlanDetailsCard";
import { WeekStartsOn, WeekStartsOnValues } from "./ch/datecalc";
import WeekStartsOnPicker from "./components/WeekStartsOnPicker";
import { useMountEffect } from "./ch/hooks";
import WorkInProgress from "@/components/WorkInProgress";
import { PlanDistanceBarChart } from "@/components/PlanDistanceBarChart";

const planRepo = new PlanRepo(availablePlans);

const theme = {
  colors: {
    bodyBg: "#B8E2E6",
    title: "#424242",
    buttonBg: "#E3F7F8",
    buttonIcons: "#E3F7F8",
    buttonTxt: "#424242",
    buttonSelectedBorder: "#FF6FDF",
    dowHeaderBg: "#C2C5EB",
    weekSummaryBg: "#C2C5EB",
    workoutCardBg: "#E3F7F8",
    datelineBg: "#B391D2",
    datelineTxt: "#424242",
    planDescriptionBg: "#E3F7F8",
    planDescriptionTxt: "#424242",
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },
  screenSizes: {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  },
};

const App: React.FC = () => {
  const [{ u, p, d, s }, setq] = useQueryParams({
    u: StringParam,
    p: StringParam,
    d: DateParam,
    s: NumberParam,
  });
  const [selectedUnits, setSelectedUnits] = useState<Units>(
    u === "mi" || u === "km" ? u : "km"
  );
  const [selectedPlan, setSelectedPlan] = useState<AvailablePlan | undefined>(
    p ? planRepo.getPlanById(p) : undefined
  );
  const [racePlan, setRacePlan] = useState<RacePlan | undefined>(undefined);
  const [undoHistory, setUndoHistory] = useState([] as RacePlan[]);
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
    s === 0 || s === 1 || s === 6 ? s : WeekStartsOnValues.Monday
  );

  const [planEndDate, setPlanEndDate] = useState(
    d && isAfter(d, new Date())
      ? d
      : addWeeks(endOfWeek(new Date(), { weekStartsOn: weekStartsOn }), 20)
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
    plan: AvailablePlan,
    date: Date,
    weekStartsOn: WeekStartsOn
  ) => {
    return {
      u: units,
      p: plan.id,
      d: date,
      s: weekStartsOn,
    };
  };

  const initialLoad = async (
    plan: AvailablePlan | undefined,
    endDate: Date,
    units: Units,
    weekStartsOn: WeekStartsOn
  ) => {
    if (plan) {
      const racePlan = build(await planRepo.fetch(plan), endDate, weekStartsOn);
      setRacePlan(racePlan);
      setUndoHistory([...undoHistory, racePlan]);
      setq(getParams(units, plan, endDate, weekStartsOn));
    } else {
      setRacePlan(undefined);
      setUndoHistory([]);
    }
  };

  const onSelectedPlanChange = async (plan: AvailablePlan | undefined) => {
    if (plan) {
      const racePlan = build(
        await planRepo.fetch(plan),
        planEndDate,
        weekStartsOn
      );
      setSelectedPlan(plan);
      setRacePlan(racePlan);
      setUndoHistory([racePlan]);
      setq(getParams(selectedUnits, plan, planEndDate, weekStartsOn));
    } else {
      setSelectedPlan(undefined);
      setRacePlan(undefined);
      setUndoHistory([]);
    }
  };

  const onSelectedEndDateChange = async (date: Date) => {
    if (selectedPlan) {
      const racePlan = build(
        await planRepo.fetch(selectedPlan),
        date,
        weekStartsOn
      );
      setPlanEndDate(date);
      setRacePlan(racePlan);
      setUndoHistory([racePlan]);
    } else {
      setPlanEndDate(date);
      setRacePlan(undefined);
      setUndoHistory([]);
    }
  };

  const onSelectedUnitsChanged = (u: Units) => {
    setSelectedUnits(u);
    if (selectedPlan) {
      setq(getParams(u, selectedPlan, planEndDate, weekStartsOn));
    } else {
      // Handle the case when selectedPlan is undefined
    }
  };

  const onWeekStartsOnChanged = async (v: WeekStartsOn) => {
    if (selectedPlan) {
      const racePlan = build(
        await planRepo.fetch(selectedPlan),
        planEndDate,
        v
      );
      setWeekStartsOn(v);
      setRacePlan(racePlan);
      setUndoHistory([racePlan]);
      setq(getParams(selectedUnits, selectedPlan, planEndDate, v));
    } else {
      setWeekStartsOn(v);
      setRacePlan(undefined);
      setUndoHistory([]);
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

  function swapWeeks(w1: number, w2: number): void {
    if (racePlan) {
      racePlan.dateGrid.swapWeeks(w1, w2);
      setRacePlan(racePlan);
      setUndoHistory([...undoHistory, racePlan]);
    }
  }

  function downloadHandler() {
    if (racePlan) {
      const iCalEventsStr = toIcal(racePlan, selectedUnits);
      if (iCalEventsStr) {
        download(iCalEventsStr, "plan", "ics");
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
    <ThemeProvider theme={theme}>
      <WorkInProgress className="mt-5 mb-20" />
      <Toolbar />
      <div className="flex flex-col justify-center items-center mt-20 gap-4">
        <PlanAndDate
          units={selectedUnits}
          availablePlans={availablePlans}
          selectedPlan={selectedPlan}
          selectedDate={planEndDate}
          dateChangeHandler={onSelectedEndDateChange}
          selectedPlanChangeHandler={onSelectedPlanChange}
          unitsChangeHandler={onSelectedUnitsChanged}
          downloadHandler={downloadHandler}
        />
        {selectedPlan && (
          <PlanDetailsCard
            racePlan={racePlan}
            planName={selectedPlan.name}
            className="w-full"
          />
        )}
        <div className="flex gap-4">
          <WeekStartsOnPicker
            className="w-1/2"
            weekStartsOn={weekStartsOn}
            changeHandler={onWeekStartsOnChanged}
          />
          <UnitsButtons
            className="w-1/2"
            units={selectedUnits}
            unitsChangeHandler={onSelectedUnitsChanged}
          />
        </div>
        <div className="flex w-full gap-4">
          <DownloadButton downloadHandler={downloadHandler} className="w-1/2" />
        </div>
        <UndoButton
          disabled={undoHistory.length <= 1}
          undoHandler={undoHandler}
          className="ml-auto"
        />
      </div>
      {racePlan && (
        <>
          <PlanDistanceBarChart racePlan={racePlan} units={selectedUnits} />
          <div className="my-5">
            <CalendarGrid
              racePlan={racePlan}
              units={selectedUnits}
              weekStartsOn={weekStartsOn}
              swap={swapDates}
              swapDow={doSwapDow}
              swapWeeks={swapWeeks}
            />
          </div>
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
