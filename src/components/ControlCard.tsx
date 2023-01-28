import styled from "styled-components";

export const ControlCard = styled.div`
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1em;
  width: 100%;
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.colors.controlsBg};
`;

export const ControlTitle = styled.h5`
  color: ${(props) => props.theme.colors.controlsTitle};
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.75rem;
`;
