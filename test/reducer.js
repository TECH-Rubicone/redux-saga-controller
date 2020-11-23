
// outsource dependencies
import _ from 'lodash';

// NOTE CSD - controller stored data
export const CSD_REDUCER_PATH = 'controller';

export const TYPE = (prefix => ({
  ADD: `${prefix}ADD`,
  CLEAR: `${prefix}CLEAR`,
  UPDATE: `${prefix}UPDATE`,
  REMOVE: `${prefix}REMOVE`,
  // NOTE addition layer for inner information
  META: `${prefix}META`,
}))('@CSD-store/');

/* ACTIONS */
export const clearCSDAction = name => ({ type: TYPE.CLEAR, name });
export const removeCSDAction = name => ({ type: TYPE.REMOVE, name });
export const createCSDAction = (name, initial) => ({ type: TYPE.ADD, name, initial });
export const updateCSDAction = (name, payload) => ({ type: TYPE.UPDATE, name, payload });
export const updateCSDMetaAction = (name, payload) => ({ type: TYPE.META, name, payload });
export const clearCSD = name => () => clearCSDAction(name);
export const updateCSD = name => payload => updateCSDAction(name, payload);

/* SELECTOR */
export const selector = state => _.get(state, CSD_REDUCER_PATH);
export const selectCSD = name => state => _.get(selector(state), name) || {};
export const selectMetaCSD = name => state => _.get(selector(state), `META.${name}`) || {};

/* REDUCER */
export const reducer = (state = {}, action) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const { type, name, payload = {}, initial = {} } = action;
  const current = _.get(state, name) || {};
  const currentMeta = _.get(state, `META.${name}`) || {};
  const currentInitial = _.get(state, `META.${name}.initial`) || {};

  switch (type) {
    default: return state;
    case TYPE.REMOVE:
      // NOTE remove dynamic reducer
      return { ...state, [name]: null, META: { ...state.META, [name]: { ...currentMeta, initial: null } } };
    case TYPE.CLEAR:
      // NOTE bring dynamic reducer state to initial values
      return { ...state, [name]: { ...currentInitial } };
    case TYPE.ADD:
      // NOTE initialize new dynamic reducer
      return { ...state, [name]: { ...initial }, META: { ...state.META, [name]: { ...currentMeta, initial } } };
    case TYPE.UPDATE:
      // NOTE most used action for dynamic reducers
      return { ...state, [name]: { ...current, ...payload } };
    case TYPE.META:
      // NOTE internal controller information
      return { ...state, META: { ...state.META, [name]: { ...currentMeta, ...payload } } };
  }
};
