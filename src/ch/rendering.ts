import * as moo from "moo";
import { Week, DayDetails, Units } from "types/app";

export function kmToMiles(value: number): number {
  return value * 0.62137;
}

export function miToKm(value: number): number {
  return value / 0.62137;
}

export function getWeekDistance(week: Week<DayDetails>, units: Units): number {
  return week.days
    .map((d) => d.event)
    .reduce((a, e) => {
      if (!e) {
        return a;
      }
      if (units === "mi") {
        if (e.dist) {
          return a + e.dist[0];
        } else {
          return a;
        }
      } else {
        if (e.dist) {
          return a + miToKm(e.dist[0]);
        } else {
          return a;
        }
      }
    }, 0);
}

export function renderDist(value: number, from: Units, to: Units): string {
  let suffix = to;
  if (from === to) {
    return (
      (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)) +
      " " +
      suffix
    );
  }
  if ("mi" === from) {
    return (value / 0.62137).toFixed(1) + " " + suffix;
  }
  return (value * 0.62137).toFixed(1) + " " + suffix;
}


let dlexer = moo.compile({
  with_range: [
    {
      match: /{\d+-\d+:\d+-\d+}/,
      value: (x) => x.slice(1, -1),
    },
  ],
  with_conversion: [
    {
      match: /{\d+(?:\.\d+)?:\d+(?:\.\d+)?}/,
      value: (x) => x.slice(1, -1),
    },
  ],
  single: [
    {
      match: /{\d+(?:\.\d+)?}/,
      value: (x) => x.slice(1, -1),
    },
  ],
  text: /[^{\n}]+/,
  NL: { match: /\n/, lineBreaks: true },
});

function getUnitLabel(unit: Units): string {
  return unit === "km" ? "km" : "mi";
}

function handle_conversions(input: string, from: Units, to: Units): string {
  let result = "";
  dlexer.reset(input);
  let t = dlexer.next();
  while (t) {
    if (t.type === "single") {
      result += renderDist(Number(t.value), from, to);
    } else if (t.type === "with_conversion") {
      let [fromVal, toVal] = t.value.split(":").map(Number);
      if (from === to) {
        result += renderDist(fromVal, from, from);
      } else {
        result += renderDist(toVal, to, to);
      }
    } else if (t.type === "with_range") {
      let [fromRange, toRange] = t.value.split(":");
      const [fromStart, fromEnd] = fromRange.split("-").map(Number);
      const [toStart, toEnd] = toRange.split("-").map(Number);

      if (from === to) {
        const unit = getUnitLabel(from);
        result += `${fromStart}–${fromEnd} ${unit}`;
      } else {
        const unit = getUnitLabel(to);
        result += `${toStart}–${toEnd} ${unit}`;
      }
    } else {
      // text or NL
      result += t.value;
    }
    t = dlexer.next();
  }
  return result;
}



export function renderStr(input: string, from: Units, to: Units): string {
  return handle_conversions(input, from, to);
}

export function render(
  input: DayDetails,
  from: Units,
  to: Units,
): [string, string] {
  // [title, desc]
  let title = handle_conversions(input.title, from, to);
  let desc = handle_conversions(input.desc, from, to);
  return [title, desc];
}
