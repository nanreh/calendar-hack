import React from "react";
import { WeekStartsOn, WeekStartsOnValues } from "../ch/datecalc";

interface Props {
  weekStartsOn: WeekStartsOn;
  changeHandler: (v: WeekStartsOn) => void;
}

const WeekStartsOnPicker = ({ weekStartsOn, changeHandler }: Props) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = Number(event.target.value) as WeekStartsOn;
    changeHandler(newValue);
  };

  return (
    <div className="week-start-picker">
      <h3>Week starts on</h3>
      <select className="select" value={weekStartsOn} onChange={handleChange}>
        <option key="monday" value={WeekStartsOnValues.Monday}>
          Monday
        </option>
        <option key="sunday" value={WeekStartsOnValues.Sunday}>
          Sunday
        </option>
        <option key="saturday" value={WeekStartsOnValues.Saturday}>
          Saturday
        </option>
      </select>
    </div>
  );
};

export default WeekStartsOnPicker;
