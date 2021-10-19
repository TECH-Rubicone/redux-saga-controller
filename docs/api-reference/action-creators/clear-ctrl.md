---
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# `clearCtrl`

:::info

This is an action creator which helps you to bring reducer to initial state.

:::

```js
controller.action.clearCtrl();
```

<Tabs defaultValue="ts">

<TabItem value="ts" label="TypeScript">

#### controller.ts

```tsx {14}
import { put } from 'redux-saga/effects';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}
// NOTE action payloads
interface InitializePayload {
  some: string;
}

function * initializeSaga ({ type, payload } : Act<InitializePayload> ) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  // ...
}
```
#### index.ts

```jsx {9}
import React, { useEffect } from 'react';
import { controller } from './controller';
import { useController } from 'redux-saga-controller';

function User () {
  const [reducer, { clearCtrl, initialize }, isControllerSubscribed] = useController(controller);
  useEffect(() => {
    initialize({ id });
    return () => clearCtrl();
  }, [clearCtrl, initialize, id]);
  // ...
}
```

</TabItem>
<TabItem value="js" label="JavaScript">

#### controller.js

```jsx {5}
import { put } from 'redux-saga/effects';

function * initializeSaga ({ type, payload }) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  // ...
}
```

#### index.js

```jsx {9}
import React, { useEffect } from 'react';
import { controller } from './controller';
import { useController } from 'redux-saga-controller';

function User () {
  const [reducer, { initialize, clearCtrl }, isControllerSubscribed] = useController(controller);
  useEffect(() => {
    initialize({ id });
    return () => clearCtrl();
  }, [clearCtrl, initialize, id]);
  // ...
}
```
</TabItem>
</Tabs>

