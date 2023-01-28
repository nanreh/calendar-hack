import { calcPlanDates } from "./datecalc";

describe("Date Calc", function () {
  describe("race on Sunday", function () {
    it("week starts on Monday", function () {
      const aSunday = new Date(2020, 3, 19);
      expect(calcPlanDates(1, aSunday, 1)).toEqual({
        start: new Date(2020, 3, 13),
        planStartDate: new Date(2020, 3, 13),
        planEndDate: aSunday,
        end: aSunday,
        weekCount: 1,
      });
      expect(calcPlanDates(2, aSunday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 6),
        planEndDate: aSunday,
        end: aSunday,
        weekCount: 2,
      });
    });
    it("week starts on Sunday", function () {
      const aSunday = new Date(2020, 3, 19);
      expect(calcPlanDates(1, aSunday, 0)).toEqual({
        start: new Date(2020, 3, 12),
        planStartDate: new Date(2020, 3, 13),
        planEndDate: aSunday,
        end: new Date(2020, 3, 25),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aSunday, 0)).toEqual({
        start: new Date(2020, 3, 5),
        planStartDate: new Date(2020, 3, 6),
        planEndDate: aSunday,
        end: new Date(2020, 3, 25),
        weekCount: 3,
      });
    });
    it("week starts on Saturday", function () {
      const aSunday = new Date(2020, 3, 19);
      expect(calcPlanDates(1, aSunday, 6)).toEqual({
        start: new Date(2020, 3, 11),
        planStartDate: new Date(2020, 3, 13),
        planEndDate: aSunday,
        end: new Date(2020, 3, 24),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aSunday, 6)).toEqual({
        start: new Date(2020, 3, 4),
        planStartDate: new Date(2020, 3, 6),
        planEndDate: aSunday,
        end: new Date(2020, 3, 24),
        weekCount: 3,
      });
    });
  });
  describe("race on Saturday", function () {
    // week starts on monday
    it("week starts on Sunday", function () {
      const aSaturday = new Date(2020, 3, 18);
      expect(calcPlanDates(1, aSaturday, 0)).toEqual({
        start: new Date(2020, 3, 12),
        planStartDate: new Date(2020, 3, 12),
        planEndDate: aSaturday,
        end: aSaturday,
        weekCount: 1,
      });
      expect(calcPlanDates(2, aSaturday, 0)).toEqual({
        start: new Date(2020, 3, 5),
        planStartDate: new Date(2020, 3, 5),
        planEndDate: aSaturday,
        end: aSaturday,
        weekCount: 2,
      });
    });
    // week starts on saturday
  });

  describe("race on Friday", function () {
    it("week starts on Monday", function () {
      const aFriday = new Date(2020, 3, 17);
      expect(calcPlanDates(1, aFriday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 11),
        planEndDate: aFriday,
        end: new Date(2020, 3, 19),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aFriday, 1)).toEqual({
        start: new Date(2020, 2, 30),
        planStartDate: new Date(2020, 3, 4),
        planEndDate: aFriday,
        end: new Date(2020, 3, 19),
        weekCount: 3,
      });
    });
    // week starts on Saturday
    // week starts on Sunday
  });
  describe("race on Thursday", function () {
    it("week starts on Monday", function () {
      const aThursday = new Date(2020, 3, 16);
      expect(calcPlanDates(1, aThursday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 10),
        planEndDate: aThursday,
        end: new Date(2020, 3, 19),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aThursday, 1)).toEqual({
        start: new Date(2020, 2, 30),
        planStartDate: new Date(2020, 3, 3),
        planEndDate: aThursday,
        end: new Date(2020, 3, 19),
        weekCount: 3,
      });
    });
    // week starts on Saturday
    // week starts on Sunday
  });
  describe("race on Wednesday", function () {
    it("week starts on Monday", function () {
      const aWednesday = new Date(2020, 3, 15);
      expect(calcPlanDates(1, aWednesday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 9),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aWednesday, 1)).toEqual({
        start: new Date(2020, 2, 30),
        planStartDate: new Date(2020, 3, 2),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 3,
      });
    });
    // week starts on Saturday
    // week starts on Sunday
  });
  describe("race on Tuesday", function () {
    it("Week starts on Monday", function () {
      const aWednesday = new Date(2020, 3, 14);
      expect(calcPlanDates(1, aWednesday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 8),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aWednesday, 1)).toEqual({
        start: new Date(2020, 2, 30),
        planStartDate: new Date(2020, 3, 1),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 3,
      });
    });
    // week starts on Saturday
    // week starts on Sunday
  });
  describe("race on Monday", function () {
    it("Week starts on Monday", function () {
      const aWednesday = new Date(2020, 3, 13);
      expect(calcPlanDates(1, aWednesday, 1)).toEqual({
        start: new Date(2020, 3, 6),
        planStartDate: new Date(2020, 3, 7),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 2,
      });
      expect(calcPlanDates(2, aWednesday, 1)).toEqual({
        start: new Date(2020, 2, 30),
        planStartDate: new Date(2020, 2, 31),
        planEndDate: aWednesday,
        end: new Date(2020, 3, 19),
        weekCount: 3,
      });
    });
    // week starts on Saturday
    // week starts on Sunday
  });
});
