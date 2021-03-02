
// outsource dependencies

// local dependencies
import { REDUCER_PATH, REDUCER_PREFIX } from './constant';
import { GlobalState, CSDState, CSDPayload, CtrlAction, CtrlActionCreator, forceCast } from './types';

export function createAction<P> (type: string): CtrlActionCreator<P> {
  const ac = (payload: P): CtrlAction<P> => ({ type, payload });
  ac.toString = () => type;
  ac.TYPE = type;
  return ac;
}

// ACTIONS
export const clearCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/CLEAR`);
export const removeCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/REMOVE`);
export const updateCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/UPDATE`);
export const createCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/CREATE`);
export const updateCSDMetaAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/META`);

export const pinClearCSD = (name: string): CtrlActionCreator =>
  forceCast<CtrlActionCreator>(() => clearCSDAction({ name }));
export const pinUpdateCSD = (name: string): CtrlActionCreator =>
  forceCast<CtrlActionCreator>((data: unknown) => updateCSDAction({ name, data }));

// SELECTOR
const select = <I>(state: GlobalState): CSDState<I> => state[REDUCER_PATH];
export const selectMeta = <I> (state: GlobalState) => select<I>(state).META;
export const selectIsConnectedCSD = <I> (name: string) => (state: GlobalState) =>
  (selectMeta<I>(state)?.[name]?.connected) || false;
export const selectInitialCSD = <I> (name: string) => (state: GlobalState) =>
  (selectMeta<I>(state)?.[name]?.initial) || forceCast<I>({});
export const selectActualCSD = <I> (name: string) => (state: GlobalState) => select<I>(state)?.[name];

// REDUCER
const initialStateSCD = {
  META: {}
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reducer = (state: CSDState = initialStateSCD, action: CtrlAction) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const { type, payload } = action;
  // NOTE type safe
  if (typeof payload.name !== 'string') { return state; }
  // NOTE Data from the payload
  const name = payload.name;
  const data = payload.data || {};
  const initial = payload.initial || {};
  // NOTE Data from the store
  const current = state?.[name] || {};
  const currentMeta = state.META?.[name] || {};
  const currentInitial = state.META?.[name]?.initial || {};

  switch (type) {
    default: return state;
    case [removeCSDAction]:
      // NOTE remove dynamic reducer
      return { ...state, [name]: null, META: { ...state.META, [name]: { ...currentMeta, initial: null } } };
    case [clearCSDAction]:
      // NOTE bring dynamic reducer state to initial values
      return { ...state, [name]: { ...currentInitial } };
    case [createCSDAction]:
      if (typeof initial !== 'object') { return state; }
      // NOTE initialize new dynamic reducer
      return { ...state, [name]: { ...initial }, META: { ...state.META, [name]: { ...currentMeta, initial } } };
    case [updateCSDAction]:
      // NOTE type safe
      if (typeof data !== 'object') { return state; }
      // NOTE most used action for dynamic reducers
      return { ...state, [name]: { ...current, ...data } };
    case [updateCSDMetaAction]:
      // NOTE type safe
      if (typeof data !== 'object') { return state; }
      // NOTE internal controller information
      return { ...state, META: { ...state.META, [name]: { ...currentMeta, ...data } } };
  }
};
