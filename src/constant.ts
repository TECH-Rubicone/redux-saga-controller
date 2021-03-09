
// outsource dependencies
import { Action, ActionCreator } from 'redux';

// local dependencies

export const REDUCER_PATH = 'controller';

export const SAGA_PREFIX = '@CSD-action/';
export const REDUCER_PREFIX = '@CSD-store';

// NOTE to provide ability to know who call the method :)
export const SECRET = Symbol('key');

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
export function createAction<P> (type: string): CtrlActionCreator<P> {
  const ac = (payload: P): CtrlAction<P> => ({ type, payload });
  ac.toString = () => type;
  ac.TYPE = type;
  return ac;
}
/**************************************
 * lets fuck TS using bloody hack :)
 **************************************/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }
/**************************************
 *              TYPING
 **************************************/
export type CtrlSystemActionTypes = 'updateCtrl' | 'clearCtrl';

export type Subscriber = () => IterableIterator<unknown>;

export interface CtrlAction<P = CtrlPayload> extends Action {
  payload: P;
}
export interface CtrlActionCreator<P = CtrlPayload> extends ActionCreator<CtrlAction<P>> {
  toString(): string;
  TYPE: string;
}
export interface CtrlPayload {
  [key: string]: unknown;
}

export interface CtrlActionCreators<I = CtrlActionCreator> {
  clearCtrl: I;
  updateCtrl: I;
  [key: string]: I;
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
export interface CSDPayload {
  name: string;
  data?: Record<string, unknown>;
  initial?: Record<string, unknown>;
}

export interface CtrlOptions<Type, Initial = InitialState> {
  prefix: string;
  types: Array<Type>;
  initial: Initial;
  subscriber: Subscriber;
}
