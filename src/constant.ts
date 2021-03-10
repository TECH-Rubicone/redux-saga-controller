
// outsource dependencies
import { Action } from 'redux';

// local dependencies

export const REDUCER_PATH = 'controller';

export const SAGA_PREFIX = '@CSD-action/';
export const REDUCER_PREFIX = '@CSD-store';

// NOTE to provide ability to know who call the method :)
export const SECRET = Symbol('secret key ;)');

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
    if (index > 0 && first >= '0' && first <= '9') {
      return `_${first}${others}`;
    }
    return `${first.toUpperCase()}${others}`;
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
  while (result.charAt(start) === '\0') {
    start++;
  }
  while (result.charAt(end - 1) === '\0') {
    end--;
  }
  return result.slice(start, end).split('\0').map(format).join(sep);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace (input: string, regExp: RegExp | RegExp[], value: string) {
  if (regExp instanceof RegExp) {
    return input.replace(regExp, value);
  }
  return regExp.reduce((input, regExp) => input.replace(regExp, value), input);
}
/**************************************
 *             ACTIONS ;)
 **************************************/
export function createAction<Payload> (type: string): CtrlActionCreator<Payload> {
  const ac: CtrlActionCreator<Payload> = (payload: Payload): CtrlAction<Payload> => ({ type, payload });
  ac.toString = () => type;
  ac.TYPE = type;
  return ac;
}
/**************************************
 * lets fuck TS using bloody hack :)
 **************************************/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }
// eslint-disable-next-line @typescript-eslint/ban-types
export const getKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);
/**************************************
 *              TYPING
 **************************************/
// type Options<T extends Record<string, unknown>> = { [K in keyof T]:T[K]; }
// function Options<T extends Record<string, unknown>>(value:T): Options<T> {
//   return Object.assign({}, value);
// }
export type CtrlSystemActionTypes = 'updateCtrl' | 'clearCtrl';

export type Subscriber = () => IterableIterator<unknown>;

export interface CtrlAction<Payload = CtrlPayload> extends Action {
  payload: Payload;
  type: string;
}
export interface ActionCreator<Payload, Action> { (payload: Payload): Action }
export interface CtrlActionCreator<Payload = CtrlPayload> extends ActionCreator<Payload, CtrlAction<Payload>> {
  toString(): string;
  TYPE: string;
}
export interface CtrlPayload {
  [key: string]: unknown;
}

export interface CtrlActionCreators<Payload = CtrlActionCreator> {
  clearCtrl: CtrlActionCreator<Record<string, unknown>>;
  updateCtrl: CtrlActionCreator<Partial<Payload>>;
  [key: string]: unknown;
}

export type InitialState<I = unknown> = Record<string, I>;

export interface Meta<I> {
  connected: boolean;
  initial: I;
}
export type CSDState<I = any> = {
  [reducer: string]: unknown;
} & {
  META: {
    [ctrl: string]: Meta<I>;
  };
}
export type GlobalState = {
  [ctrl: string]: unknown;
} & {
  [REDUCER_PATH]: CSDState;
}
export interface CSDPayload<Initial = unknown> {
  name: string;
  data?: Record<string, unknown>;
  initial?: Initial;
  connected?: boolean;
}

export interface CtrlOptions<Type, Initial = InitialState> {
  prefix: string;
  types: Array<Type>;
  initial: Initial;
  subscriber: Subscriber;
}
