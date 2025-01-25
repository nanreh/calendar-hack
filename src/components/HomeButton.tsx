import { FaHome } from "react-icons/fa";
import { IconContext } from "react-icons";
import { NavLink } from "react-router-dom";

const HomeButton = () => {
  return (
    <IconContext.Provider value={{}}>
      <div className="tool-button">
        <NavLink to="/">
            <FaHome style={{ verticalAlign: "middle" }} />
        </NavLink>
      </div>
    </IconContext.Provider>
  );
};

export default HomeButton;
