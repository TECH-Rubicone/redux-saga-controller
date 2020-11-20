'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var effects = require('redux-saga/effects');
var react = require('react');
var reactRedux = require('react-redux');

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

const selector = state => state?.[CSD_REDUCER_PATH];

const selectCSD = name => state => selector(state)?.[name] || {};
const selectMetaCSD = name => state => selector(state)?.META?.[name] || {}; // REDUCER

const reducer = (state = {}, action) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const {
    type,
    payload = {}
  } = action; // NOTE Data from the payload

  const name = payload?.name;
  const data = payload?.data;
  const initial = payload?.initial; // NOTE Data from the store

  const current = state?.name || {};
  const currentMeta = state?.META?.[name] || {};
  const currentInitial = state?.META?.[name]?.initial || {};

  switch (type) {
    default:
      return state;

    case TYPE.REMOVE:
      // NOTE remove dynamic reducer
      return { ...state,
        [name]: null,
        META: { ...state.META,
          [name]: { ...currentMeta,
            initial: null
          }
        }
      };

    case TYPE.CLEAR:
      // NOTE bring dynamic reducer state to initial values
      return { ...state,
        [name]: { ...currentInitial
        }
      };

    case TYPE.ADD:
      // NOTE initialize new dynamic reducer
      return { ...state,
        [name]: { ...initial
        },
        META: { ...state.META,
          [name]: { ...currentMeta,
            initial
          }
        }
      };

    case TYPE.UPDATE:
      // NOTE most used action for dynamic reducers
      return { ...state,
        [name]: { ...current,
          ...data
        }
      };

    case TYPE.META:
      // NOTE internal controller information
      return { ...state,
        META: { ...state.META,
          [name]: { ...currentMeta,
            ...data
          }
        }
      };
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
  payload: {
    controller
  }
}) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
  // );
  controller.channel = yield effects.fork(controller.subscriber); // NOTE store mark in to redux to provide correct watching of changes

  yield effects.put(updateCSDMetaAction(controller.name, {
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
  payload: {
    controller
  }
}) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
  // );
  // NOTE store mark in to redux to provide correct watching of changes
  yield effects.put(updateCSDMetaAction(controller.name, {
    connected: false
  }));
  yield effects.cancel(controller.channel);
  controller.channel = null;
}

function* sagas() {
  yield effects.takeEvery(TYPE$1.SUBSCRIBE, subscribeSaga);
  yield effects.takeEvery(TYPE$1.UNSUBSCRIBE, unsubscribeSaga);
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
    types,
    prefix,
    initial,
    subscriber
  }) {
    this.TYPE = {};
    this.action = {};
    this._channel = null;
    this.name = uniqueId(prefix);
    this.initial = initial;
    this.subscriber = subscriber; // TODO forbid to pass properties

    this.action.clearCtrl = clearCSD(this.name); // TODO allow to pass only properties as in initial

    this.action.updateCtrl = updateCSD(this.name); // NOTE prepare types and actions

    for (const type of types) {
      this.TYPE[type] = `TEST/${type.toUpperCase()}`;

      this.action[type] = payload => ({
        type,
        payload
      });
    }

    this.selector = selectCSD(this.name);
  }

  set channel(channel) {
    if (channel && this._channel) {
      console.error(`%c DUPLICATION ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;', '\n Please make sure you use only one instance of Controller within DOM in same time', '\n CACHE:', this);
    }

    this._channel = channel;
  }

  get channel() {
    return this._channel;
  }

} // export const c = new Controller({
//   types: ['initialize', 'updateData', 'TYPE_2'],
//   prefix: 'custom',
//   initial: { test: 1, foo: 2, bar: 3 },
//   subscriber: () => null
// });
// console.log(c);

// outsource dependencies

const useActions = controller => {
  const dispatch = reactRedux.useDispatch();
  const actionCreators = controller.action;
  return react.useMemo(() => {
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
  const actual = reactRedux.useSelector(selectCSD(name));
  return react.useMemo(() => ({ ...initial,
    ...actual
  }), [initial, actual]);
};

// outsource dependencies

const useReducerSubscribe = controller => {
  const name = controller.name;
  const initial = controller.initial;
  const dispatch = reactRedux.useDispatch();
  const remove = react.useCallback(() => dispatch(removeCSDAction(name)), [name, dispatch]);
  const create = react.useCallback(() => dispatch(createCSDAction(name, initial)), [initial, name, dispatch]); // TODO Simplify next record

  react.useEffect(() => {
    create();
    return () => {
      remove();
    };
  }, [create, remove]);
  return null;
}; // HOOK


const useSubscribe = controller => {
  useReducerSubscribe(controller);
  const dispatch = reactRedux.useDispatch();
  const meta = reactRedux.useSelector(selectMetaCSD(controller.name));
  const subscribe = react.useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = react.useCallback(() => dispatch(unsubscribeAction(controller)), [controller, dispatch]); // TODO Simplify next record

  react.useEffect(() => {
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

exports.Controller = Controller;
exports.reducer = reducer;
exports.sagas = sagas;
exports.useController = useController;
exports.useControllerActions = useControllerActions;
exports.useControllerData = useControllerData;
exports.useControllerSubscribe = useControllerSubscribe;
