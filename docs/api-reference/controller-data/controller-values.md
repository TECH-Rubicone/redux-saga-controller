---
sidebar_position: 1
---

# Output controller values

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

| Name        | Type            | Description                                                                                   | Default value  | 
|:----------- | :-------------- | :----------------------------------------------------------------------------------           | :--------------| 
| id          | `string`        | The id value will be equal to the prefix. Only dor reading.                                   |  'c-state'     |   
| actions     | `object` `array`| Return the `object`  with default action creators and your additional action creators.        |       -        |    
| select      | `function`      | Method for get initial state of a particular controller.                                      |       -        |

### How select works 

<Tabs defaultValue="ts">
<TabItem value="ts" label="Type Script">

```ts
controller.select(state: ReduxState): Partial<ReduxState>
```

</TabItem>
<TabItem value="js" label="Java Script">

```js
controller.select(store.getState())
```

</TabItem>
</Tabs>

### Action types

<Tabs defaultValue="ts">
<TabItem value="ts" label="Type Script">

```tsx title="ts" {11}
import { Controller, create } from 'redux-saga-controller';

interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData | null
}

export const controller:Controller<IInitial> = create({
  prefix: 'testController',
  actions: ['initialize', 'getSelf'], // TYPE: "@testController-state/initialize" TYPE: "@testController-state/getSelf"
  initial: {
    initialized: false,
    disabled: true,
    data: {
      name: 'John',
      age: 30,
    }
  },
  subscriber: function * () {
    // ...
  },
});
```

```tsx title="ts" {11,12,13,14}
import { Controller, create } from 'redux-saga-controller';

interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData | null
}

export const controller:Controller<IInitial> = create({
  prefix: 'testController',
  actions: {
    initialize: 'INITIALIZE', // TYPE: "@testController-state/INITIALIZE"
    getSelf: 'GET_SELF', // TYPE: "@testController-state/GET_SELF"
  },
  initial: {
    initialized: false,
    disabled: true,
    data: {
      name: 'John',
      age: 30,
    }
  },
  subscriber: function * () {
    // ...
  },
}); 
```

</TabItem>
<TabItem value="js" label="Java Script">

```jsx title="js" {12,13,14,15,16}
import { create } from 'redux-saga-controller';

export const controller = create(
  {
    // initial state controller
    initial: {
      initialized: false,
      disabled: true,
      data: {
        name: 'John',
        age: 30,
      }
    }, 
    prefix: 'testController',
    actions: {
      data: 'DATA', // TYPE: "@testController-state/DATA"
      initialize: 'INITIALIZE', // TYPE: "@testController-state/INITIALIZE"
      updateData: 'UPDATE_DATA', // TYPE: "@testController-state/UPDATE_DATA"
    },
    subscriber: function * () {
      // ...
    }
  },
);
```

```jsx title="js" {12}
import { create } from 'redux-saga-controller';

export const controller = create(
  {
    // initial state controller
    initial: {
      initialized: false,
      disabled: true,
      data: {
        name: 'John',
        age: 30,
      }
    }, 
    prefix: 'testController',
    actions: ['initialize', 'updateData'], // TYPE: "@testController-state/initialize", TYPE: "@testController-state/updateData"
    subscriber: function * () {
      // ...
    }
  },
);
```

</TabItem>
</Tabs>



