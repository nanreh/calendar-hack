import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import App from "./App";
import { servePublicFiles } from "../test/servePublicFiles";

function renderApp(query: string) {
  window.history.replaceState(null, "", `/hacks/calendarhack/${query}`);
  return render(
    <DndProvider options={HTML5toTouch}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
        <App />
      </QueryParamProvider>
    </DndProvider>,
  );
}

describe("App", function () {
  beforeEach(servePublicFiles);

  it("renders the selected plan as a calendar", async function () {
    const { container } = renderApp("?p=higdon_int_mara1&u=mi");

    // 18 week plan, 7 workouts per week
    expect(await screen.findByText("Week 18")).toBeInTheDocument();
    expect(container.querySelectorAll(".workout-card")).toHaveLength(126);
    expect(container.querySelector("select")).toHaveDisplayValue(
      "(Marathon) Hal Higdon: Intermediate 1",
    );

    const firstWeek = container.querySelectorAll<HTMLElement>(".week-grid")[1];
    expect(within(firstWeek).getByText("Week: 24 mi")).toBeInTheDocument();
    expect(within(firstWeek).getByText("8 mi")).toBeInTheDocument();
  });

  it("converts distances when the units change", async function () {
    const { container } = renderApp("?p=higdon_int_mara1&u=mi");
    await screen.findByText("Week 18");

    await userEvent.click(screen.getByLabelText("Km"));

    const firstWeek = container.querySelectorAll<HTMLElement>(".week-grid")[1];
    expect(within(firstWeek).getByText("Week: 38.6 km")).toBeInTheDocument();
    expect(within(firstWeek).getByText("12.9 km")).toBeInTheDocument();
    expect(window.location.search).toContain("u=km");
  });

  it("shows a notice and no calendar for a removed plan", async function () {
    const { container } = renderApp("?p=pfitz_18_55&u=mi");

    expect(
      await screen.findByText("THIS PLAN HAS BEEN REMOVED"),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".workout-card")).toHaveLength(0);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
