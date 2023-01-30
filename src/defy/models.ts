export type Units = "mi" | "km";

export const metersPerMile = 1609.344;

export type RaceDistance = {
  name: string;
  distance: number;
  worldRecord: number;
  defaultTime: number;
};

function toSeconds(hours: number, minutes: number, seconds: number) {
  return hours * 60 * 60 + minutes * 60 + seconds;
}

export type RaceType = "Marathon" | "Half Marathon" | "5K" | "10K";

export class Distance {
  private readonly _meters: number;
  constructor(meters: number) {
    this._meters = meters;
  }

  get meters(): number {
    return this._meters;
  }

  get miles(): number {
    return this._meters * 0.00062137;
  }

  static fromMiles(miles: number): Distance {
    return new Distance(miles / 0.00062137);
  }
}

export function toDistance(raceType: RaceType): Distance {
  switch (raceType) {
    case "5K":
      return new Distance(5000);
    case "10K":
      return new Distance(10000);
    case "Half Marathon":
      return new Distance(21097.5);
    case "Marathon":
      return new Distance(42195.0);
  }
}

export const distances: { [key: string]: RaceDistance } = {
  Marathon: {
    name: "Marathon",
    distance: 42195,
    worldRecord: toSeconds(2, 1, 39),
    defaultTime: toSeconds(2, 59, 59),
  }, //  2:01:39
  "Half Marathon": {
    name: "Half Marathon",
    distance: 21097.5,
    worldRecord: toSeconds(0, 58, 1),
    defaultTime: toSeconds(1, 29, 59),
  }, // 58:01
  "5K": {
    name: "5K",
    distance: 5000,
    worldRecord: toSeconds(0, 12, 51),
    defaultTime: toSeconds(0, 19, 59),
  }, //12:51
  "10K": {
    name: "10K",
    distance: 10000,
    worldRecord: toSeconds(0, 26, 24),
    defaultTime: toSeconds(0, 39, 59),
  }, // 26:24
  "15K": {
    name: "15K",
    distance: 15000,
    worldRecord: toSeconds(0, 41, 5),
    defaultTime: toSeconds(1, 2, 59),
  }, // 41:05
  "20K": {
    name: "20K",
    distance: 20000,
    worldRecord: toSeconds(0, 55, 21),
    defaultTime: toSeconds(1, 24, 59),
  }, // 55:21
  "30K": {
    name: "30K",
    distance: 30000,
    worldRecord: toSeconds(1, 26, 45),
    defaultTime: toSeconds(2, 7, 59),
  }, // 1:26:45
  "50K": {
    name: "50K",
    distance: 50000,
    worldRecord: toSeconds(2, 43, 38),
    defaultTime: toSeconds(3, 44, 59),
  }, // 2:43:38
};

export type Milestone = {
  name: string;
  distance: number;
};
export const milestones: Milestone[] = [
  { name: "10K", distance: 10000 },
  { name: "20K", distance: 20000 },
  { name: "Half Marathon", distance: 21097.5 },
  { name: "30K", distance: 30000 },
  { name: "40K", distance: 40000 },
  { name: "The Wall (20mi)", distance: 20 * metersPerMile },
];

export function metersToMi(meters: number): number {
  return meters / metersPerMile;
}
export function metersToKm(meters: number): number {
  return meters / 1000;
}

export function time(distance: number, rate: number) {
  return distance / rate;
}
export function distance(rate: number, time: number) {
  return rate * time;
}
export function rate(distance: number, time: number) {
  return distance / time;
}

export type renderOpts = {
  leadingZeroes: boolean;
  padHours: boolean;
  padMinutes: boolean;
  padSeconds: boolean;
};

export const humanizeDuration = function (
  durationSecs: number,
  opts: renderOpts
): string {
  const totalSeconds = Math.floor(durationSecs);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  let toRender: string[] = [];
  if (hours > 0 || opts.leadingZeroes) {
    toRender.push(
      opts.padHours ? hours.toFixed().padStart(2, "0") : hours.toFixed()
    );
  }
  if (hours > 0 || minutes > 0 || opts.leadingZeroes) {
    toRender.push(
      opts.padMinutes ? minutes.toFixed().padStart(2, "0") : minutes.toFixed()
    );
  }
  if (hours > 0 || minutes > 0 || seconds > 0 || opts.leadingZeroes) {
    toRender.push(
      opts.padSeconds ? seconds.toFixed().padStart(2, "0") : seconds.toFixed()
    );
  }
  return toRender.join(":");
};

export const humanizeDistance = function (
  distanceMeters: number,
  units: Units
): string {
  const d =
    units === "mi"
      ? metersToMi(distanceMeters).toFixed(1)
      : metersToKm(distanceMeters).toFixed(1);
  const res = d.endsWith(".0") ? d.slice(0, d.length - 2) : d;
  return res + (units === "mi" ? "mi" : "km");
};
