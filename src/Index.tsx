import { useState } from "react";
import { Outlet, useLocation } from "react-router";

import App from "./App";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

const Index = () => {
  const onCalendar = useLocation().pathname === "/";
  // The calendar is created on the first visit to it and then kept, hidden, while another page
  // is showing. That way the plan, its layout, any rearranged workouts and the undo history are
  // all still there on the way back.
  const [calendarStarted, setCalendarStarted] = useState(onCalendar);
  if (onCalendar && !calendarStarted) {
    setCalendarStarted(true);
  }

  return (
    <>
      <Toolbar />
      {calendarStarted && (
        <div style={{ display: onCalendar ? undefined : "none" }}>
          <App />
        </div>
      )}
      <Outlet />
      <Footer />
    </>
  );
};

export default Index;
