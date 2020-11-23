
// outsource dependencies
import React from 'react';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { renderHook } from '@testing-library/react-hooks';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

// local dependencies
import { reducer as controller, sagas as ctrlSagas, Controller } from '../src';

// NOTE prevent node errors within tests
process.on('unhandledRejection', () => null);

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

// configure
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ controller }),
  compose(applyMiddleware(sagaMiddleware))
);
// initialize saga
sagaMiddleware.run(ctrlSagas);
// store wrapper with connected controller
// @ts-ignore
const ReduxProvider = ({ children }) => <Provider store={store}> <div> { children } </div> </Provider>;
// prepared wrapper for "@testing-library/react-hooks" with connected redux provider
const renderHookWithRedux = (hook: any) => renderHook(hook, { wrapper: ReduxProvider });

// controller
const testPrefix = 'test';
const testTypes = ['TEST_ACTION_1', 'testAction2', 'test_ACTION3'];
const formattedActionNames = ['testAction1', 'testAction2', 'testAction3'];
const testInitial = { test: true };
function * testSubscriber () { /* NOTE do nothing */ }
const createTestCtrl = (options = {}) => new Controller({
  types: testTypes,
  prefix: testPrefix,
  initial: testInitial,
  subscriber: testSubscriber,
  ...options
});
