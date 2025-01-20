import { FaGithub } from "react-icons/fa";
import { IconContext } from "react-icons";

const GitHubButton = () => {
  return (
    <IconContext.Provider value={{}}>
      <div className="tool-button">
        <a href="https://github.com/nanreh/calendar-hack">
          <FaGithub style={{ verticalAlign: "middle" }} />
        </a>
      </div>
    </IconContext.Provider>
  );
};

export default GitHubButton;
