---
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Controller data

|Name      |Type            |Description                                                        |Default value|Required|
|:---------| :-------------  | :------------------------------------------------------      |:------------|:-----------|
|prefix    | `string`        | Prefix should be unique for each controller.                 |  'c-state'  |**Optional**|
|actions   | `object` `array`| The `object` in which the action creators will be generated.      |    -   |**Required**|
|initial   | `object`        | Initial data for your redux state.                              |       - | **Required**|
|subscriber| `function`      | Root watcher saga of controller.                                 |       - |**Required**|

### Example action.

<Tabs defaultValue="ts">

<TabItem value="ts" label="TypeScript">

```tsx {13}
import { takeEvery } from 'redux-saga/effects';
import { Controller, ActionCreators, ActionCreator, create } from 'redux-saga-controller';

// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  initialize: ActionCreator<InitializePayload>;
  someAction: ActionCreator<SomePayload>;
  getSelf: ActionCreator<GetSelfPayload>;
}

export const controller:Controller<IActions, IInitial> = create({
  prefix: 'defaultPrefix',
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
```

```tsx {12,13,14,15,16}
import { takeEvery } from 'redux-saga/effects';
import createController, { Controller, ActionCreators, ActionCreator } from 'redux-saga-controller';

// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  initialize: ActionCreator<InitializePayload>;
  someAction: ActionCreator<SomePayload>;
  getSelf: ActionCreator<GetSelfPayload>;
}

export const controller:Controller<IActions, IInitial> = createController(
  {
    initialize: 'init',
    getSelf: 'getSelf',
    someAction: 'someAction',
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
```
</TabItem>
<TabItem value="js" label="JavaScript">

```jsx {6}
import { create } from 'redux-saga-controller';
import { takeEvery } from 'redux-saga/effects';

export const controller = create({
  prefix: 'defaultPrefix',
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
```

```jsx {6,7,8,9,10}
import { takeEvery } from 'redux-saga/effects';
import createController from 'redux-saga-controller';

export const controller = createController(
  // NOTE Types for which action creators will be generated
  {
    initialize: 'init',
    getSelf: 'getSelf',
    someAction: 'someAction',
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
  'defaultPrefix'
);
```

</TabItem>
</Tabs>

