export const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
}