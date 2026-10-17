import { readFileSync } from "fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Root from "./Root";
import { servePublicFiles } from "../test/servePublicFiles";

const samplePlan = readFileSync("public/sampleplan.yaml", "utf8");

function renderAt(pathAndQuery: string) {
  window.history.replaceState(null, "", pathAndQuery);
  return render(<Root />);
}

const aboutLink = () => screen.getByRole("link", { name: "About" });
const planLink = () => screen.getByRole("link", { name: "Plan" });

describe("Moving between the calendar and the About page", function () {
  it("keeps a built-in plan and its layout", async function () {
    const fetchMock = servePublicFiles();
    renderAt("/hacks/calendarhack/?p=c25k&u=mi&d=2030-06-02&s=1");
    await screen.findByText("Week 8");
    await userEvent.click(screen.getByLabelText("Km"));
    const requestsBefore = fetchMock.mock.calls.length;

    await userEvent.click(aboutLink());

    expect(screen.getByRole("heading", { name: "About" })).toBeVisible();
    expect(screen.getByText("Week 8")).not.toBeVisible();
    expect(window.location.pathname).toBe("/hacks/calendarhack/about/");

    await userEvent.click(planLink());

    expect(screen.getByText("Week 8")).toBeVisible();
    expect(screen.getByLabelText("Km")).toBeChecked();
    expect(screen.queryByRole("heading", { name: "About" })).toBeNull();
    // nothing was loaded again
    expect(fetchMock.mock.calls.length).toBe(requestsBefore);
    expect(window.location.pathname).toBe("/hacks/calendarhack/");
    const params = new URLSearchParams(window.location.search);
    expect(params.get("p")).toBe("c25k");
    expect(params.get("u")).toBe("km");
  });

  it("keeps a plan loaded from a file, which has no link to reload from", async function () {
    servePublicFiles();
    renderAt("/hacks/calendarhack/?u=mi&d=2030-06-02&s=1");
    await userEvent.click(await screen.findByRole("button", { name: "BYOP" }));
    await userEvent.upload(
      screen.getByLabelText("Plan file"),
      new File([samplePlan], "plan.yaml", { type: "text/yaml" }),
    );
    await screen.findByText("Half Marathon (13.1 mi)");

    await userEvent.click(aboutLink());
    expect(screen.getByText("Half Marathon (13.1 mi)")).not.toBeVisible();
    await userEvent.click(planLink());

    expect(screen.getByText("Half Marathon (13.1 mi)")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Sample Plan" })).toBeVisible();
    expect(new URLSearchParams(window.location.search).has("p")).toBe(false);
  });

  it.each(["/hacks/calendarhack/about/", "/hacks/calendarhack/about"])(
    "opens the About page from a direct link to %s",
    function (path) {
      servePublicFiles();
      renderAt(path + "?p=c25k&u=km");

      expect(screen.getByRole("heading", { name: "About" })).toBeVisible();
      // the burst offers the way back, and the query is left alone
      expect(planLink()).toBeVisible();
      expect(window.location.search).toBe("?p=c25k&u=km");
    },
  );

  it("does not load a plan when the About page is opened directly", async function () {
    const fetchMock = servePublicFiles();
    renderAt("/hacks/calendarhack/about");

    expect(screen.getByRole("heading", { name: "About" })).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.location.search).toBe("");

    await userEvent.click(planLink());

    expect(await screen.findByText("Week 18")).toBeVisible();
  });
});
