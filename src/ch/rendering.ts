import * as moo from "moo";
import { Week, DayDetails, Units } from "types/app";

export function kmToMiles(value: number): number {
  return value * 0.62137;
}

export function miToKm(value: number): number {
  return value / 0.62137;
}

export function getWeekDistance(week: Week<DayDetails>, units: Units): number[] {
  let min = 0;
  let max = 0;
  let hasRange = false;

  for (const day of week.days) {
    const e = day.event;
    if (!e || !e.dist || e.dist.length === 0) continue;

    if (e.dist.length === 1) {
      const dist = units === e.sourceUnits ? e.dist[0] :
        (e.sourceUnits === "mi" ? miToKm(e.dist[0]) : kmToMiles(e.dist[0]));
      min += dist;
      max += dist;
    } else if (e.dist.length === 2) {
      let [lo, hi] = e.dist;
      if (units !== e.sourceUnits) {
        lo = e.sourceUnits === "mi" ? miToKm(lo) : kmToMiles(lo);
        hi = e.sourceUnits === "mi" ? miToKm(hi) : kmToMiles(hi);
      }
      min += lo;
      max += hi;
      hasRange = true;
    }
  }
  return hasRange ? [min, max] : [max];
}


export function renderDist(value: number[], from: Units, to: Units): string {
  function convert(val: number): number {
    return from === to ? val : from === "mi" ? val / 0.62137 : val * 0.62137;
  }

  function format(val: number): string {
    return Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1);
  }

  if (Array.isArray(value)) {
    if (value.length === 1) {
      const v = convert(value[0]);
      return format(v) + " " + to;
    }
    if (value.length === 2) {
      const [v1, v2] = value.map(convert);
      return format(v1) +  "-" + format(v2) + " " + to;
    }
  }
  return "";
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

// function getUnitLabel(unit: Units): string {
//   return unit === "km" ? "km" : "mi";
// }

function handle_conversions(input: string, from: Units, to: Units): string {
  let result = "";
  dlexer.reset(input);
  let t = dlexer.next();

  while (t) {
    if (t.type === "single") {
      // e.g. {9}
      const out = renderDist([Number(t.value)], from, to);
      result += out;
    } else if (t.type === "with_conversion") {
      // e.g. {9:14}
      const [fromVal, toVal] = t.value.split(":").map(Number);
      const out = from === to
        ? renderDist([fromVal], from, from)
        : renderDist([toVal], to, to);
      result += out;
    } else if (t.type === "with_range") {
      // e.g. {8-9:13-14}
      const [fromRange, toRange] = t.value.split(":");
      const [fromStart, fromEnd] = fromRange.split("-").map(Number);
      const [toStart, toEnd] = toRange.split("-").map(Number);
      const out = from === to
        ? renderDist([fromStart, fromEnd], from, from)
        : renderDist([toStart, toEnd], to, to);
      result += out;
    } else {
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
