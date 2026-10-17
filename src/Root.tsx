import Index from "./Index";
import About from "./About";
import { Config } from "./ch/config";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// The whole application: providers, router and pages.
const Root = () => {
  return (
    <DndProvider options={HTML5toTouch}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
        <div className="app">
          <BrowserRouter basename={Config.basePath}>
            <Routes>
              <Route path="/" element={<Index />}>
                {/* the calendar is rendered by Index itself, so it can stay alive behind other pages */}
                <Route index element={null} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </QueryParamProvider>
    </DndProvider>
  );
};

export default Root;
