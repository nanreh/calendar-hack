import { render, screen } from "@testing-library/react";
import { PlanDetailsCard } from "./PlanDetailsCard";
import type { RacePlan } from "../ch/dategrid";

const planFrom = (sourceUrl: string) =>
  ({ description: "A plan", sourceUrl }) as RacePlan;

describe("PlanDetailsCard", function () {
  it("should link to a source that is a web address", function () {
    render(<PlanDetailsCard racePlan={planFrom("https://example.com/plan")} />);

    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
      "href",
      "https://example.com/plan",
    );
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<p>hi</p>",
    "My notebook",
    "",
  ])("should not link to the source %p", function (sourceUrl) {
    render(<PlanDetailsCard racePlan={planFrom(sourceUrl)} />);

    expect(screen.getByText("A plan")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
