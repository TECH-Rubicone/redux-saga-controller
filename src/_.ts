// Used to generate unique IDs within runtime
let counter = 0;
export const count = (): number => ++counter;

// eslint-disable-next-line no-bitwise
export const hash = (): string => String(`XXX${count()}`).replace('X', () => (Math.random() * 32 | 0).toString(32));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }
