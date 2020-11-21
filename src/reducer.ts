import { Action } from 'redux';

// NOTE CSD - controller stored data
const CSD_REDUCER_PATH = 'controller';

// NOTE specific reducer action types
const TYPE = (prefix => ({
  ADD: `${prefix}ADD`,
  CLEAR: `${prefix}CLEAR`,
  UPDATE: `${prefix}UPDATE`,
  REMOVE: `${prefix}REMOVE`,
  // NOTE addition layer for inner information
  META: `${prefix}META`,
}))('@CSD-store/');

// ACTIONS
export const clearCSDAction = (name: string) => ({ type: TYPE.CLEAR, payload: { name } });
export const removeCSDAction = (name: string) => ({ type: TYPE.REMOVE, payload: { name } });
export const updateCSDAction = <T>(name: string, data: T) => ({ type: TYPE.UPDATE, payload: { name, data } });
export const updateCSDMetaAction = <T>(name: string, data: T) => ({ type: TYPE.META, payload: { name, data } });
export const createCSDAction = <T>(name: string, initial: T) => ({ type: TYPE.ADD, payload: { name, initial } });

export const clearCSD = (name: string) => () => clearCSDAction(name);
export const updateCSD = <T>(name: string) => (data: T) => updateCSDAction(name, data);

// SELECTOR
export type RootState<T> = Record<string, State<T>>

export interface State<I> {
  connected: boolean;
  actual: I;
  initial: I;
}

const selector = (state: Record<string, RootState<unknown>>) => state?.[CSD_REDUCER_PATH];
export const selectCSD = <I>(name: string) =>
  (state: Record<string, RootState<I>>) => selector(state)?.[name] || {};

interface CSDActionPayload {
  data: unknown;
  name: string;
  initial: unknown;
}

interface CSDAction extends Action {
  payload: CSDActionPayload;
}

interface CSDState {
  actual: Record<string, unknown>,
  initial: Record<string, unknown>,
  connected: boolean,
}

// REDUCER
export const reducer = (state: Record<string, CSDState> = {}, action: CSDAction) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const { type, payload } = action;
  // NOTE Data from the payload
  const name = payload?.name;
  const data = payload?.data;
  const initial = payload?.initial;
  // NOTE Data from the store
  const currentState = state?.[name];

  switch (type) {
    default: return state;
    case TYPE.REMOVE:
      // NOTE remove dynamic reducer
      // TODO Check (We should delete this property to avoid extending store)
      return {
        ...state,
        [name]: Object.assign({}, currentState, {
          initial: null,
          actual: null
        })
      };
    case TYPE.CLEAR:
      // NOTE bring dynamic reducer state to initial values
      return {
        ...state,
        [name]: Object.assign({}, currentState, {
          actual: initial,
        })
      };
    case TYPE.ADD:
      // NOTE initialize new dynamic reducer
      return {
        ...state,
        [name]: {
          initial,
          actual: initial,
          connected: false,
        }
      };
    case TYPE.UPDATE:
      // NOTE most used action for dynamic reducers
      return {
        ...state,
        [name]: Object.assign({}, currentState, {
          actual: Object.assign({}, currentState.actual, data),
        })
      };
    case TYPE.META:
      // NOTE internal controller information
      return {
        ...state,
        [name]: Object.assign({}, currentState, data)
      };
  }
};
