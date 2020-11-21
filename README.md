
# redux-saga-controller

[![npm version](https://img.shields.io/npm/v/redux-saga-controller.svg)](https://www.npmjs.com/package/redux-saga-controller)
[![npm](https://img.shields.io/npm/dm/redux-saga-controller.svg)](https://www.npmjs.com/package/redux-saga-controller)

## DOCUMENTATION

- Getting Started
- Examples
- API
- FAQ
- Release Notes
- Older Documentation

### Getting StartedGetting Started

#### Basic Usage Guide

##### Step 1: Connect Controller to redux store

Example:

```js

// NOTE outsource dependencies
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
```

##### Step 2: Prepare controller annotation

From controller you will get

| Field      | Type          | Require/Optional | Default value              | Description                                                                              |
|------------|---------------|------------------|----------------------------|------------------------------------------------------------------------------------------|
| prefix     | string        | optional         | controller_${unique_index} | The unique name of controller and field name in the store                                |
| initial    | object        | optional         | {}                         | Initial data of your store                                                               |
| types      | Array[string] | optional         | []                         | All list types which you need (Actions for these types will be generated automatically)  |
| subscriber | Generator     | required         | undefined                  | Redux-saga subscriber                                                                    |

Example:

```js
import Controller from 'redux-saga-controller';
// import { Controller } from 'redux-saga-controller';

// NOTE configure
const initial = {
    disabled: false,
    initialized: false,
    errorMessage: null,
    data: null,
};

// NOTE Create controller
export const controller = new Controller({
    initial, // NOTE pass your initial data for store
    prefix: 'controller-prefix', // NOTE The field is optional
    types: ['initialize', 'updateData'], // NOTE Count all actions which you need
    *subscriber () {
        // NOTE Subscribe to all actions which you need
        yield takeEvery(controller.TYPE.initialize, initializeSaga);
        yield takeEvery(controller.TYPE.updateData, updateDataSaga);
    }
});

export default controller;

function * initializeSaga ({ type, payload }) {
    console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
        , '\n payload:', payload
    );
    yield put(controller.action.updateCtrl({ initialized: true }));
}

function * updateDataSaga ({ type, payload }) {
    console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
        , '\n payload:', payload
    );
    yield put(controller.action.updateCtrl({ data: [] }));
}
```

You will get from controller

```js
// NOTE Unique name of you controller
// controller.name


// NOTE All actions in your controller

// default action creators

// controller.action.updateCtrl
// controller.action.clearCtrl

// custom action creators

// controller.action.initialize
// controller.action.updateData


// NOTE All action types which were passed (They are unique)

// controller.TYPE.initialize
// controller.TYPE.updateData


// NOTE Selector to get all your data from the store
// controller.selector


// NOTE Redux saga channel
// controller.channel


// You redux saga subscriber
// controller.subscriber
// NOTE You will get
```

##### Step 3: Use it inside your react components

React hooks

Example:

```js
// useController - to use you controller and you will get all data you need
const [reducer, actions, isControllerSubscribed] = useController(controller);

// To get separately you can use next hooks
const reducer = useControllerData(controller);
const actions = useControllerActions(controller);
const isControllerSubscribed = useControllerSubscribe(controller);
```

## TODO

### For project

- Setup tags and github actions
- Implement git conventional commits
- Check and setup correct `peerDependencies`, `devDependencies` and `dependencies`
- Remove build files from repository
- check `.editorconfig`
- check `.browserslistrc` (not used)
- check `.gitignor`
- check `.eslintignore`
- check `.eslintrc.json`
- check `tsconfig.json`
- check `rollup.config.js`
- check `package.json`
- check `.npmignore`
- check `jest-setup.ts`
- check `jest.config.json`

### For controller

- Add checking all arguments on the initialization
- Add debug mode
