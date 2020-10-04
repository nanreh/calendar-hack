import * as moo from 'moo'
import { Units } from '../defy/models'

let lexer = moo.compile({
    miles: [
        { match: /\d+\.?\d?miles/, value: x => x.slice(0, -5) },
        { match: /\d+\.?\d?\smiles/, value: x => x.slice(0, -6) },
        { match: /\d+\.?\d?mile/, value: x => x.slice(0, -4) },
        { match: /\d+\.?\d?\smile/, value: x => x.slice(0, -5) },
        { match: /\d+\.?\d?mi/, value: x => x.slice(0, -2) },
        { match: /\d+\.?\d?\smi\s/, value: x => x.slice(0, -3) },
    ],
    kilometers: [
        { match: /\d+\.?\d?kilometers/, value: x => x.slice(0, -10) },
        { match: /\d+\.?\d?\skilometers/, value: x => x.slice(0, -11) },
        { match: /\d+\.?\d?kilometer/, value: x => x.slice(0, -9) },
        { match: /\d+\.?\d?\skilometer/, value: x => x.slice(0, -10) },
        { match: /\d+\.?\d?km/, value: x => x.slice(0, -2) },
        { match: /\d+\.?\d?\skm/, value: x => x.slice(0, -3) },
    ],
    text: /.+?/,
    NL: { match: /\n/, lineBreaks: true },
})

export function renderDist(value: number, from: Units, to: Units): string {
    let suffix = to;
    if (from === to) {
        return value + ' ' + suffix;
    }
    if ('mi' === from) {
        return (value / 0.62137).toFixed(1) + ' ' + suffix;
    }
    return (value * 0.62137).toFixed(1) + ' ' + suffix;
}

export function render(input: string, to: Units): string {
    let result = '';
    lexer.reset(input);
    let tokens = Array.from(lexer);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        let value = Number(t.value);
        if (t.type === 'miles') {
            result += renderDist(value, 'mi', to);
        } else if (t.type === 'kilometers') {
            result += renderDist(value, 'km', to);
        } else { // t.type === 'text' || t.type === 'NL')
            result += t.value;
        }
    }
    return result;
}