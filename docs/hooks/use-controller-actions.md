---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useControllerActions

:::info

`useControllerActions` - hook to get all actions *(action creators are already wrapped with dispatch)* from your controller. Provides ability to use 
controller actions outside of component where controller is subscribed.

:::

<Tabs defaultValue="ts">

<TabItem value="ts" label="TypeScript">

```jsx
import { useControllerActions } from 'redux-saga-controller';

const actions = useControllerActions(controller);
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
import { useControllerActions } from 'redux-saga-controller';

const actions = useControllerActions(controller);
```

</TabItem>
</Tabs>

