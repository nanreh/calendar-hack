import React from "react";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useContext } from "react";
import { ThemeContext } from "styled-components";

interface Props {}

const Root = styled.div`
  border-radius: 50%;
  padding: 3px;
  &:hover {
    cursor: pointer;
  }
`;

const Link = styled.a`
  & > svg {
    width: 2em;
    height: 2em;
    display: block;
    margin-left: -2px;
    margin-right: auto;
  }
`;
const HomeButton: React.FC<Props> = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <IconContext.Provider value={{ color: themeContext.colors.buttonIcons }}>
      <Root>
        <Link href="/">
          <FaHome style={{ verticalAlign: "middle" }} />
        </Link>
      </Root>
    </IconContext.Provider>
  );
};

export default HomeButton;
