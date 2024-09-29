import styled from "styled-components";

type CardProps = {
  $isDragging: boolean;
};

export const Card = styled.div<CardProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.colors.workoutCardBg};
  opacity: ${(props) => (props.$isDragging ? .5 : 1)};
`;

export const Content = styled.div`
  svg {
    width: 1em;
    position: absolute;
    top: 2px;
    left: 4px;
  }
  p {
    white-space: pre-wrap;
    /* so newlines render correctly for workout text */
  }
  position: relative;
  height: 100%;
  padding: 0.1em 0.5em 1.5em 1.8em;
  border-radius: 0 0 0.25rem 0.25rem;
  @media (min-width: ${(props) => props.theme.screenSizes.md}) {
    min-height: 4em;
  }
`;
