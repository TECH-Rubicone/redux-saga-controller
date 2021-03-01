
# redux-saga-controller

<p align="center"> 
  <a href="https://codesandbox.io/s/redux-saga-controller031-sjc5r" target="_blank">CodeSandbox Demo</a>
  <br><br>
</p>


[![npm version](https://img.shields.io/npm/v/redux-saga-controller.svg)](https://www.npmjs.com/package/redux-saga-controller)
[![npm](https://img.shields.io/npm/dm/redux-saga-controller.svg)](https://www.npmjs.com/package/redux-saga-controller)

- [Getting Started](#getting-started)
- [API](#api)
- [Example](./tree/master/example) + [CodeSandbox Demo](https://codesandbox.io/s/redux-saga-controller031-sjc5r)
- [Release Notes](./releases)
- [License](#license)

## Getting Started

### Step 1: Connect Controller to redux store

```js
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as controllerReducer, sagas as controllerSaga } from 'redux-saga-controller';

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
```

## Step 2: Prepare controller annotation

```js
import Controller from 'redux-saga-controller';

// NOTE Initial data for your redux state
const initial = {
  initialized: false,
  disabled: false,
  data: {
    name: 'John',
    age: 30,
  }
};

// NOTE Create Controller
export const controller = new Controller({
  DEBUG: true, // Enable DEBUG Mode
  initial, // Setup initial data for redux state
  prefix: 'root', // Controller name
  types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
  subscriber: function * () {
    yield takeEvery(controller.TYPE.INITIALIZE, initializeSaga);
  }
});

export default controller;

function * initializeSaga ({ type, payload }) {
    console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
        , '\n payload:', payload
    );
    yield put(controller.action.GET_SELF());
    yield put(controller.action.UPDATE_CTRL({ initialized: true }));
}
```

### Step 3: Use it inside your react components

```jsx harmony
import React from 'react';
import { useController } from 'redux-saga-controller';

import { controller } from './controller';

export const Example1 = memo(() => {
  // NOTE Prefer way
  const [
    { data, disabled, initialized },
    { INITIALIZE, CLEAR_CTRL, GET_SELF },
    isControllerConnected
  ] = useController(controller);

  useEffect(() => {
    INITIALIZE();
    return CLEAR_CTRL;
  }, [INITIALIZE, CLEAR_CTRL]);

  if (!initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button disabled={disabled} onClick={() => GET_SELF()}>Get Details</button>
  </div>;
});
```

## API

### To setup controller you need

| Field      | Type          | Require/Optional | Default value              | Description                                                                              |
|------------|---------------|------------------|----------------------------|------------------------------------------------------------------------------------------|
| DEBUG      | boolean       | optional         | false                      | In DEBUG mode you will get additional information in console                             |
| prefix     | string        | optional         | controller_${unique_index} | The unique name of controller and field name in the store                                |
| initial    | object        | optional         | {}                         | Initial data of your store                                                               |
| types      | Array[string] | optional         | []                         | All list types which you need (Actions for these types will be generated automatically)  |
| subscriber | Generator     | required         | undefined                  | Redux-saga subscriber                                                                    |

```js
import Controller from 'redux-saga-controller';

export const controller = new Controller({
  DEBUG: true, // Enable DEBUG Mode
  initial: {}, // Setup initial data for redux state
  prefix: 'my-controller', // Controller name
  types: ['ACTION_1', 'ACTION_2'], // Types for which action creators will be generated
  subscriber: function * () {}
});
```

### Already created controller contains

| Field             | Type                                                  | Description                                                  |
|-------------------|-------------------------------------------------------|--------------------------------------------------------------|
| DEBUG             | boolean                                               | In DEBUG mode you will get additional information in console |
| initial           | I                                                     | Initial data of your store                                   |
| name              | string                                                | The unique name of controller and field name in the store    |
| TYPE              | Record<T, string>                                     | All list types which you passed                              |
| selector          | ControllerState<I>                                    | Selector function which will return all controller state     |
| selectorInitial   | state => I                                            | Selector function which will return initial data             |
| selectorActual    | state => I                                            | Selector function which will return actual data              |
| selectorConnected | state => boolean                                      | Selector function which will return isControllerConnected    |
| subscriber        | Generator<ForkEffect<never>, void, unknown>;          | Generator function for redux-saga                            |
| action            | Record<T \| DefaultActions, ActionCreator<AnyAction>> | All available action creators                                |

### React hooks 

```js
// useController - to use you controller and you will get all data you need
const [reducer, actions, isControllerSubscribed] = useController(controller);

// To get separately you can use next hooks
const reducer = useControllerData(controller);
const actions = useControllerActions(controller);
const isControllerConnected = useControllerSubscribe(controller);
```

## License

redux-saga-controller is [MIT licensed](./LICENSE).


