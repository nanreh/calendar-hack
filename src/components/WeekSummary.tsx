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
}

export const WeekSummary = ({
  week,
  units,
  isFirstWeek,
  isLastWeek,
  isHighestMileage,
}: Props) => {
  const distance = getWeekDistance(week, units);
  return (
    <div className="week-summary" key={"week:" + week.weekNum}>
      <p>
        <strong>{`Week ${1 + week.weekNum}`}</strong>
      </p>
      {distance > 0 && <p>{renderDist(distance, units, units)}</p>}
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
