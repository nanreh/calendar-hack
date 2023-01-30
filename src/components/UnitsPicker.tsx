import React from "react";
import { Units } from "../defy/models";
import { ControlCard, ControlTitle } from "./ControlCard";

interface Props {
  units: Units;
  unitsChangeHandler: (u: Units) => void;
}

const UnitsPicker: React.FC<Props> = ({ units, unitsChangeHandler }) => {
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
