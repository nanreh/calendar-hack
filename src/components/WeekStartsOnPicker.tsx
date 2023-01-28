import React from "react";
import Select from "../defy/components/Select";
import { WeekStartsOn, WeekStartsOnValues } from "../ch/datecalc";
import styled from "styled-components";

interface Props {
  weekStartsOn: WeekStartsOn;
  changeHandler: (v: WeekStartsOn) => void;
}

const Root = styled.div`
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

const Title = styled.h3`
  display: inline;
  margin: 0 0.4em;
  color: ${(props) => props.theme.colors.buttonBg};
`;

const WeekStartsOnPicker: React.FC<Props> = ({
  weekStartsOn,
  changeHandler,
}) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = Number(event.target.value) as WeekStartsOn;
    console.log(`HandleChange: ${newValue}`);
    changeHandler(newValue);
  };

  return (
    <Root>
      <Title>Week starts on</Title>
      <Select value={weekStartsOn} onChange={handleChange}>
        <option key="monday" value={WeekStartsOnValues.Monday}>
          Monday
        </option>
        <option key="sunday" value={WeekStartsOnValues.Sunday}>
          Sunday
        </option>
        <option key="saturday" value={WeekStartsOnValues.Saturday}>
          Saturday
        </option>
      </Select>
    </Root>
  );
};

export default WeekStartsOnPicker;
