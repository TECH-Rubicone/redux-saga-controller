import { REDUCER_PATH } from './constant';
import { Action, ActionCreator } from 'redux';

export interface Meta<I> {
  connected: boolean;
  initial: I;
}
// TODO any - is is solvable ?
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
// TODO any - is is solvable ?
export interface ControllerState<I = any> {
  [key: string]: I
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

export type Subscriber = () => IterableIterator<unknown>;

export type InitialState<I = unknown> = Record<string, I>;

export interface CtrlActionCreators<I = CtrlActionCreator> {
  clearCtrl: I;
  updateCtrl: I;
}
export interface CtrlOptions<I = unknown> {
  types: string[];
  prefix: string;
  subscriber: Subscriber;
  initial: InitialState<I>;
}
