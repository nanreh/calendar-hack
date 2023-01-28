import React from "react";
import HomeButton from "./HomeButton";
import AboutButton from "./AboutButton";
import GitHubButton from "./GitHubButton";
import styled from "styled-components";

interface Props {
  downloadHandler: () => void;
}

const Tools = styled.div`
  display: grid;
  grid-template-columns: 10% auto 10%;
  margin: 5px;
`;
const ToolsStart = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
`;
const ToolsMiddle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > h1 {
    font-weight: 900;
  }
  @media (max-width: ${(props) => props.theme.screenSizes.sm}) {
    & > h1 {
      font-size: 1.5em;
    }
  }
`;
const ToolsEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 5px 0;
`;

const Title = styled.h1`
  display: inline;
  margin: 0 0.4em;
  color: ${(props) => props.theme.colors.buttonIcons};
`;

const Toolbar: React.FC<Props> = ({ downloadHandler }) => {
  return (
    <>
      <Tools>
        <ToolsStart>
          <HomeButton />
          <AboutButton />
          <GitHubButton />
        </ToolsStart>
        <ToolsMiddle>
          <Title>Calendar Hack</Title>
        </ToolsMiddle>
        <ToolsEnd>
          {/* <ShareButton /> */}
          {/* <DownloadButton downloadHandler={downloadHandler} /> */}
        </ToolsEnd>
      </Tools>
    </>
  );
};

export default Toolbar;
