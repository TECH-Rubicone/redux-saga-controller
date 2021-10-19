---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useControllerSubscribe

:::info

`useControllerSubscribe` - hook to get  information about controller outside of  component  where controller is subscribed.

::: 

<Tabs defaultValue="ts">

<TabItem value="ts" label="TypeScript">

```jsx
import { useControllerSubscribe } from 'redux-saga-controller';

const isControllerConnected = useControllerSubscribe(controller);
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
import { useControllerSubscribe } from 'redux-saga-controller';

const isControllerConnected = useControllerSubscribe(controller);
```

</TabItem>
</Tabs>

