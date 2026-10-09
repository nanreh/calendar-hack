import { NavLink, useLocation, useNavigate } from "react-router-dom";

interface Props {
  size?: number;
  points?: number;
}

const AboutBurst = ({ size = 80, points = 30 }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAboutPage = location.pathname.replace(/\/+$/, "") === "/about";
  // The trailing slash matters: "about/" is the path that exists on the web server, so a reload
  // while on the page works and keeps the query.
  const targetPath = isAboutPage ? "/" : "/about/";
  const displayText = isAboutPage ? "Plan" : "About";

  // Generate starburst path
  const cx = 50;
  const cy = 50;
  const outerRadius = 48;
  const innerRadius = 40;

  const pathPoints: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    pathPoints.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const path = pathPoints.join(" ") + " Z";

  return (
    <NavLink
      to={targetPath}
      className="about-burst"
      onClick={(e) => {
        // Take the query along, so the address still describes the calendar on the way back.
        // It is read from the address bar because the calendar updates it without telling the router.
        e.preventDefault();
        navigate({ pathname: targetPath, search: window.location.search });
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} className="burst-shape" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="burst-text"
          key={displayText}
        >
          {displayText}
        </text>
      </svg>
    </NavLink>
  );
};

export default AboutBurst;
