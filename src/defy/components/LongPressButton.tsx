import React, { useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useContext } from "react";
import { ThemeContext } from "styled-components";

type plusOrMinus = "plus" | "minus";

interface Props {
  activeCb: () => void;
  doneCb: () => void;
  type: plusOrMinus;
}

const Root = styled.div`
  background-color: ${(props) => props.theme.colors.buttonBg};
  //border: 2px solid #111;
  border-radius: 50%;
  padding: 3px;
  &:hover {
    //background-color: ${(props) => props.theme.colors.silver};
    cursor: pointer;
  }
  & > svg {
    width: 2em;
    height: 2em;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

let timerID: number | undefined;

const LongPressButton: React.FC<Props> = ({ activeCb, doneCb, type }) => {
  const timer = useCallback(() => {
    timerID = window.setInterval(function doCb() {
      activeCb();
    }, 100);
  }, [activeCb]);

  function pressingDown(e: React.MouseEvent | React.TouchEvent) {
    timer();
    console.log(e);
    e.preventDefault();
  }

  function notPressingDown(e: React.MouseEvent | React.TouchEvent) {
    // Stop the timer
    if (undefined !== timerID) {
      clearInterval(timerID);
    }
    doneCb();
  }

  // create element ref
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef && innerRef.current) {
      const div = innerRef.current;
      const cancel = (event: TouchEvent) => event.preventDefault();
      div.addEventListener("touchstart", cancel, { passive: false });
      div.addEventListener("touchend", cancel, { passive: false });
      return () => {
        div.removeEventListener("touchend", cancel);
      };
    }
  }, []);

  const themeContext = useContext(ThemeContext);
  return (
    <IconContext.Provider
      value={{ color: themeContext.colors.buttonIcons, size: "1.5em" }}
    >
      <Root
        ref={innerRef}
        onMouseDown={pressingDown}
        onMouseUp={notPressingDown}
        onMouseLeave={notPressingDown}
        onTouchStart={pressingDown}
        onTouchEnd={notPressingDown}
      >
        {type === "plus" && <FaPlus style={{ verticalAlign: "middle" }} />}
        {type === "minus" && <FaMinus style={{ verticalAlign: "middle" }} />}
      </Root>
    </IconContext.Provider>
  );
};

export default LongPressButton;
