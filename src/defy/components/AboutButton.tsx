import { FaInfoCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

const HomeButton = () => {
  return (
    <IconContext.Provider value={{}}>
      <div className="tool-button">
        <Link to="/about">
          <FaInfoCircle style={{ verticalAlign: "middle" }} />
        </Link>
      </div>
    </IconContext.Provider>
  );
};

export default HomeButton;
