
// outsource dependencies
import { Reducer, AnyAction } from 'redux';

// local dependencies
import { PATH } from './constant';
import { createCSDAction, removeCSDAction, clearCSDAction, updateCSDAction, updateCSDMetaAction } from './actions';

export const path = PATH.REDUCER;

type CtrlMeta = { connected?: boolean; };
type Meta = { [ctrl: string]: CtrlMeta; };
export type Selector<Initial> = { (state: GlobalState): Initial };
export type State = { [ctrl: string]: Record<string, unknown>; } & { [PATH.META]: Meta; }
type GlobalState = { [reducer: string]: unknown; } & { [PATH.REDUCER]: State; }

// SELECTOR
const select = (state: GlobalState): State => state[PATH.REDUCER] || {};
const selectMeta = (state: GlobalState): Meta => select(state)[PATH.META] || {};
export const createSelectorIsConnected = (id: string) => (
  state: GlobalState
): boolean => Boolean(selectMeta(state)?.[id]?.connected);
export function createSelectorActualCSD<Initial> (id: string, initial: Initial) {
  return (state: GlobalState): Initial => Object.assign({}, initial, select(state)?.[id]);
}
const initial = { [PATH.META]: {} };
export const reducer: Reducer = (state: State = initial, action: AnyAction) => {
  // NOTE "id" it's required unique identifier for dynamic reducers
  const { type, payload } = action;
  const id = payload?.id;
  // NOTE mostly impossible to simulate controller actions but just in case
  if (!id) { return state; }
  const data = payload.data;
  const ctrlData = state[id];
  const meta = state[PATH.META];
  const ctrlMeta = state[PATH.META][id];

  // id && console.log(`${type} =>  ${id}`
  //   // , '\n state:', JSON.stringify(state, null, 4)
  //   , '\n ctrlData:', ctrlData
  //   , '\n data:', data
  //   , '\n ctrlMeta:', ctrlMeta
  // );

  switch (type) {
    default: return state;
    case removeCSDAction.TYPE:
      // NOTE remove dynamic reducer and it meta information
      return { ...state, [id]: null, [PATH.META]: { ...meta, [id]: null } };
    case clearCSDAction.TYPE:
      // NOTE bring dynamic reducer initial state
      return { ...state, [id]: { ...data } };
    case createCSDAction.TYPE:
      // NOTE create dynamic reducer with initial state and empty meta information
      return { ...state, [id]: { ...data }, [PATH.META]: { ...meta, [id]: {} } };
    case updateCSDAction.TYPE:
      // NOTE most used action for dynamic reducers
      return { ...state, [id]: { ...ctrlData, ...data } };
    case updateCSDMetaAction.TYPE:
      // NOTE internal controller information
      return { ...state, [PATH.META]: { ...meta, [id]: { ...ctrlMeta, ...data } } };
  }
};
