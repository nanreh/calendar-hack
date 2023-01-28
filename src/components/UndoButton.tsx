import React from "react";
import { useContext } from "react";
import { Button } from "./Button";
import { IconContext } from "react-icons";
import styled, { ThemeContext } from "styled-components";

interface Props {
  undoHandler: () => void;
  disabled: boolean;
}

const Root = styled.div`
  & > button:disabled {
    background: #dddddd;
    color: #fff;
    &:hover {
      border: 1px solid;
      cursor: not-allowed;
    }
  }
  & > button {
    & > svg {
      width: 1.2em;
      height: 1.2em;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const UndoButton: React.FC<Props> = ({ undoHandler, disabled }) => {
  const themeContext = useContext(ThemeContext);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    undoHandler();
  };
  return (
    <IconContext.Provider value={{ color: themeContext.colors.buttonIcons }}>
      <Root>
        <Button
          onClick={onClick}
          className={disabled ? "disabled" : ""}
          disabled={disabled}
        >
          Undo
        </Button>
      </Root>
    </IconContext.Provider>
  );
};

export default UndoButton;
