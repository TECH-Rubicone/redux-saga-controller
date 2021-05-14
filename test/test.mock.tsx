
// outsource dependencies
import React from 'react';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { renderHook } from '@testing-library/react-hooks';
import {createStore, applyMiddleware, combineReducers, compose, Reducer, AnyAction} from 'redux';

// local dependencies
import {reducer as controller, sagas as controllerSagas, CSDState, prepareController, REDUCER_PATH} from '../src'; // Use line below
// NOTE Build the middleware to run our Saga
const saga = createSagaMiddleware();
const middleware = compose(applyMiddleware(saga));
// NOTE explain to ts what is it ;) to avoid type errors
interface ApplicationState { controller: CSDState; }
const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({ controller });


export const store = createStore(reducers, middleware);
// initialize saga
saga.run(controllerSagas);
// store wrapper with connected controller
export const ReduxProvider = ({ children }: { children: any }) => <Provider store={store}> <div> { children } </div> </Provider>;
// prepared wrapper for "@testing-library/react-hooks" with connected redux provider
export const renderHookWithRedux = (hook: any) => renderHook(hook, { wrapper: ReduxProvider });

export class TestStore {
  private state = {};

  constructor (private reducer: any, private path: string) {
    // @ts-ignore
    this.dispatch({ type: `@emulate/INIT_REDUX/${Date.now()}` });
  }

  dispatch = (action: AnyAction): void => {
    // @ts-ignore
    this.state[path] = this.reducer(this.state[path], action);
  }

  getState = () => this.state;

  select = (selector: any) => selector(this.getState());
}

// controller
export const testPrefix = 'test';
export const testTypes = ['TEST_ACTION_1', 'testAction2', 'test_ACTION3'];
export const formattedActionNames = ['testAction1', 'testAction2', 'testAction3'];
export const formattedTypeNames = ['TEST_ACTION_1', 'TEST_ACTION2', 'TEST_ACTION3'];
export const testInitial = { test: true };
export function * testSubscriber () { /* NOTE do nothing */ }
export const createTestCtrl = (options = {}) => prepareController({
  types: testTypes,
  prefix: testPrefix,
  initial: testInitial,
  subscriber: testSubscriber,
  ...options
});
