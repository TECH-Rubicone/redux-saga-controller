
/********************************** Example real life ****************************************
 import { config } from './constants/internal-config';
 import { reducer as controller, sagas as controllerSagas } from './services/controller';
 // Build the middleware to run our Sagas
 const sagaMiddleware = createSagaMiddleware();
 // Apply "redux" extension compose for non production environment
 const enchantedCompose = !config('DEBUG', false)
 ? compose
 : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 // Create store outside of root to be able dispatch actions from anywhere!
 export const store = createStore(
 combineReducers({
    controller,
    // NOTE it may be "redux" libraries
  }),
 enchantedCompose(applyMiddleware(sagaMiddleware))
 );
 // initialize saga
 sagaMiddleware.run(controllerSagas);
 // Export
 export default store;
 **********************************************************************************************/

// outsource dependencies
import React from 'react';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { renderHook } from '@testing-library/react-hooks';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

// local dependencies
import * as CTRL from './index';

// configure
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  combineReducers({ controller: CTRL.reducer }),
  compose(applyMiddleware(sagaMiddleware))
);
// initialize saga
sagaMiddleware.run(CTRL.sagas);
// store wrapper with connected controller
export const ReduxProvider = ({ children }) => <Provider store={store}> <div> { children } </div> </Provider>;
// prepared wrapper for "@testing-library/react-hooks" with connected redux provider
export const renderHookWithRedux = hook => renderHook(hook, { wrapper: ReduxProvider });

// controller
export const testPrefix = 'test';
export const testTypes = ['TEST_ACTION_1', 'testAction2', 'test_ACTION3'];
export const formattedActionNames = ['testAction1', 'testAction2', 'testAction3'];
export const testInitial = { test: true };
export function * testSubscriber () { /* NOTE do nothing */ }
export const createTestCtrl = (options = {}) => CTRL.prepareController({
  types: testTypes,
  prefix: testPrefix,
  initial: testInitial,
  subscriber: testSubscriber,
  ...options
});
export const testCtrl = createTestCtrl({});
