export function isNullOrWhitespace(str: string) {
    if (str === null) {
        return true;
    }
    return !str.trim();
}