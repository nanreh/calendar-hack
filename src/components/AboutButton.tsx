import { FaInfoCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import { NavLink } from "react-router-dom";

const AboutButton = () => {
  return (
    <IconContext.Provider value={{}}>
      <div className="tool-button">
        <NavLink to="/about">
          <FaInfoCircle style={{ verticalAlign: "middle" }} />
        </NavLink>
      </div>
    </IconContext.Provider>
  );
};

export default AboutButton;
