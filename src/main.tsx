import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/reset.css";
import "./index.css";
import App from "./App";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./About";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DndProvider options={HTML5toTouch}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
          <div className="app">
            <BrowserRouter basename="/hacks/calendarhack">
              <Routes>
                  <Route index element={<App/>}/>
                  <Route path="about" element={<About/>}/>
              </Routes>
            </BrowserRouter>
          </div>
      </QueryParamProvider>
    </DndProvider>
  </StrictMode>,
);
