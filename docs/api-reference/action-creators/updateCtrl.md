---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `updateCtrl`

:::info

You can only use it if you have prepared controller.
This is an action creator that will help you update any property of entire controller reducer.

:::

```js
controller.action.updateCtrl({ test: 'test' });
```

<Tabs defaultValue="ts">
<TabItem value="ts" label="Type Script">

#### controller.ts

```ts
import { put } from 'redux-saga/effects';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}
// NOTE action payloads
interface InitializePayload {
  some: string;
}

function * initializeSaga ({ type, payload } : Act<InitializePayload>) {
  // highlight-next-line
  yield put(controller.action.updateCtrl({ test: 'test' } }));
  // ...
}
```
#### index.ts

```jsx {8}
import logo from './logo.svg';
import { controller } from './controller';
import React, { useCallback } from 'react';
import { useController } from 'redux-saga-controller';

function User () {
  const [{ disabled }, { updateCtrl }, isControllerSubscribed] = useController(controller);
  const handleUpdateData = useCallback(() => updateCtrl({ test: 'test' } }), [updateCtrl]);
  
  <button className="btn" disabled={disabled} onClick={handleUpdateData}>
    { disabled ? <img src={logo} className="logo" alt="logo" /> : <span> UPDATE </span> }
  </button>
}
```

</TabItem>
<TabItem value="js" label="Java Script">

#### controller.js

```jsx {4}
import { put } from 'redux-saga/effects';

function * initializeSaga ({ type, payload }) {
  yield put(controller.action.updateCtrl({ test: 'test' } }));
  // ...
}
```

#### index.js

```jsx {8}
import logo from './logo.svg';
import { controller } from './controller';
import React, { useCallback } from 'react';
import { useController } from 'redux-saga-controller';

function User () {
  const [{ disabled }, { updateCtrl }, isControllerSubscribed] = useController(controller);
  const handleUpdateData = useCallback(() => updateCtrl({ test: 'test' } }), [updateCtrl]);
  
  return <button className="btn" disabled={disabled} onClick={handleUpdateData}>
    { disabled ? <img src={logo} className="logo" alt="logo" /> : <span> UPDATE </span> }
  </button>
}
```

</TabItem>
</Tabs>
