import { useActions } from './use-actions';
import { useReducer } from './use-reducer';
import { useSubscribe } from './use-subscribe';
import { Controller, prepareController } from './prepare';
/**
 * Controller require connection to react-redux and redux-saga
 * please make sure you connected to react-redux and setup saga subscriber
 *
 * @example
 * import { reducer as controllerReducer } from 'redux-saga-controller';
 * import { sagas as controllerSagas } from 'redux-saga-controller';
 *
 */
export * from './type.spec';
export { sagas } from './saga';
export { reducer } from './reducer';

/**
 * Controller require connection to react-redux and redux-saga
 * please make sure you connected to react-redux
 * @example
 * import { reducer as controller } from './services/controller.service';
 *
 * and setup saga subscriber
 * import { sagas as controllerSagas } from './services/controller.service';
 *
 */
export { Controller, prepareController };

/**
 * HOOK "useController"
 * contain all hooks which are required to make controller alive
 * IMPORTANT in one time in the DOM "useController" can subscribed not more than one time for one controller
 * if you need get some useful thing of controller outside of component subscriber use hook helpers
 */
// export const useController = (controller: Controller) => [
//   useReducer(controller),
//   useActions(controller),
//   useSubscribe(controller),
// ] as const;
export function useController<Type extends string, Initial> (controller: Controller<Type, Initial>) {
  // return [
  //   useReducer(controller),
  //   useActions(controller),
  //   useSubscribe(controller),
  // ] as const;
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

