import * as React from "react";
import { Week } from "../ch/dategrid";
import { Units } from "../defy/models";
import { DayDetails, RacePlan } from "../ch/models";
import styled from "styled-components";
import { renderDist, getWeekDistance } from "../ch/rendering";
import StartIcon from "../svg/icons02/start.svg";
import FinishIcon from "../svg/icons02/finish.svg";
import HighMileageIcon from "../svg/highMileage.svg";

interface Props {
  desc: string;
  week: Week<DayDetails>;
  units: Units;
  racePlan: RacePlan;
  isFirstWeek: boolean;
  isLastWeek: boolean;
  isHighestMileage: boolean;
}

const Root = styled.div`
  height: 100%;
  width: 100%;
  padding: 5px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.colors.weekSummaryBg};
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    position: relative;
  }
`;

const Icon = styled.img`
  max-height: 64px;
  //max-width: 64px;
  display: inline;
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    position: absolute;
    top: 10px;
    left: 10px;
    max-height: 32px;
    max-width: 32px;
  }
`;

export const WeekSummary: React.FC<Props> = ({
  desc,
  week,
  units,
  racePlan,
  isFirstWeek,
  isLastWeek,
  isHighestMileage,
}) => {
  const distance = getWeekDistance(week, units);
  return (
    <Root key={"week:" + week.weekNum}>
      <p>
        <strong>{`Week ${1 + week.weekNum}`}</strong>
      </p>
      {distance > 0 && <p>{renderDist(distance, units, units)}</p>}
      {isFirstWeek && <Icon src={StartIcon} alt={"Start"} />}
      {isLastWeek && <Icon src={FinishIcon} alt="Finish" />}
      {isHighestMileage && <Icon src={HighMileageIcon} alt="Highest Mileage" />}
      {isHighestMileage && (
        <p>
          <small>Highest Mileage</small>
        </p>
      )}
    </Root>
  );
};
