---
sidebar_position: 2
---

## Controller function annotation using createController

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="ts" label="TypeScript" default>

```tsx {40}
import { Action } from 'redux';
import { takeEvery, put, select, delay } from 'redux-saga/effects';
import createController, { Controller, ActionCreators, ActionCreator } from 'redux-saga-controller';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}

// NOTE IMPORTANT!
// You should add interface only if you will use select effect from redux-saga
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

export const controller:Controller<IActions, IInitial> = createController(
  {
    initialize: 'init',
    getSelf: 'test',
    someAction: 'test',
  },
  function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
  {
    initialized: false,
    disabled: true,
    data: {
      name: 'John',
      age: 30,
    }
  },
  'defaultPrefix' // controller prefix
);

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

</TabItem>
<TabItem value="js" label="JavaScript" default>

```jsx {4}
import createController from 'redux-saga-controller';
import { takeEvery, put, select, delay } from 'redux-saga/effects';

export const controller = createController(
  // NOTE Types for which action creators will be generated
  {
    initialize: 'init',
    getSelf: 'test',
    someAction: 'test',
  },
  // NOTE root subscriber of controller
  function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
  // NOTE Initial data for your redux state
  {
    initialized: false,
    disabled: true,
    data: {
      name: 'John',
      age: 30,
    }
  },
  // NOTE Prefix should be unique for each controller
  'defaultPrefix' // controller prefix
);

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

</TabItem>
</Tabs>

