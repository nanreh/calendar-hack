import {
  format,
  isWithinInterval,
  eachDayOfInterval,
  differenceInWeeks,
  isBefore,
  isAfter,
  addDays,
  addWeeks,
} from "date-fns";
import {
  startOfWeek,
  startOfDay,
  endOfWeek,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
} from "date-fns";
import { WeekStartsOn, WeekStartsOnValues } from "./datecalc";

export type dayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export const key = (d: Date) => format(d, "yyyy/MM/dd");

export interface Day<T> {
  date: Date;
  event: T | undefined;
}
export interface Week<T> {
  weekNum: number;
  dist: number;
  desc: string;
  days: Day<T>[];
}

// A grid of dates. Always represents one or more contiguous weeks.
// Each week is Monday through Sunday currently.
// Each date can have an instance of T assigned to it, undefined is valid
// for dates without any data currently assigned.
// Data for any two dates can be swapped with swap(date1, date2)
// Data for all Tuesday dates can be swapped with data from all Monday
// dates with swapDow('Monday'. 'Tuesday').

export class DateGrid<T> {
  private _events: Map<string, T> = new Map();

  private _min: Date | undefined = undefined;
  private _max: Date | undefined = undefined;
  private _first: Date | undefined = undefined;
  private _last: Date | undefined = undefined;
  private _weekCount: number = 0;
  private _weekStartsOn: WeekStartsOn = WeekStartsOnValues.Monday;

  constructor(events: Map<Date, T>, weekStartsOn: WeekStartsOn) {
    this._weekStartsOn = weekStartsOn;
    events?.forEach((v, k) => {
      this.setEvent(k, v);
    });
  }

  get min(): Date | undefined {
    return this._min;
  }

  get max(): Date | undefined {
    return this._max;
  }

  get first(): Date | undefined {
    return this._first;
  }

  get last(): Date | undefined {
    return this._last;
  }

  get weekCount(): number {
    return this._weekCount;
  }

  get days(): Day<T>[] {
    if (!this.first || !this.last) return [];
    const dates = eachDayOfInterval({ start: this.first, end: this.last });
    const res = dates.map((d) => {
      return { date: d, event: this.getEvent(d) };
    });
    return res;
  }

  get weeks(): Week<T>[] {
    const weeks = [];
    const allDays = this.days;
    for (let i = 0; i < this.weekCount; i++) {
      const daysSlice = allDays.slice(i * 7, i * 7 + 7);
      weeks.push({ weekNum: i, dist: 0.0, desc: `Week ${i}`, days: daysSlice });
    }
    return weeks;
  }

  clone(): DateGrid<T> {
    const res = new DateGrid<T>(new Map(), this._weekStartsOn);
    res._events = new Map<string, T>(this._events);
    res._min = this._min;
    res._max = this._max;
    res._first = this._first;
    res._last = this._last;
    res._weekCount = this._weekCount;
    return res;
  }

  setEvent(date: Date, event: T | undefined) {
    const k = key(date);
    if (event) {
      this._events.set(k, event);
      // min/max/first/last/weekCount maintenance
      if (!this._max || isAfter(date, this._max)) this._max = date;
      this._last = startOfDay(
        endOfWeek(this._max, { weekStartsOn: this._weekStartsOn })
      );
      if (!this._min || isBefore(date, this._min)) this._min = date;
      this._first = startOfWeek(this._min, {
        weekStartsOn: this._weekStartsOn,
      });
      this._weekCount = differenceInWeeks(
        startOfDay(addDays(this._last, 1)),
        this._first
      );
    } else {
      this._events.delete(k);
    }
  }

  getEvent(date: Date): T | undefined {
    this.validate(date);
    const k = key(date);
    const r = this._events.get(k);
    return r;
  }

  private validate(d: Date) {
    if (!this.first || !this.last) return;
    if (!isWithinInterval(d, { start: this.first, end: this.last }))
      throw new Error(
        `"date ${key(d)} is not within interval (${key(this.first)},${key(
          this.last
        )})`
      );
  }

  swap(d1: Date, d2: Date) {
    const e1 = this.getEvent(d1);
    const e2 = this.getEvent(d2);
    if (e1 && e2) {
      // only swap if both dates have event data
      const temp = e1;
      this.setEvent(d1, e2);
      this.setEvent(d2, temp);
    }
  }

  swapDow(dow1: dayOfWeek, dow2: dayOfWeek) {
    if (dow1 === dow2) return;

    const firstSelection = this.selectAll(dow1);
    const secondSelection = this.selectAll(dow2);
    if (firstSelection.length !== secondSelection.length) {
      throw new Error(`selection lengths do not match`);
    }

    for (let i = 0; i < firstSelection.length; i++) {
      this.swap(firstSelection[i], secondSelection[i]);
    }
  }

  selectWeek(weekNum: number) {
    if (!this.first || !this.last) return [];
    const d1 = addWeeks(this.first, weekNum);
    const d2 = addDays(d1, 6);
    return eachDayOfInterval({ start: d1, end: d2 });
  }

  selectAll(dow: dayOfWeek) {
    if (!this.first || !this.last) return [];
    const dates = eachDayOfInterval({ start: this.first, end: this.last });
    switch (dow) {
      case "Monday":
        return dates.filter((d) => isMonday(d));
      case "Tuesday":
        return dates.filter((d) => isTuesday(d));
      case "Wednesday":
        return dates.filter((d) => isWednesday(d));
      case "Thursday":
        return dates.filter((d) => isThursday(d));
      case "Friday":
        return dates.filter((d) => isFriday(d));
      case "Saturday":
        return dates.filter((d) => isSaturday(d));
      case "Sunday":
        return dates.filter((d) => isSunday(d));
      default:
        throw new Error(`unhandled day of week ${dow}`);
    }
  }

  swapWeeks(w1: number, w2: number) {
    if (w1 === w2) return;
    if (!this.first || !this.last) return;
    const datesW1 = this.selectWeek(w1);
    const datesW2 = this.selectWeek(w2);
    for (let i = 0; i < datesW1.length; i++) {
      this.swap(datesW1[i], datesW2[i]);
    }
  }
}
