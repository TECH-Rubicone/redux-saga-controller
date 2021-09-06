# Getting Started

## Step 1: Connect Controller to redux store

```js
import createSagaMiddleware from 'redux-saga';
import { reducer, sagas, path } from 'redux-saga-controller';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';


const saga = createSagaMiddleware();
const middleware = compose(applyMiddleware(saga));
const reducers = combineReducers({
  [path]: reducer,
  // NOTE whatever what you may need
  ...
});

const store = createStore(reducers, middleware);

// NOTE simple initialize only "controller"
// saga.run(sagas);
// NOTE or controller with some thing else
saga.run(function * () {
  // NOTE provide to "controller" separated saga process
  yield fork(sagas);
  // NOTE whatever what you may need
  ...
});

export default store;
```

## Step 2: Prepare controller annotation

```js
import createController from 'redux-saga-controller';

export const controller = createController(
  // NOTE Types for which action creators will be generated
  {
    initialize: 'init',
    getSelf: 'test',
  },
  // NOTE root subscriber of controller 
  function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
  // NOTE Initial data for your redux state
  {
    initialized: false,
    disabled: false,
    data: {
      name: 'John',
      age: 30,
    }
  }
);

function * initializeSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
      , '\n payload:', payload
  );
  // NOTE each time bring to initial state
  yield put(controller.action.clearCtrl());
  // NOTE prepare view data
  ...
  // NOTE unblock view when will be done all preparations
  yield put(controller.action.updateCtrl({ initialized: true }));
}
function * getSelfSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
      , '\n payload:', payload
  );
  const data = yield call(getDataFromAPI);
  yield put(controller.action.updateCtrl({ data }));
}
```

## Step 3: Use it inside your React Components

```jsx harmony
import React from 'react';
import { controller } from './controller';
import { useController } from 'redux-saga-controller';

export const Example1 = memo(() => {
  // NOTE Prefer way
  const [
    { data, disabled, initialized },
    { initialize, getSelf }
  ] = useController(controller);

  useEffect(() => { initialize(); }, [initialize]);

  return !initialized ? null : <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button disabled={disabled} onClick={() => getSelf()}>Get Details</button>
  </div>;
});
```

## React hooks 

```js
// useController - to use you controller and you will get all data you need
const [reducer, actions, isControllerSubscribed] = useController(controller);

// To get separately you can use next hooks
const reducer = useControllerData(controller);
const actions = useControllerActions(controller);
const isControllerConnected = useControllerSubscribe(controller);
```



