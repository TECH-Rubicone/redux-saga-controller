
// outsource dependencies
// import { Action, ActionCreator } from 'redux';

// local dependencies
import { REDUCER_PATH, REDUCER_PREFIX, forceCast, createAction, CtrlAction, CtrlActionCreator, CSDPayload, GlobalState, CSDState } from './constant';

// ACTIONS
export const clearCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/CLEAR`);
export const removeCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/REMOVE`);
export const updateCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/UPDATE`);
export const createCSDAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/CREATE`);
export const updateCSDMetaAction: CtrlActionCreator<CSDPayload> = createAction(`${REDUCER_PREFIX}/META`);

export const pinClearCSD = (name: string): CtrlActionCreator<undefined> =>
  forceCast<CtrlActionCreator<undefined>>(() => clearCSDAction({ name }));
export const pinUpdateCSD = <Payload>(name: string): CtrlActionCreator<Payload> =>
  forceCast<CtrlActionCreator<Payload>>((data: Partial<Payload>) => updateCSDAction({ name, data }));

// SELECTOR
const select = <I>(state: GlobalState): CSDState<I> => state[REDUCER_PATH];
export const selectMeta = <I> (state: GlobalState) => select<I>(state).META;
export const selectIsConnectedCSD = <I> (name: string) => (state: GlobalState) =>
  (selectMeta<I>(state)?.[name]?.connected) || false;
// export const selectInitialCSD = <I> (name: string) => (state: GlobalState) =>
//   (selectMeta<I>(state)?.[name]?.initial) || forceCast<I>({});
export const selectActualCSD = <I> (name: string) => (state: GlobalState) => select<I>(state)?.[name];

// REDUCER
const initialStateSCD = {
  META: {}
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reducer = (state: CSDState = initialStateSCD, action: CtrlAction<CSDPayload>) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const { type, payload } = action;
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
    case removeCSDAction.TYPE:
      // NOTE remove dynamic reducer
      return { ...state, [name]: null, META: { ...state.META, [name]: { ...currentMeta, initial: null } } };
    case clearCSDAction.TYPE:
      // NOTE bring dynamic reducer state to initial values
      return { ...state, [name]: { ...currentInitial } };
    case createCSDAction.TYPE:
      if (typeof initial !== 'object') { return state; }
      // NOTE initialize new dynamic reducer
      return { ...state, [name]: { ...initial }, META: { ...state.META, [name]: { ...currentMeta, initial } } };
    case updateCSDAction.TYPE:
      let currentViewData = {};
      // NOTE type safe
      if (typeof currentInitial === 'object') {
        currentViewData = { ...currentInitial };
      }
      // NOTE type safe
      if (typeof current === 'object') {
        currentViewData = { ...current };
      }
      // NOTE most used action for dynamic reducers
      return { ...state, [name]: { ...currentViewData, ...data } };
    case updateCSDMetaAction.TYPE:
      // NOTE internal controller information
      return { ...state, META: { ...state.META, [name]: { ...currentMeta, ...data } } };
  }
};
