import styled from "styled-components";
import { format } from "../ch/localize";

export const DatelineStyle = styled.div<Props>`
  text-align: center;
  background-color: ${(props) => props.$blank ? props.theme.colors.datelineBlankBg : props.theme.colors.datelineBg };
  color: ${(props) => props.theme.colors.datelineTxt};
  font-weight: 700;
  font-size: 0.8em;
  border-radius: 0.25rem 0.25rem 0 0;
`;

interface Props {
  $date: Date;
  $blank?: boolean;
}

export const Dateline = ({ $date, $blank }: Props) => {
  return (
    <>
      <DatelineStyle $date={$date} $blank={$blank}>{format($date)}</DatelineStyle>
    </>
  );
};
