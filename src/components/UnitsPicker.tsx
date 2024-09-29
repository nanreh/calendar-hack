import React from "react";
import { ControlCard, ControlTitle } from "./ControlCard";
import { Units } from "types/app";

interface Props {
  units: Units;
  unitsChangeHandler: (u: Units) => void;
}

const UnitsPicker = ({ units, unitsChangeHandler }: Props) => {
  const handleChangeFn = (event: React.FormEvent<HTMLInputElement>) => {
    const newSelection = "mi" === event.currentTarget.value ? "mi" : "km";
    unitsChangeHandler(newSelection);
  };

  return (
    <ControlCard>
      <ControlTitle>Units</ControlTitle>
      <div className="switch-field">
        <input
          type="radio"
          name="units"
          id="Miles"
          value="mi"
          checked={units === "mi"}
          onChange={handleChangeFn}
        />
        <label htmlFor="Miles">Mi</label>
        <input
          type="radio"
          name="units"
          id="Kilometers"
          value="km"
          checked={units === "km"}
          onChange={handleChangeFn}
        />
        <label htmlFor="Kilometers">Km</label>
      </div>
    </ControlCard>
  );
};

export default UnitsPicker;
