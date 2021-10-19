---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useControllerActions

:::info

`useControllerActions` - to use you controller, and you will get all action creators you need. Provide ability to use 
controller actions outside of component subscriber.

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

