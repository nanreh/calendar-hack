import React from "react";
import styled from "styled-components";

const Mark = styled.div`
  position: relative;
  border-radius: 50%;
  width: 2.2em;
  height: 2.2em;
  z-index: 10;
  color: ${(props) => props.theme.colors.buttonTxt};
  margin: 0 0.1em;

  &:hover {
    cursor: pointer;
  }
  &::after {
    // This is the overlay used to communicate checked/unchecked status
    // Here are the styles for unchecked
    content: "";
    width: 1.9em;
    height: 1.9em;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.buttonBg};
    opacity: 1;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const RadioLabel = styled.div`
  font-size: 1em;
  font-weight: 900;
  z-index: 12;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Input = styled.input`
  position: absolute;
  visibility: hidden;
  display: none;
  &:checked + ${Mark} {
    background-color: ${(props) => props.theme.colors.buttonSelectedBorder};
    &:hover {
      cursor: not-allowed;
    }
    &:after {
      // Here are the styles for checked
      margin: auto;
      opacity: 1;
      background-color: ${(props) => props.theme.colors.buttonBg};
    }
  }
  &:not(:checked) + ${Mark} {
    background-color: ${(props) => props.theme.colors.buttonBg};
  }
`;

interface Props {
  id: string;
  name: string;
  value: string;
  labelTxt: string;
  changeCb: (event: React.FormEvent<HTMLInputElement>) => void;
  currentValue: string;
}

export const Radio: React.FC<Props> = ({
  id,
  name,
  value,
  labelTxt,
  changeCb,
  currentValue,
}) => {
  return (
    <label htmlFor={id}>
      <Input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={value === currentValue}
        onChange={changeCb}
      />
      <Mark>
        <RadioLabel>{labelTxt}</RadioLabel>
      </Mark>
    </label>
  );
};
