
// outsource dependencies
import { Action, ActionCreator } from 'redux';

// local dependencies
import { REDUCER_PATH } from './constant';

// NOTE lets fuck TS using bloody hack :)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }

export type Subscriber = () => IterableIterator<unknown>;

export type InitialState<I = unknown> = Record<string, I>;

export interface Meta<I> {
  connected: boolean;
  initial: I;
}
export type CSDState<I = any> = {
  [ctrl: string]: I;
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
export interface CtrlPayload {
  [key: string]: unknown;
}
export interface CtrlAction<P = CtrlPayload> extends Action {
  payload: P;
}
export interface CtrlActionCreator<P = CtrlPayload> extends ActionCreator<CtrlAction<P>> {
  toString(): string;
  TYPE: string;
}

export interface CtrlActionCreators<I = CtrlActionCreator> {
  clearCtrl: I;
  updateCtrl: I;
  [key: string]: I
}
export interface CtrlOptions<Types, Initial = InitialState> {
  prefix: string;
  initial: Initial;
  types: Array<Types>;
  subscriber: Subscriber;
}
