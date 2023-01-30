import React from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Radio } from "./Radios";
import { Units } from "../models";

interface Props {
  units: Units;
  unitsChangeHandler: (u: Units) => void;
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
`;

const UnitsButtons: React.FC<Props> = ({ units, unitsChangeHandler }) => {
  const themeContext = useContext(ThemeContext);

  const changeCb = (event: React.FormEvent<HTMLInputElement>) => {
    console.log("changeCb: " + event.currentTarget.value);
    const newSelection = "mi" === event.currentTarget.value ? "mi" : "km";
    unitsChangeHandler(newSelection);
  };

  return (
    <IconContext.Provider value={{ color: themeContext.colors.buttonIcons }}>
      <Root>
        <Radio
          id="radio-mi"
          name="radio-units"
          value="mi"
          labelTxt="Mi"
          changeCb={changeCb}
          currentValue={units}
        />
        <Radio
          id="radio-km"
          name="radio-units"
          value="km"
          labelTxt="Km"
          changeCb={changeCb}
          currentValue={units}
        />
      </Root>
    </IconContext.Provider>
  );
};

export default UnitsButtons;
