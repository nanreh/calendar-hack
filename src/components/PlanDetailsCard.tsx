import { RacePlan } from "../ch/dategrid";

interface Props {
  racePlan: RacePlan | undefined;
}

export const PlanDetailsCard = ({ racePlan }: Props) => {
  return (
    <div className="plan-details">
      <div className="plan-details-content">
        <p>{racePlan?.description}</p>
        <p>
          <a href={racePlan?.sourceUrl}>Source</a>
        </p>
      </div>
    </div>
  );
};
