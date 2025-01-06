import { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import { IconContext } from "react-icons";

import { Button } from "./Button";

interface Props {
  downloadHandler: () => void;
}

const Root = styled.div`
  // background-color: ${(props) => props.theme.colors.buttonBg};
  //border: 2px solid #111;
  border-radius: 50%;
  padding: 3px;
  &:hover {
    //background-color: ${(props) => props.theme.colors.buttonBg};
    cursor: pointer;
  }
  & > svg {
    width: 2em;
    height: 2em;
    display: block;
    margin-left: -2px;
    margin-right: auto;
  }
`;

const DownloadButton = ({ downloadHandler }: Props) => {
  const themeContext = useContext(ThemeContext);

  const onClick = () => {
    downloadHandler();
  };
  return (
    <IconContext.Provider value={{ color: themeContext?.colors.buttonIcons }}>
      <Root>
        <Button onClick={onClick}>Download iCal</Button>
      </Root>
    </IconContext.Provider>
  );
};

export default DownloadButton;
