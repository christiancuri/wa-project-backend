export const clone = <R, T = any>(obj: T): R => JSON.parse(JSON.stringify(obj));
