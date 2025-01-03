import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import "./css/reset.css";
import App from "./App";
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider options={HTML5toTouch}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
        <App />
      </QueryParamProvider>
    </DndProvider>
  </StrictMode>,
)

