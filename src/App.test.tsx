import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "fs";
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

describe("App with a shared plan", function () {
  const samplePlan = readFileSync("public/sampleplan.yaml", "utf8");

  // Answer requests to a plan host with the given response, and everything else from public/.
  function hostSharedPlan(response: Partial<Response>) {
    const publicFiles = servePublicFiles();
    const fetchMock = jest.fn(async (url: RequestInfo | URL) =>
      String(url).startsWith("https://")
        ? ({ ok: true, status: 200, ...response } as Response)
        : publicFiles(url),
    );
    globalThis.fetch = fetchMock;
    return fetchMock;
  }

  it("loads the plan named in the URL and lays it out", async function () {
    const fetchMock = hostSharedPlan({ text: async () => samplePlan });

    const { container } = renderApp(
      "?plan=gist:someuser/a47c4688520b1cf0&u=mi&d=2030-06-02&s=1",
    );

    expect(
      await screen.findByText("Half Marathon (13.1 mi)"),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://gist.githubusercontent.com/someuser/a47c4688520b1cf0/raw",
    );
    expect(container.querySelectorAll(".workout-card")).toHaveLength(14);

    const params = new URLSearchParams(window.location.search);
    expect(params.get("plan")).toBe("gist:someuser/a47c4688520b1cf0");
    expect(params.get("d")).toBe("2030-06-02");
    expect(params.has("p")).toBe(false);
  });

  it("keeps the shared plan in the URL when the layout changes", async function () {
    hostSharedPlan({ text: async () => samplePlan });
    renderApp("?plan=gist:someuser/a47c4688520b1cf0&u=mi&d=2030-06-02&s=1");
    await screen.findByText("Half Marathon (13.1 mi)");

    await userEvent.click(screen.getByLabelText("Km"));

    expect(screen.getByText("Half Marathon (21.1 km)")).toBeInTheDocument();
    const params = new URLSearchParams(window.location.search);
    expect(params.get("plan")).toBe("gist:someuser/a47c4688520b1cf0");
    expect(params.get("u")).toBe("km");
    expect(params.has("p")).toBe(false);
  });

  it("loads a plan from a link entered in the form", async function () {
    const fetchMock = hostSharedPlan({ text: async () => samplePlan });
    renderApp("?u=mi&d=2030-06-02&s=1");
    await userEvent.click(await screen.findByRole("button", { name: "BYOP" }));

    await userEvent.type(
      screen.getByLabelText("From a link"),
      "gist.github.com/someuser/a47c4688520b1cf0",
    );
    await userEvent.click(screen.getByRole("button", { name: "Load" }));

    expect(
      await screen.findByText("Half Marathon (13.1 mi)"),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://gist.githubusercontent.com/someuser/a47c4688520b1cf0/raw",
    );
    const params = new URLSearchParams(window.location.search);
    expect(params.get("plan")).toBe("gist:someuser/a47c4688520b1cf0");
    expect(params.has("p")).toBe(false);
  });

  it("refuses a link to an unsupported site", async function () {
    const fetchMock = hostSharedPlan({ text: async () => samplePlan });
    renderApp("?u=mi");
    await userEvent.click(await screen.findByRole("button", { name: "BYOP" }));
    fetchMock.mockClear();

    await userEvent.type(
      screen.getByLabelText("From a link"),
      "https://example.com/plan.yaml{Enter}",
    );

    expect(
      await screen.findByText("Only GitHub Gist links are supported."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("From a link")).toBeEnabled();
  });

  it("explains when the shared plan cannot be loaded", async function () {
    hostSharedPlan({ ok: false, status: 404 });

    const { container } = renderApp("?plan=gist:someuser/a47c4688520b1cf0");

    expect(
      await screen.findByText(/No plan was found at gist\.github\.com/),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".workout-card")).toHaveLength(0);
  });

  it("rejects a plan parameter it does not understand", async function () {
    const fetchMock = hostSharedPlan({ text: async () => samplePlan });

    renderApp("?plan=https://example.com/plan.yaml");

    expect(
      await screen.findByText(
        "This link does not point to a plan that can be loaded.",
      ),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
