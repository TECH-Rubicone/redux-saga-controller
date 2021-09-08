---
sidebar_position: 1
---

# Controller creation

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
```

```ts
declare function prepareController<Actions, Initial>(
  actions: ActAnnotation,
  subscriber: Subscriber,
  initial: Initial,
  prefix?: string
): Controller<Actions, Initial>;
```