---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `select`

:::info

You can use it inside your saga.
This is method that will help you get initial state from reducer.

:::

<Tabs defaultValue="ts">
<TabItem value="ts" label="TypeScript">

#### controller.ts

```ts 
import { select } from 'redux-saga/effects';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}
// NOTE action payloads
interface InitializePayload {
  some: string;
}
interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData | null
}

function * initializeSaga ({ type, payload } : Act<InitializePayload>) {
  // highlight-next-line
  const { initialized }: IInitial = yield select(controller.select);
  // ...
}
```
#### index.ts

```jsx {5}
import { controller } from './controller';
import { useDispatch, useSelector } from 'react-redux';

function  User() {
  const { initialized } = useSelector(controller.select);
  // ...
}
```

</TabItem>
<TabItem value="js" label="JavaScript">

#### controller.js

```jsx {4}
import { select } from 'redux-saga/effects';

function * getSelfSaga() {
  const { initialized } = yield select(controller.select);
  // ...
}
```

#### index.js

```jsx {5}
import { controller } from './controller';
import { useDispatch, useSelector } from 'react-redux';

function  User() {
  const { initialized } = useSelector(controller.select);
  // ...
}
```

</TabItem>
</Tabs>

