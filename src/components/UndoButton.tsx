import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Button } from "@/components/ui/button";

interface Props {
  undoHandler: () => void;
  disabled: boolean;
  className?: string; // Add this line
}

const UndoButton: React.FC<Props> = ({ undoHandler, disabled, className }) => {
  const themeContext = useContext(ThemeContext);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    undoHandler();
  };
  return (
    <div className={className}>
      <Button
        onClick={onClick}
        className={disabled ? "disabled" : ""}
        disabled={disabled}
      >
        Undo
      </Button>
    </div>
  );
};

export default UndoButton;
