import styled from "styled-components";
import { Dateline } from "./Dateline";

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.workoutCardBlankBg};
  border-radius: 0.25rem;
`;

const Content = styled.div`
  height: 100%;
  padding: 5px;
`;

export const BlankCard = ({ date }: { date: Date }) => {
  return (
    <Root>
      <Dateline $date={date} $blank={true} />
      <Content />
    </Root>
  );
};
