import { renderStr, renderDist, kmToMiles, miToKm, getWeekDistance } from "./rendering";
import { Week, DayDetails, Tags } from "types/app";

describe("Rendering", function () {
  describe("renderStr", function () {
    it("should render strings in correct units", async function () {
    const strOne = "{6} Easy";
    expect(renderStr(strOne, "mi", "km")).toEqual("9.7 km Easy");
    expect(renderStr(strOne, "mi", "mi")).toEqual("6 mi Easy");

    const strTwo =
      "{5.5} Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n{2} Cool Down";
    expect(renderStr(strTwo, "mi", "km")).toEqual(
      "8.9 km Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n3.2 km Cool Down",
    );
    expect(renderStr(strTwo, "mi", "mi")).toEqual(
      "5.5 mi Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n2 mi Cool Down",
    );

    const strThree =
      "{1.5} Warm Up\n2 x {3} @ MP - 10s w. {1} jog rest\n{1.5} Cool Down";
    expect(renderStr(strThree, "mi", "km")).toEqual(
      "2.4 km Warm Up\n2 x 4.8 km @ MP - 10s w. 1.6 km jog rest\n2.4 km Cool Down",
    );
    expect(renderStr(strThree, "mi", "mi")).toEqual(
      "1.5 mi Warm Up\n2 x 3 mi @ MP - 10s w. 1 mi jog rest\n1.5 mi Cool Down",
    );

    const four = "{1} Warm Up\n{9} Tempo @ Goal MP\n{1} Cool Down";
    expect(renderStr(four, "mi", "km")).toEqual(
      "1.6 km Warm Up\n14.5 km Tempo @ Goal MP\n1.6 km Cool Down",
    );
    expect(renderStr(four, "mi", "mi")).toEqual(
      "1 mi Warm Up\n9 mi Tempo @ Goal MP\n1 mi Cool Down",
    );

    const five = "{5} Warm Up\n{9} Tempo @ Goal MP\n{1} Cool Down";
    expect(renderStr(five, "km", "km")).toEqual(
      "5 km Warm Up\n9 km Tempo @ Goal MP\n1 km Cool Down",
    );
    expect(renderStr(five, "km", "mi")).toEqual(
      "3.1 mi Warm Up\n5.6 mi Tempo @ Goal MP\n0.6 mi Cool Down",
    );

    const six = "Run/walk 15 minutes";
    expect(renderStr(six, "mi", "km")).toEqual("Run/walk 15 minutes");
    expect(renderStr(six, "mi", "mi")).toEqual("Run/walk 15 minutes");

    const seven = "{6:10} Easy";
    expect(renderStr(seven, "mi", "mi")).toEqual("6 mi Easy");
    expect(renderStr(seven, "mi", "km")).toEqual("10 km Easy");

    const eight = "{10:6} Easy";
    expect(renderStr(eight, "km", "km")).toEqual("10 km Easy");
    expect(renderStr(eight, "km", "mi")).toEqual("6 mi Easy");
    });
  });

  describe("kmToMiles", function () {
    it("should convert km to miles", function () {
      expect(kmToMiles(1)).toBeCloseTo(0.62137, 4);
      expect(kmToMiles(10)).toBeCloseTo(6.2137, 4);
      expect(kmToMiles(42.195)).toBeCloseTo(26.2188, 3);
      expect(kmToMiles(0)).toBe(0);
    });
  });

  describe("miToKm", function () {
    it("should convert miles to km", function () {
      expect(miToKm(1)).toBeCloseTo(1.60934, 4);
      expect(miToKm(10)).toBeCloseTo(16.0934, 3);
      expect(miToKm(26.2)).toBeCloseTo(42.1647, 3);
      expect(miToKm(0)).toBe(0);
    });
  });

  describe("renderDist", function () {
    it("should render single value with same units", function () {
      expect(renderDist([10], "mi", "mi")).toBe("10 mi");
      expect(renderDist([5.5], "km", "km")).toBe("5.5 km");
    });

    it("should render single value with unit conversion", function () {
      expect(renderDist([10], "mi", "km")).toBe("16.1 km");
      expect(renderDist([10], "km", "mi")).toBe("6.2 mi");
    });

    it("should render range with same units", function () {
      expect(renderDist([8, 10], "mi", "mi")).toBe("8-10 mi");
      expect(renderDist([5.5, 7.5], "km", "km")).toBe("5.5-7.5 km");
    });

    it("should render range with unit conversion", function () {
      expect(renderDist([8, 10], "mi", "km")).toBe("12.9-16.1 km");
      expect(renderDist([10, 15], "km", "mi")).toBe("6.2-9.3 mi");
    });

    it("should return empty string for empty array", function () {
      expect(renderDist([], "mi", "mi")).toBe("");
    });
  });

  describe("getWeekDistance", function () {
    function createWeek(days: Array<{ dist: number[], sourceUnits: "mi" | "km" } | null>): Week<DayDetails> {
      const weekDays = days.map((d, i) => ({
        date: new Date(2024, 0, i + 1),
        event: d ? {
          title: "Test",
          desc: "",
          tags: [] as Tags[],
          dist: d.dist,
          sourceUnits: d.sourceUnits,
        } : undefined,
      }));
      return {
        weekNum: 0,
        dist: [0],
        desc: "Week 0",
        days: weekDays,
      };
    }

    it("should sum single distances in miles", function () {
      const week = createWeek([
        { dist: [3], sourceUnits: "mi" },
        { dist: [5], sourceUnits: "mi" },
        { dist: [10], sourceUnits: "mi" },
        null,
        null,
        null,
        null,
      ]);
      const result = getWeekDistance(week, "mi");
      expect(result).toEqual([18]);
    });

    it("should convert and sum distances from mi to km", function () {
      const week = createWeek([
        { dist: [10], sourceUnits: "mi" },
        null, null, null, null, null, null,
      ]);
      const result = getWeekDistance(week, "km");
      expect(result[0]).toBeCloseTo(16.09, 1);
    });

    it("should convert and sum distances from km to mi", function () {
      const week = createWeek([
        { dist: [10], sourceUnits: "km" },
        null, null, null, null, null, null,
      ]);
      const result = getWeekDistance(week, "mi");
      expect(result[0]).toBeCloseTo(6.21, 1);
    });

    it("should handle range distances", function () {
      const week = createWeek([
        { dist: [8, 10], sourceUnits: "mi" },
        { dist: [5], sourceUnits: "mi" },
        null, null, null, null, null,
      ]);
      const result = getWeekDistance(week, "mi");
      expect(result).toEqual([13, 15]);
    });

    it("should return [0] for week with no distances", function () {
      const week = createWeek([null, null, null, null, null, null, null]);
      const result = getWeekDistance(week, "mi");
      expect(result).toEqual([0]);
    });

    it("should handle empty dist arrays", function () {
      const week = createWeek([
        { dist: [], sourceUnits: "mi" },
        { dist: [5], sourceUnits: "mi" },
        null, null, null, null, null,
      ]);
      const result = getWeekDistance(week, "mi");
      expect(result).toEqual([5]);
    });
  });
});
