import { sagas } from './saga';
import { reducer } from './reducer';
import { Controller } from './controller';
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
export { sagas, reducer, Controller, };
/**
 * HOOK "useController"
 * contain all hooks which required to make controller alive
 * IMPORTANT in one time in the DOM  "useController" can subscribed not more than one time for one controller
 * if you need get some useful thing of controller outside of component subscriber use hook helpers
 */
export declare const useController: <T extends string, I>(controller: Controller<T, I>) => (boolean | I | Record<string, (payload?: any) => any>)[];
/**
 * HOOK helper "useControllerActions"
 * provide ability to use controller actions outside of component subscriber
 */
export declare const useControllerActions: <T extends string, I>(controller: Controller<T, I>) => Record<string, (payload?: any) => any>;
/**
 * HOOK "useControllerData"
 * provide ability to use controller data outside of component subscriber
 */
export declare const useControllerData: <T extends string, I>(controller: Controller<T, I>) => I;
/**
 * HOOK "useControllerSubscribe"
 * provide ability to connect controller without passing data or actions
 */
export declare const useControllerSubscribe: <T extends string, I>(controller: Controller<T, I>) => boolean;
