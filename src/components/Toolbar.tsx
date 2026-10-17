import GitHubButton from "./GitHubButton";
import AboutBurst from "./AboutBurst";

const Toolbar = () => {
  return (
    <>
      <div className="toolbar">
        <div className="tools-start">
          <div className="burst-container">
            <AboutBurst size={80} />
          </div>
        </div>
        <div className="tools-middle">
          <h1>Calendar Hack</h1>
        </div>
        <div className="tools-end">
          <GitHubButton />
        </div>
      </div>
    </>
  );
};

export default Toolbar;
