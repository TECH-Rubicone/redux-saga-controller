
// outsource dependencies
import { Action, ActionCreator } from 'redux';

// local dependencies
import { REDUCER_PATH } from './constant';

export type CtrlSystemActionTypes = 'updateCtrl' | 'clearCtrl';

export type Subscriber = () => IterableIterator<unknown>;

// export type InitialState<I = unknown> = Record<string, I>;
export interface InitialState<I = any>{
  [key: string]: I
}

export interface Meta<I> {
  connected: boolean;
  initial: I;
}
export type CSDState<I = any> = {
  [reducer: string]: I;
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
  [key: string]: I;
}
export interface CtrlOptions<Type, Initial = InitialState> {
  prefix: string;
  types: Array<Type>;
  initial: Initial;
  subscriber: Subscriber;
}
