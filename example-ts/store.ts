
// outsource dependencies
import { fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, combineReducers, compose, Reducer } from 'redux';

// NOTE controller
// import { ... } from 'redux-saga-controller';
import { reducer as controllerReducer, sagas as controllerSagas, path as controllerPath, State as ControllerState } from '../src'; // Use line below

// local dependencies - whatever what you may need

export interface ApplicationState {
  [controllerPath]: ControllerState;
  anyOtherReducer: any;
}

// NOTE Build the middleware to run our Saga
const saga = createSagaMiddleware();
export const middleware = compose(applyMiddleware(saga));

// NOTE explain to ts what is it ;) to avoid type errors for --declaration
export const reducers: Reducer<ApplicationState> = combineReducers({
  [controllerPath]: controllerReducer,
  // NOTE whatever what you may need
  anyOtherReducer: () => ({}),
});
// NOTE Create store outside of root to be able dispatch actions from anywhere!
const store = createStore(reducers, middleware);

// NOTE simple initialize only "controller" sagas
// saga.run(controllerSagas);

// NOTE or controller with some thing else
saga.run(function * () {
  // NOTE provide to "controller" separated saga process
  yield fork(controllerSagas);
  // NOTE whatever what you may need
  // ... another code ...
});

export default store;
