---
sidebar_position: 1
---

## Controller object annotation using create

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs defaultValue="ts">
<TabItem value="ts" label="Type Script">

```tsx {40}
import { Action } from 'redux';
import { takeEvery, put, select, delay } from 'redux-saga/effects';
import { Controller, ActionCreators, ActionCreator, create } from 'redux-saga-controller';

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
  prefix: 'test',
  actions: ['initialize', 'getSelf'],
  initial: {
    initialized: false,
    disabled: true,
    data: {
      name: 'John',
      age: 30,
    }
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
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume it`s initial request ;):', payload
    , '\n initialized:', initialized
  );
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
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume it`s getSlef request ;):', payload
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
<TabItem value="js" label="Java Script">

```jsx {4}
import { create } from 'redux-saga-controller';
import { takeEvery, put, select, delay } from 'redux-saga/effects';

export const controller = create({
  // NOTE Prefix should be unique for each controller
  prefix: 'test',
  // NOTE Types for which action creators will be generated
  actions:   {
    initialize: 'init',
    getSelf: 'test',
    someAction: 'test',
  },
  // NOTE Initial data for your redux state
  initial: {
    initialized: false,
    disabled: true,
    data: {
      name: 'Jon',
      age: 22
    }
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
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n initialized:', initialized
    , '\n payload:', payload
  );
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


