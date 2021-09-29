---
sidebar_position: 1
---
# JavaScript

:::info

More information about **controller data** check [`here`](/docs/api-reference/controller-data/data).

:::

<iframe width="100%" height="500" src="https://codesandbox.io/embed/app-example-ts-tyvv5?fontsize=14&theme=dark&view=editor"
title="app-example-js"
allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

#### controller.js

```js
import { create } from 'redux-saga-controller';
import { takeEvery, put, select, delay } from 'redux-saga/effects';

export const controller = create({
  // NOTE Prefix should be unique for each controller
  prefix: 'defaultPrefix',
  // NOTE Types for which action creators will be generated
  actions:   {
    initialize: 'init',
    getSelf: 'getSelf', 
    someAction: 'someAction',
  },
  // NOTE Initial data for your redux state
  initial: {
    initialized: false,
    disabled: true,
    data: null
  },
  // NOTE root subscriber of controller
  subscriber: function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
});

// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload }) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  const { initialized } = yield select(controller.select);
  // NOTE emulate request
  yield delay(3e3);
  const data = {
    age: 30,
    name: '',
    the: 'initail',
    request: 'data',
  };
  yield put(controller.action.updateCtrl({ data }));
  // NOTE emulate request
  yield delay(3e3);
  // NOTE update any property of entire controller reducer "IInitial"
  yield put(controller.action.updateCtrl({ initialized: true, disabled: false }));
}

function * getSelfSaga ({ type, payload }) {
  yield put(controller.action.updateCtrl({ disabled: true }));
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume its request ;):', payload
  );
  // NOTE emulate request
  yield delay(3e3);
  const data = {
    id: payload.id,
    name: 'John',
    age: 30,
  };
  // NOTE update any property of entire controller reducer
  yield put(controller.action.updateCtrl({ data, disabled: false }));
}

```

#### index.js

```js
import { controller } from './controller';
import { useController } from 'redux-saga-controller';
import React, { useCallback, useEffect } from 'react';

function App() {
  const [{ data, disabled, initialized }, // initial data from your redux state
    { initialize, getSelf }, // action creators
  ] = useController(controller);

  useEffect(() => { initialize({ some: 'probably route data for initialization'}) }, [initialize]);
  const handleGetData = useCallback(() => getSelf({ id: 1 }), [getSelf]);

  return <div className="container">
    { !initialized ? <img src={logo} className="logo" alt="logo" /> : <>
      <h2> DATA </h2>
      <p> { JSON.stringify(data) } </p>
      <button className="btn" disabled={disabled} onClick={handleGetData}>
        { disabled ? <img src={logo} className="logo" alt="logo" /> : <span> GET </span> }
      </button>
    </> }
  </div>;
}
```



