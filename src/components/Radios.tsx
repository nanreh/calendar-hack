import React from "react";

interface Props {
  id: string;
  name: string;
  value: string;
  labelTxt: string;
  changeCb: (event: React.FormEvent<HTMLInputElement>) => void;
  currentValue: string;
}

export const Radio = ({
  id,
  name,
  value,
  labelTxt,
  changeCb,
  currentValue,
}: Props) => {
  return (
    <label htmlFor={id}>
      <input
        className="radio-input"
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={value === currentValue}
        onChange={changeCb}
      />
      <div className="radio-button">
        <div className="radio-label">{labelTxt}</div>
      </div>
    </label>
  );
};
