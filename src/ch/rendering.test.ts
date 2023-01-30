import { renderStr } from "./rendering";

describe("Rendering", function () {
  it("should render strings in correct units", async function () {
    const strOne = "{6} Easy";
    expect(renderStr(strOne, "mi", "km")).toEqual("9.7 km Easy");
    expect(renderStr(strOne, "mi", "mi")).toEqual("6 mi Easy");

    const strTwo =
      "{5.5} Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n{2} Cool Down";
    expect(renderStr(strTwo, "mi", "km")).toEqual(
      "8.9 km Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n3.2 km Cool Down"
    );
    expect(renderStr(strTwo, "mi", "mi")).toEqual(
      "5.5 mi Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n2 mi Cool Down"
    );

    const strThree =
      "{1.5} Warm Up\n2 x {3} @ MP - 10s w. {1} jog rest\n{1.5} Cool Down";
    expect(renderStr(strThree, "mi", "km")).toEqual(
      "2.4 km Warm Up\n2 x 4.8 km @ MP - 10s w. 1.6 km jog rest\n2.4 km Cool Down"
    );
    expect(renderStr(strThree, "mi", "mi")).toEqual(
      "1.5 mi Warm Up\n2 x 3 mi @ MP - 10s w. 1 mi jog rest\n1.5 mi Cool Down"
    );

    const four = "{1} Warm Up\n{9} Tempo @ Goal MP\n{1} Cool Down";
    expect(renderStr(four, "mi", "km")).toEqual(
      "1.6 km Warm Up\n14.5 km Tempo @ Goal MP\n1.6 km Cool Down"
    );
    expect(renderStr(four, "mi", "mi")).toEqual(
      "1 mi Warm Up\n9 mi Tempo @ Goal MP\n1 mi Cool Down"
    );

    const five = "{5} Warm Up\n{9} Tempo @ Goal MP\n{1} Cool Down";
    expect(renderStr(five, "km", "km")).toEqual(
      "5 km Warm Up\n9 km Tempo @ Goal MP\n1 km Cool Down"
    );
    expect(renderStr(five, "km", "mi")).toEqual(
      "3.1 mi Warm Up\n5.6 mi Tempo @ Goal MP\n0.6 mi Cool Down"
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
