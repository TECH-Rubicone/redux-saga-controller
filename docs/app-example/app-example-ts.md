---
sidebar_position: 0
---

# Type Script

:::info

More information about **controller data** check [`here`](/docs/api-reference/controller-data/data).

:::

<iframe width="100%" height="500" src="https://codesandbox.io/embed/app-example-ts-tyvv5?fontsize=14&hidenavigation=1&theme=dark&view=editor"
title="app-example-ts"
allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

#### controller.ts

```ts
import { Action } from 'redux';
import { takeEvery, put, select, delay } from 'redux-saga/effects';
import { Controller, ActionCreators, ActionCreator, create } from 'redux-saga-controller';
// import createController, { Controller, ActionCreators, ActionCreator } from 'redux-saga-controller';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}

// NOTE IMPORTANT!
// You should add interface only of you will use select effect from redux-saga
// In all cases except select effect you don't need it
// It because redux-saga effect select return "any" in all cases
type UserData = {
  name: string;
  age: number;
  [key: string]: unknown
}
interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData | null
}
// NOTE action payloads
interface InitializePayload {
  some: string;
}
interface SomePayload {
  id: number | string;
  name?: string;
}
type GetSelfPayload = { id: string | number };
// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  initialize: ActionCreator<InitializePayload>;
  someAction: ActionCreator<SomePayload>;
  getSelf: ActionCreator<GetSelfPayload>;
}

export const controller:Controller<IActions, IInitial> = create({
  // NOTE Prefix should be unique for each controller
  prefix: 'test',
  actions: ['initialize', 'getSelf'],
  initial: {
    initialized: false,
    disabled: true,
    data: null
  },
  subscriber: function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
});

// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload } : Act<InitializePayload>) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  const { initialized }: IInitial = yield select(controller.select);
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

function * getSelfSaga ({ type, payload } : Act<GetSelfPayload>) {
  yield put(controller.action.updateCtrl({ disabled: true }));
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

#### index.ts

```js
import { controller } from './controller';
import React, { useEffect, useCallback} from 'react';
import { useController } from 'redux-saga-controller';

function App() {
  const [
    { data, disabled, initialized }, // initial data from your redux state
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
