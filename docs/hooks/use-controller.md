---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useController

:::info

`useController` - hook to initialize you controller.

**IMPORTANT** `useController` can be subscribed not more than ones in the same time.

:::

<Tabs defaultValue="ts">
<TabItem value="ts" label="TypeScript">

```tsx
import { useController } from 'redux-saga-controller';

const [state, actions, isControllerConnected] = useController(controller);
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
import { useController } from 'redux-saga-controller';

const [state, actions, isControllerConnected] = useController(controller);
```
</TabItem>
</Tabs>

