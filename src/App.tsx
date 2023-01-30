import React, { useState } from "react";
import { Units } from "./defy/models";
import { RacePlan } from "./ch/models";
import {
  PlanRepo,
  availablePlans,
  availablePlansById,
  AvailablePlan,
} from "./ch/planrepo";
import { endOfWeek, addWeeks, isAfter } from "date-fns";
import { dayOfWeek } from "./ch/dategrid";
import { build, swap, swapDow } from "./ch/planbuilder";
import { CalendarGrid } from "./components/CalendarGrid";
import { ThemeProvider } from "styled-components";
import { toIcal, download } from "./ch/icalservice";
import UnitsButtons from "./defy/components/UnitsButtons";
import PlanAndDate from "./components/PlanAndDate";
import Toolbar from "./defy/components/Toolbar";
import styled from "styled-components";
import DownloadButton from "./components/DownloadButton";
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

const MainUI = styled.div`
  margin-top: 2em;
`;

const SecondToolbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em 0 5px 0;
  color: ${(props) => props.theme.colors.controlsTitle};
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    flex-direction: column;
  }
`;
const UnitsDiv = styled.div`
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    margin-top: 0.5em;
  }
`;

const App: React.FC = () => {
  const [{ u, p, d, s }, setq] = useQueryParams({
    u: StringParam,
    p: StringParam,
    d: DateParam,
    s: NumberParam,
  });
  const [selectedUnits, setSelectedUnits] = useState<Units>(
    u === "mi" || u === "km" ? u : "mi"
  );
  var [selectedPlan, setSelectedPlan] = useState(
    p && availablePlansById[p] ? availablePlansById[p] : availablePlans[0]
  );
  var [racePlan, setRacePlan] = useState<RacePlan | undefined>(undefined);
  var [undoHistory, setUndoHistory] = useState([] as RacePlan[]);
  var [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
    s === 0 || s === 1 || s === 6 ? s : WeekStartsOnValues.Monday
  );
  var [planEndDate, setPlanEndDate] = useState(
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
    plan: AvailablePlan,
    endDate: Date,
    units: Units,
    weekStartsOn: WeekStartsOn
  ) => {
    const racePlan = build(await planRepo.fetch(plan), endDate, weekStartsOn);
    setRacePlan(racePlan);
    setUndoHistory([...undoHistory, racePlan]);
    setq(getParams(units, plan, endDate, weekStartsOn));
  };

  const onSelectedPlanChange = async (plan: AvailablePlan) => {
    const racePlan = build(
      await planRepo.fetch(plan),
      planEndDate,
      weekStartsOn
    );
    setSelectedPlan(plan);
    setRacePlan(racePlan);
    setUndoHistory([racePlan]);
    setq(getParams(selectedUnits, plan, planEndDate, weekStartsOn));
  };

  const onSelectedEndDateChange = async (date: Date) => {
    const racePlan = build(
      await planRepo.fetch(selectedPlan),
      date,
      weekStartsOn
    );
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
    console.log("onWeekStartsOnChanged: " + v);
    const racePlan = build(await planRepo.fetch(selectedPlan), planEndDate, v);
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
      <Toolbar downloadHandler={downloadHandler} />
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
      <SecondToolbar>
        <UnitsDiv>
          <UnitsButtons
            units={selectedUnits}
            unitsChangeHandler={onSelectedUnitsChanged}
          />
        </UnitsDiv>
      </SecondToolbar>
      <SecondToolbar>
        <DownloadButton downloadHandler={downloadHandler} />
        <UndoButton
          disabled={undoHistory.length <= 1}
          undoHandler={undoHandler}
        />
      </SecondToolbar>
      <PlanDetailsCard racePlan={racePlan} />
      <SecondToolbar>
        <WeekStartsOnPicker
          weekStartsOn={weekStartsOn}
          changeHandler={onWeekStartsOnChanged}
        />
      </SecondToolbar>
      <MainUI>
        {racePlan && (
          <CalendarGrid
            racePlan={racePlan}
            units={selectedUnits}
            weekStartsOn={weekStartsOn}
            swap={swapDates}
            swapDow={doSwapDow}
            swapWeeks={swapWeeks}
          />
        )}
      </MainUI>
    </ThemeProvider>
  );
};

export default App;
