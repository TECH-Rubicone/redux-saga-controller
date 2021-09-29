---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useController

:::info

`useController` - to use you controller, and you will get all data you need.

**IMPORTANT** in one time in the DOM `useController` can subscribe not more than one time for one controller.

:::

<Tabs defaultValue="ts">
<TabItem value="ts" label="Type Script">

```jsx
import { useController } from 'redux-saga-controller';

const [controllerState, actions] = useController(controller);
```

</TabItem>
<TabItem value="js" label="Java Script">

```jsx
import { useController } from 'redux-saga-controller';

const [controllerState, actions] = useController(controller);
```
</TabItem>
</Tabs>


