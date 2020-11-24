import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import { reducer as controllerReducer, sagas as controllerSaga } from '../src'; // Use line below
// import { reducer as controllerReducer, sagas as controllerSaga } from 'redux-saga-controller';

// NOTE Build the middleware to run our Saga
const sagaMiddleware = createSagaMiddleware();

// NOTE Create store outside of root to be able dispatch actions from anywhere!
const store = createStore(
  combineReducers({
    // ...your other reducers here
    // you have to pass controllerReducer under 'controller' key,
    controller: controllerReducer,
  }),
  applyMiddleware(sagaMiddleware)
);

// NOTE Initialize application sagas
sagaMiddleware.run(controllerSaga);

export default store;
