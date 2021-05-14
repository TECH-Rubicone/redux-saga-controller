
export const isPlainObject = (value: unknown): boolean => Object.prototype.toString.call(value) === '[object Object]';

// FIXME on production build the generator will compile to "function"
export const isSubscriber = (subscriber: unknown): boolean => typeof subscriber === 'function';
// FIXME it's mean the validation is "isSubscriber" should be simplified too
// export const isSubscriber = (subscriber: unknown): boolean => typeof subscriber === 'function'
//   && subscriber.constructor && subscriber.constructor.name === 'GeneratorFunction';
/**************************************
 * 100% unique hash
 **************************************/
let counter = 0;
export const hash = (): string => String(`XXX${++counter}`)
  // eslint-disable-next-line no-bitwise
  .replace('X', () => (Math.random() * 32 | 0).toString(32));

/**************************************
 * lets fuck TS using bloody hacks :)
 **************************************/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }
// eslint-disable-next-line @typescript-eslint/ban-types
export const getKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);

/**************************************
 *          CONSTANTS
 **************************************/
// NOTE private things on public object
export const SECRET = Symbol('¯\\_(ツ)_/¯');

export const PATH = {
  META: `@meta-${hash()}` as 'value',
  REDUCER: `@controller-${hash()}` as 'value',
};

export const PREFIX = {
  SAGA: `@CSD-action-${hash()}/` as 'value',
  REDUCER: `@CSD-store-${hash()}/` as 'value',
};
