import { render } from './rendering'

describe("Rendering", function () {

    it('should render strings in correct units', async function () {
        const strOne = "6 miles Easy";
        expect(render(strOne, 'km')).toEqual("9.7 km Easy");
        expect(render(strOne, 'mi')).toEqual("6 mi Easy");

        const strTwo = "5.5 miles Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n2 miles Cool Down";
        expect(render(strTwo, 'km')).toEqual("8.9 km Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n3.2 km Cool Down");
        expect(render(strTwo, 'mi')).toEqual("5.5 mi Warm Up\n8 x 600m @ 5k-10k Pace w. 400m jog rest\n2 mi Cool Down");

        const strThree = "1.5 miles Warm Up\n2 x 3 miles @ MP - 10s w. 1 mile jog rest\n1.5 miles Cool Down";
        expect(render(strThree, 'km')).toEqual("2.4 km Warm Up\n2 x 4.8 km @ MP - 10s w. 1.6 km jog rest\n2.4 km Cool Down");
        expect(render(strThree, 'mi')).toEqual("1.5 mi Warm Up\n2 x 3 mi @ MP - 10s w. 1 mi jog rest\n1.5 mi Cool Down");

        const four = "1 mile Warm Up\n9 miles Tempo @ Goal MP\n1 mile Cool Down";
        expect(render(four, 'km')).toEqual("1.6 km Warm Up\n14.5 km Tempo @ Goal MP\n1.6 km Cool Down");
        expect(render(four, 'mi')).toEqual("1 mi Warm Up\n9 mi Tempo @ Goal MP\n1 mi Cool Down");

        const five = "5km Warm Up\n9 kilometers Tempo @ Goal MP\n1 km Cool Down";
        expect(render(five, 'km')).toEqual("5 km Warm Up\n9 km Tempo @ Goal MP\n1 km Cool Down");
        expect(render(five, 'mi')).toEqual("3.1 mi Warm Up\n5.6 mi Tempo @ Goal MP\n0.6 mi Cool Down");

        const six = "Run/walk 15 minutes";
        expect(render(six, 'km')).toEqual("Run/walk 15 minutes");
        expect(render(six, 'mi')).toEqual("Run/walk 15 minutes");
    });
});
