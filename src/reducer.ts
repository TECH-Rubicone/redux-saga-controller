
// outsource dependencies


// local dependencies
import { forceCast, hash, isPlainObject } from './constant';
import { Action, createCSDAction, removeCSDAction, clearCSDAction, updateCSDAction, updateCSDMetaAction } from './actions';


const PATH = {
  META: `@meta-${hash()}` as 'value',
  REDUCER: `@controller-${hash()}` as 'value',
};

type CtrlMeta = { connected?: boolean; };
type Meta = { [ctrl: string]: CtrlMeta; };
export type Selector<Initial> = { (state: GlobalState): Initial };
interface CSDPayload { id: string; data: Record<string, unknown>; }
type CSDState = { [ctrl: string]: unknown; } & { [PATH.META]: Meta; }
type GlobalState = { [reducer: string]: unknown; } & { [PATH.REDUCER]: CSDState; }

// SELECTOR
const select = (state: GlobalState): CSDState => state[PATH.REDUCER] || {};
const selectMeta = (state: GlobalState): Meta => select(state)[PATH.META] || {};
export const createSelectorIsConnected = (id: string) => (
  state: GlobalState
): boolean => Boolean(selectMeta(state)?.[id]?.connected);
export function createSelectorActualCSD<Initial> (id: string, initial: Initial) {
  return (state: GlobalState): Initial => Object.assign({}, initial, select(state)?.[id]);
}

export const reducer = (state: CSDState = { [PATH.META]: {} }, action: Action<CSDPayload>) => {
  // NOTE "id" it's required unique identifier for dynamic reducers
  const { type, payload } = action;
  // NOTE using safe reducer
  const id = payload.id;
  const data = payload.data || {}; // !!!!! incorrect
  const currentMeta = state[PATH.META];
  // NOTE fuck typescript
  let actual = forceCast<Partial<unknown>>(state[id]);
  !isPlainObject(actual) && (actual = {});

  console.log('reducer', state);
  console.log('action', action);
  console.log('actual', actual);
  console.log('currentMeta', currentMeta);

  switch (type) {
    default: return state;
    case removeCSDAction.TYPE:
      // NOTE remove dynamic reducer and it meta information
      return { ...state, [id]: null, [PATH.META]: { ...currentMeta, [id]: null } };
    case clearCSDAction.TYPE:
      // NOTE bring dynamic reducer initial state
      return { ...state, [id]: { ...data } };
    case createCSDAction.TYPE:
      // NOTE create dynamic reducer with initial state and empty meta information
      return { ...state, [id]: { ...data }, [PATH.META]: { ...currentMeta, [id]: {} } };
    case updateCSDAction.TYPE:
      // NOTE most used action for dynamic reducers
      return { ...state, [id]: { ...actual, ...data } };
    case updateCSDMetaAction.TYPE:
      // NOTE internal controller information
      return { ...state, [PATH.META]: { ...currentMeta, [id]: { ...currentMeta, ...data } } };
  }
};
