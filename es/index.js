import { takeEvery, fork, put, cancel } from 'redux-saga/effects';
import { useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// NOTE CSD - controller stored data
const CSD_REDUCER_PATH = 'controller'; // NOTE specific reducer action types

const TYPE = (prefix => ({
  ADD: `${prefix}ADD`,
  CLEAR: `${prefix}CLEAR`,
  UPDATE: `${prefix}UPDATE`,
  REMOVE: `${prefix}REMOVE`,
  // NOTE addition layer for inner information
  META: `${prefix}META`
}))('@CSD-store/'); // ACTIONS


const clearCSDAction = name => ({
  type: TYPE.CLEAR,
  payload: {
    name
  }
});
const removeCSDAction = name => ({
  type: TYPE.REMOVE,
  payload: {
    name
  }
});
const createCSDAction = (name, initial) => ({
  type: TYPE.ADD,
  payload: {
    name,
    initial
  }
});
const updateCSDAction = (name, data) => ({
  type: TYPE.UPDATE,
  payload: {
    name,
    data
  }
});
const updateCSDMetaAction = (name, data) => ({
  type: TYPE.META,
  payload: {
    name,
    data
  }
});
const clearCSD = name => () => clearCSDAction(name);
const updateCSD = name => data => updateCSDAction(name, data); // SELECTOR

const selector = state => state === null || state === void 0 ? void 0 : state[CSD_REDUCER_PATH];

const selectCSD = name => state => {
  var _a;

  return ((_a = selector(state)) === null || _a === void 0 ? void 0 : _a[name]) || {};
};
const selectMetaCSD = name => state => {
  var _a, _b;

  return ((_b = (_a = selector(state)) === null || _a === void 0 ? void 0 : _a.META) === null || _b === void 0 ? void 0 : _b[name]) || {};
}; // REDUCER

const reducer = (state = {}, action) => {
  var _a, _b, _c; // NOTE "name" it's required unique identifier for dynamic reducers


  const {
    type,
    payload = {}
  } = action; // NOTE Data from the payload

  const name = payload === null || payload === void 0 ? void 0 : payload.name;
  const data = payload === null || payload === void 0 ? void 0 : payload.data;
  const initial = payload === null || payload === void 0 ? void 0 : payload.initial; // NOTE Data from the store

  const current = (state === null || state === void 0 ? void 0 : state.name) || {};
  const currentMeta = ((_a = state === null || state === void 0 ? void 0 : state.META) === null || _a === void 0 ? void 0 : _a[name]) || {};
  const currentInitial = ((_c = (_b = state === null || state === void 0 ? void 0 : state.META) === null || _b === void 0 ? void 0 : _b[name]) === null || _c === void 0 ? void 0 : _c.initial) || {};

  switch (type) {
    default:
      return state;

    case TYPE.REMOVE:
      // NOTE remove dynamic reducer
      return Object.assign(Object.assign({}, state), {
        [name]: null,
        META: Object.assign(Object.assign({}, state.META), {
          [name]: Object.assign(Object.assign({}, currentMeta), {
            initial: null
          })
        })
      });

    case TYPE.CLEAR:
      // NOTE bring dynamic reducer state to initial values
      return Object.assign(Object.assign({}, state), {
        [name]: Object.assign({}, currentInitial)
      });

    case TYPE.ADD:
      // NOTE initialize new dynamic reducer
      return Object.assign(Object.assign({}, state), {
        [name]: Object.assign({}, initial),
        META: Object.assign(Object.assign({}, state.META), {
          [name]: Object.assign(Object.assign({}, currentMeta), {
            initial
          })
        })
      });

    case TYPE.UPDATE:
      // NOTE most used action for dynamic reducers
      return Object.assign(Object.assign({}, state), {
        [name]: Object.assign(Object.assign({}, current), data)
      });

    case TYPE.META:
      // NOTE internal controller information
      return Object.assign(Object.assign({}, state), {
        META: Object.assign(Object.assign({}, state.META), {
          [name]: Object.assign(Object.assign({}, currentMeta), data)
        })
      });
  }
};

const TYPE$1 = (prefix => ({
  SUBSCRIBE: `${prefix}SUBSCRIBE`,
  UNSUBSCRIBE: `${prefix}UNSUBSCRIBE`
}))('@CSD-action/');

const subscribeAction = controller => ({
  type: TYPE$1.SUBSCRIBE,
  payload: {
    controller
  }
});

function* subscribeSaga({
  type,
  payload: {
    controller
  }
}) {
  console.info(`%c ${type}: ${controller.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;', '\n controller:', controller);
  controller.channel = yield fork(controller.subscriber); // NOTE store mark in to redux to provide correct watching of changes

  yield put(updateCSDMetaAction(controller.name, {
    connected: true
  }));
}

const unsubscribeAction = controller => ({
  type: TYPE$1.UNSUBSCRIBE,
  payload: {
    controller
  }
});

function* unsubscribeSaga({
  type,
  payload: {
    controller
  }
}) {
  console.info(`%c ${type}: ${controller.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;', '\n payload:', controller); // NOTE store mark in to redux to provide correct watching of changes

  yield put(updateCSDMetaAction(controller.name, {
    connected: false
  }));
  yield cancel(controller.channel);
  controller.channel = null;
}

function* sagas() {
  yield takeEvery(TYPE$1.SUBSCRIBE, subscribeSaga);
  yield takeEvery(TYPE$1.UNSUBSCRIBE, unsubscribeSaga);
}

// Used to generate unique IDs.
const idCounter = {};
/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @see random
 * @example
 *
 * uniqueId('contact_')
 * // => 'contact_104'
 *
 * uniqueId()
 * // => '105'
 */

const uniqueId = (prefix = '$controller$') => {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0;
  }

  const id = ++idCounter[prefix];

  if (prefix === '$controller$') {
    return `${id}`;
  }

  return `${prefix}${id}`;
};

// local dependencies
class Controller {
  constructor({
    types = [],
    prefix,
    initial,
    subscriber
  }) {
    this.initial = {};
    this.TYPE = {};
    this.action = {};
    this._channel = null; // TODO Add validation for all properties

    this.name = uniqueId(prefix);
    this.initial = initial;
    this.subscriber = subscriber; // TODO forbid to pass properties

    this.action.clearCtrl = clearCSD(this.name); // TODO allow to pass only properties as in initial

    this.action.updateCtrl = updateCSD(this.name); // NOTE prepare types and actions

    for (const type of types) {
      this.TYPE[type] = `${this.name}/${type.toUpperCase()}`;

      this.action[type] = payload => ({
        type: this.TYPE[type],
        payload
      });
    }

    this.selector = selectCSD(this.name);
  }

  set channel(channel) {
    if (channel && this._channel) {
      console.error(`%c DUPLICATION ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;', '\n Please make sure you use only one instance of Controller within DOM in same time', '\n CACHE:', this);
    }

    console.info(`%c set channel ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 16px;', '\n CACHE:', this, '\n channel:', channel);
    this._channel = channel;
  }

  get channel() {
    return this._channel;
  }

}

// outsource dependencies

const useActions = controller => {
  const dispatch = useDispatch();
  const actionCreators = controller.action;
  return useMemo(() => {
    const cache = {};

    for (const name in actionCreators) {
      if (actionCreators.hasOwnProperty(name)) {
        const action = actionCreators[name];

        cache[name] = payload => dispatch(action(payload));
      }
    }

    return cache;
  }, [actionCreators, dispatch]);
};

// outsource dependencies

const useReducer = controller => {
  const name = controller.name;
  const initial = controller.initial;
  const actual = useSelector(selectCSD(name));
  return useMemo(() => Object.assign(Object.assign({}, initial), actual), [initial, actual]);
};

// outsource dependencies

const useReducerSubscribe = controller => {
  const name = controller.name;
  const initial = controller.initial;
  const dispatch = useDispatch();
  const remove = useCallback(() => dispatch(removeCSDAction(name)), [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction(name, initial)), [initial, name, dispatch]); // TODO Simplify next record

  useEffect(() => {
    create();
    return () => {
      remove();
    };
  }, [create, remove]);
  return null;
}; // HOOK


const useSubscribe = controller => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const meta = useSelector(selectMetaCSD(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => dispatch(unsubscribeAction(controller)), [controller, dispatch]); // TODO Simplify next record

  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);
  return meta.connected;
};

// local dependencies
/**
 * HOOK "useController"
 * contain all hooks which are required to make controller alive
 * IMPORTANT in one time in the DOM "useController" can subscribed not more than one time for one controller
 * if you need get some useful thing of controller outside of component subscriber use hook helpers
 */

const useController = controller => [useReducer(controller), useActions(controller), useSubscribe(controller)];
/**
 * HOOK helper "useControllerActions"
 * provide ability to use controller actions outside of component subscriber
 */

const useControllerActions = useActions;
/**
 * HOOK "useControllerData"
 * provide ability to use controller data outside of component subscriber
 */

const useControllerData = useReducer;
/**
 * HOOK "useControllerSubscribe"
 * provide ability to connect controller without passing data or actions
 */

const useControllerSubscribe = useSubscribe;

export default Controller;
export { Controller, reducer, sagas, useController, useControllerActions, useControllerData, useControllerSubscribe };
