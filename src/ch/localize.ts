import { Units } from "types/app";

const formatter = new Intl.DateTimeFormat(navigator.language);

// Locale-appropriate date format based on current language.
export function format(
    date: Date
): string {
    return formatter.format(date);
};

// Guess the user's preferred units of measure based on the current language. Fuzzy at best.
export function getLocaleUnits(): Units {
    if (navigator.language === "en" || navigator.language === "en-US") {
        return "mi";
    }
    return "km";
}
