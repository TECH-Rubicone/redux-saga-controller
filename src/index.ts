
import { useActions } from './use-actions';
import { useReducer } from './use-reducer';
import { useSubscribe } from './use-subscribe';
import { Controller, prepareController, create, getControllerInitialState, getControllerChannel, getControllerSubscriber } from './prepare';

// NOTE required TS types
export * from './outer-types';
export { subscribeAction, unsubscribeAction } from './actions';
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
export { reducer, path, extraReducers } from './reducer';

/**
 * Generate controller annotation
 * Controller require connection to react-redux and redux-saga
 */
export { prepareController, create, getControllerInitialState, getControllerChannel, getControllerSubscriber };
export default prepareController;
/**
 * HOOK "useController"
 * contain all hooks which are required to make controller alive
 * IMPORTANT in one time in the DOM "useController" can subscribed not more than one time for one controller
 * if you need get some useful thing of controller outside of component subscriber use hook helpers
 */
export function useController<Actions, Initial> (controller: Controller<Actions, Initial>) {
  return [
    useReducer(controller),
    useActions(controller),
    useSubscribe(controller),
  ] as const;
}

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
