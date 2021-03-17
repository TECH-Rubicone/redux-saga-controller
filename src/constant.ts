
// outsource dependencies
import { Action } from 'redux';

// local dependencies

export const REDUCER_PATH = 'controller';
export const SAGA_PREFIX = '@CSD-action/';
export const REDUCER_PREFIX = '@CSD-store';
// NOTE to provide ability to know who call the method ;)
export const SECRET = Symbol('secret key ;)');

export const isTypes = (list: unknown): boolean => Array.isArray(list) && list.length > 0
  && Boolean(list.reduce((acc: boolean, i: unknown) => i && typeof i === 'string' && acc, true));
export const isInitial = (initial: unknown): boolean => Object.prototype.toString.call(initial) === '[object Object]';
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
 *             TRANSFORMERS
 **************************************/
export const actionCase = (value: string): string => transform(value, {
  format: (value: string, index: number): string => {
    const first = value.charAt(0);
    const others = value.substr(1).toLowerCase();
    return `${index > 0 ? first.toUpperCase() : first.toLowerCase()}${others}`;
  },
  sep: '',
});
export const typeCase = (value: string): string => transform(value, {
  format: (value: string): string => value.toUpperCase(),
  sep: '_',
});
/**
 * Normalize the string into something other
 */
function transform (value: string, { sep, format }: {
  sep: string;
  format: (part: string, index: number, parts: string[]) => string;
}): string {
  let result = replace(value, [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g], '$1\0$2');
  result = replace(result, /[^A-Z0-9]+/gi, '\0');
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === '\0') { start++; }
  while (result.charAt(end - 1) === '\0') { end--; }
  return result.slice(start, end).split('\0').map(format).join(sep);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace (input: string, regExp: RegExp | RegExp[], value: string) {
  if (regExp instanceof RegExp) { return input.replace(regExp, value); }
  return regExp.reduce((input, regExp) => input.replace(regExp, value), input);
}
/**************************************
 *             ACTIONS
 **************************************/
export function createAction<Payload> (type: string): CtrlActionCreator<Payload> {
  const ac: CtrlActionCreator<Payload> = (payload: Payload): CtrlAction<Payload> => ({ type, payload });
  ac.toString = () => type;
  ac.TYPE = type;
  return ac;
}

/**************************************
 * lets fuck TS using bloody hacks :)
 **************************************/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }
// eslint-disable-next-line @typescript-eslint/ban-types
export const getKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);

/**************************************
 *              TYPING
 **************************************/
export type CtrlPayload = Record<string, unknown>;
export type Subscriber = () => IterableIterator<unknown>;
export type InitialState<I = unknown> = Record<string, I>;

export interface CtrlAction<Payload = CtrlPayload> extends Action {
  payload: Payload;
  type: string;
}
export interface ActionCreator<Payload, Action> { (payload: Payload): Action }
export interface CtrlActionCreator<Payload = CtrlPayload> extends ActionCreator<Payload, CtrlAction<Payload>> {
  toString(): string;
  TYPE: string;
}
export interface CtrlActionCreators<Payload = CtrlActionCreator> {
  clearCtrl: CtrlActionCreator<Record<string, unknown>>;
  updateCtrl: CtrlActionCreator<Partial<Payload>>;
  [key: string]: unknown;
}

export interface Meta<I> {
  connected: boolean;
  initial: I;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CSDState<I = any> = { [ctrl: string]: unknown; } & { META: { [ctrl: string]: Meta<I>; }; }
export type GlobalState = { [reducer: string]: unknown; } & { [REDUCER_PATH]: CSDState; }
export interface CSDPayload<Initial = unknown> {
  name?: string;
  initial?: Initial;
  connected?: boolean;
  data?: Record<string, unknown>;
}

export interface CtrlOptions<Initial = InitialState> {
  prefix?: string;
  types?: string[];
  initial?: Initial;
  /*************************************************************************************
   * 'controller' implicitly has type 'any' because it does not have a type annotation
   * and is referenced directly or indirectly in its own initializer.
   ************************************************************************************/
  // subscriber: Subscriber;
  subscriber?: unknown;
}
