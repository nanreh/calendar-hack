import { renderDist, getWeekDistance } from "../ch/rendering";
import StartIcon from "../svg/icons02/start.svg";
import FinishIcon from "../svg/icons02/finish.svg";
import HighMileageIcon from "../svg/highMileage.svg";
import { RacePlan } from "../ch/dategrid";
import { Week, DayDetails, Units } from "types/app";

interface Props {
  desc: string;
  week: Week<DayDetails>;
  units: Units;
  racePlan: RacePlan;
  isFirstWeek: boolean;
  isLastWeek: boolean;
  isHighestMileage: boolean;
  cumulativeDistance: number[];
}

export const WeekSummary = ({
  week,
  units,
  isFirstWeek,
  isLastWeek,
  isHighestMileage,
  cumulativeDistance,
}: Props) => {
  const distance = getWeekDistance(week, units);
  return (
    <div className="week-summary" key={"week:" + week.weekNum}>
      <p>
        <strong>{`Week ${1 + week.weekNum}`}</strong>
      </p>
      {distance[0] > 0 && <p className="week-distance">Week: {renderDist(distance, units, units)}</p>}
      {cumulativeDistance[0] > 0 && <p className="week-distance">Cumulative: {renderDist(cumulativeDistance, units, units)}</p>}
      {isFirstWeek && <img src={StartIcon} alt={"Start"} />}
      {isLastWeek && <img src={FinishIcon} alt="Finish" />}
      {isHighestMileage && <img src={HighMileageIcon} alt="Highest Mileage" />}
      {isHighestMileage && (
        <p>
          <small>Highest Mileage</small>
        </p>
      )}
    </div>
  );
};
