
// outsource dependencies
import { fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { reducer as controllerReducer, sagas as controllerSagas, path } from 'redux-saga-controller';

// NOTE Build the middleware to run our Saga
const saga = createSagaMiddleware();
export const middleware = compose(applyMiddleware(saga));

// NOTE explain to ts what is it ;) to avoid type errors
export const reducers = combineReducers({
  [path]: controllerReducer,
  // NOTE whatever what you may need
  anyOtherReducer: () => ({}),
});
// NOTE Create store outside of root to be able dispatch actions from anywhere!
const store = createStore(reducers, middleware);

// NOTE simple initialize only "controller"
// saga.run(controllerSagas);

// NOTE or controller with some thing else
saga.run(function * () {
  // NOTE provide to "controller" separated saga process
  yield fork(controllerSagas);
  // NOTE whatever what you may need
  // ... another code ...
});

export default store;
