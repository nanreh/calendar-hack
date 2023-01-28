import * as React from "react";
import styled from "styled-components";
import { RacePlan } from "../ch/models";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em 0 5px 0;
  color: ${(props) => props.theme.colors.controlsTitle};
`;
export const PlanDetailsStyle = styled.div`
  text-align: center;
  width: 75%;
  @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
    width: 90%;
  }
  background-color: ${(props) => props.theme.colors.planDescriptionBg};
  color: ${(props) => props.theme.colors.planDescriptionTxt};
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 1em;
`;

interface PlanDetailsProps {
  racePlan: RacePlan | undefined;
}

export const PlanDetailsCard: React.FC<PlanDetailsProps> = ({ racePlan }) => {
  return (
    <Root>
      <PlanDetailsStyle>
        <p>{racePlan?.description}</p>
        <p>
          <a href={racePlan?.sourceUrl}>Source</a>
        </p>
      </PlanDetailsStyle>
    </Root>
  );
};
