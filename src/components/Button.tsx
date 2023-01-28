import styled from "styled-components";

export const Button = styled.button`
  display: inline;
  font-size: 16px;
  font-weight: 900;
  color: ${(props) => props.theme.colors.buttonTxt};
  line-height: 1.3;
  padding: 0.6em 0.8em 0.5em 0.8em;
  margin: 0 2px;
  max-width: 100%;
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: ${(props) => props.theme.colors.buttonBg};
  border: 1px solid ${(props) => props.theme.colors.buttonBg};
  &:focus {
    outline: none;
  }
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.buttonSelectedBorder};
  }
`;
