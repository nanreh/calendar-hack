import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useContext } from "react";
import { ThemeContext } from "styled-components";

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
const HomeButton = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <IconContext.Provider value={{ color: themeContext?.colors.buttonIcons }}>
      <Root>
        <Link href="./about">
          <FaInfoCircle style={{ verticalAlign: "middle" }} />
        </Link>
      </Root>
    </IconContext.Provider>
  );
};

export default HomeButton;
