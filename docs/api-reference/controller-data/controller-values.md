---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Output controller values

|Name   | Type            | Description                                                                | Default value | 
|:------| :-------------- | :------------------------------------------------------------------------- | :------------ | 
|id     | `string`        | The id value will be equal to the prefix. Readonly.                        |'c-state'      |   
|actions| `object`        | Return the `object` with default action creators and your action creators. | -             |    
|select | `function`      | Method to get state of a particular controller.                            | -             |

### How select works 

<Tabs defaultValue="ts">
<TabItem value="ts" label="TypeScript">

```ts
controller.select(state: ReduxState): Partial<ReduxState>
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
controller.select(store.getState())
```

</TabItem>
</Tabs>

### Action types

<Tabs defaultValue="ts">
<TabItem value="ts" label="TypeScript">

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
  prefix: 'defaultPrefix',
  actions: {
    initialize: 'INITIALIZE', // TYPE: "@defaultPrefix-state/INITIALIZE"
    getSelf: 'GET_SELF', // TYPE: "@defaultPrefix-state/GET_SELF"
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
<TabItem value="js" label="JavaScript">

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
    prefix: 'defaultPrefix',
    actions: {
      data: 'DATA', // TYPE: "@defaultPrefix-state/DATA"
      initialize: 'INITIALIZE', // TYPE: "@defaultPrefix-state/INITIALIZE"
      updateData: 'UPDATE_DATA', // TYPE: "@defaultPrefix-state/UPDATE_DATA"
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
    prefix: 'defaultPrefix',
    actions: ['initialize', 'updateData'], // TYPE: "@defaultPrefix-state/initialize", TYPE: "@defaultPrefix-state/updateData"
    subscriber: function * () {
      // ...
    }
  },
);
```

</TabItem>
</Tabs>

