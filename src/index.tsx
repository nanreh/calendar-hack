import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { DndProvider } from "react-dnd-multi-backend";
import "./css/reset.css";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

const PageWrapper: React.FC = ({ children }) => {
  return <div style={{ maxWidth: "1200px", margin: "0 auto" }}>{children}</div>;
};

ReactDOM.render(
  <React.StrictMode>
    <DndProvider options={HTML5toTouch}>
      <PageWrapper>
        <App />
      </PageWrapper>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
