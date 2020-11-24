
/**
 * Controller require connection to react-redux and redux-saga
 * please make sure you connected to react-redux and setup saga subscriber
 *
 * @example
 * import { reducer as controllerReducer } from 'redux-saga-controller';
 * import { sagas as controllerSagas } from 'redux-saga-controller';
 *
 */
export { sagas } from './saga';
export { reducer, ControllerState } from './reducer';

import { Controller } from './controller';

import { useActions } from './use-actions';
import { useReducer } from './use-reducer';
import { useSubscribe } from './use-subscribe';

/**
 * HOOK "useController"
 * contain all hooks which are required to make controller alive
 * IMPORTANT in one time in the DOM "useController" can subscribed not more than one time for one controller
 * if you need get some useful thing of controller outside of component subscriber use hook helpers
 */
export const useController = <T extends string, I>(controller: Controller<T, I>) => [
  useReducer(controller),
  useActions(controller),
  useSubscribe(controller),
] as const;

/**
 * HOOK helper "useControllerActions"
 * provide ability to use controller actions outside of component subscriber
 */
export const useControllerActions = useActions;

/**
 * HOOK "useControllerData"
 * provide ability to use controller data outside of component subscriber
 */
export const useControllerData = useReducer;

/**
 * HOOK "useControllerSubscribe"
 * provide ability to connect controller without passing data or actions
 */
export const useControllerSubscribe = useSubscribe;

// check correctness of minimum required data and make some preparation
export { Controller };
