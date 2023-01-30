import * as React from "react";
import { format } from "date-fns";
import styled from "styled-components";

export interface Props {
  date: Date;
}

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.workoutCardBg};
`;

const Content = styled.div`
  height: 100%;
  padding: 5px;
  border-radius: 0 0 0.25rem 0.25rem;
`;

const Dateline = styled.div`
  text-align: center;
  background-color: #e9ecef;
  border-radius: 0.25rem 0.25rem 0 0;
`;

export const BlankCard: React.FC<Props> = ({ date }) => {
  return (
    <Root>
      <Dateline>
        <small>
          <strong>{format(date, "M/d/yyyy")}</strong>
        </small>
      </Dateline>
      <Content />
    </Root>
  );
};
