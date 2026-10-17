import type { RacePlan } from "../ch/dategrid";

interface Props {
  racePlan: RacePlan | undefined;
}

// A plan's source is whatever its author typed, and custom plans are written by strangers.
// Only an ordinary web address is turned into a link.
function isWebAddress(url: string | undefined): url is string {
  return url !== undefined && /^https?:\/\//i.test(url.trim());
}

export const PlanDetailsCard = ({ racePlan }: Props) => {
  const sourceUrl = racePlan?.sourceUrl;
  return (
    <div className="plan-details">
      <div className="plan-details-content">
        <p>{racePlan?.description}</p>
        {isWebAddress(sourceUrl) && (
          <p>
            <a href={sourceUrl.trim()} target="_blank" rel="noreferrer">
              Source
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
