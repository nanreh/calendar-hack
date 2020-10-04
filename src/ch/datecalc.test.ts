import { calcPlanDates } from './datecalc';

describe('Calendar Calc', function () {
    it('should compute correct start and end when race is on Sunday', function () {
        const aSunday = new Date(2020, 3, 19);
        expect(calcPlanDates(1, aSunday)).toEqual({
            start: new Date(2020, 3, 13),
            planStartDate: new Date(2020, 3, 13),
            planEndDate: aSunday,
            end: aSunday,
            weekCount: 1,
        })
        expect(calcPlanDates(2, aSunday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 6),
            planEndDate: aSunday,
            end: aSunday,
            weekCount: 2,
        })
    });
    it('should compute correct start and end when race is on Saturday', function () {
        const aSaturday = new Date(2020, 3, 18);
        expect(calcPlanDates(1, aSaturday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 12),
            planEndDate: aSaturday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aSaturday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 3, 5),
            planEndDate: aSaturday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
    it('should compute correct start and end when race is on Friday', function () {
        const aFriday = new Date(2020, 3, 17);
        expect(calcPlanDates(1, aFriday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 11),
            planEndDate: aFriday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aFriday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 3, 4),
            planEndDate: aFriday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
    it('should compute correct start and end when race is on Thursday', function () {
        const aThursday = new Date(2020, 3, 16);
        expect(calcPlanDates(1, aThursday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 10),
            planEndDate: aThursday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aThursday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 3, 3),
            planEndDate: aThursday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
    it('should compute correct start and end when race is on Wednesday', function () {
        const aWednesday = new Date(2020, 3, 15);
        expect(calcPlanDates(1, aWednesday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 9),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aWednesday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 3, 2),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
    it('should compute correct start and end when race is on Tuesday', function () {
        const aWednesday = new Date(2020, 3, 14);
        expect(calcPlanDates(1, aWednesday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 8),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aWednesday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 3, 1),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
    it('should compute correct start and end when race is on Monday', function () {
        const aWednesday = new Date(2020, 3, 13);
        expect(calcPlanDates(1, aWednesday)).toEqual({
            start: new Date(2020, 3, 6),
            planStartDate: new Date(2020, 3, 7),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 2,
        })
        expect(calcPlanDates(2, aWednesday)).toEqual({
            start: new Date(2020, 2, 30),
            planStartDate: new Date(2020, 2, 31),
            planEndDate: aWednesday,
            end: new Date(2020, 3, 19),
            weekCount: 3,
        })
    });
});