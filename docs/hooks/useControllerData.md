---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# useControllerData

:::info

`useControllerData` - to use you controller, and you will get all initial data you need. Provide ability to use 
controller data outside component subscriber.
:::

<Tabs defaultValue="ts">

<TabItem value="ts" label="Type Script">

```jsx
import { useControllerData } from 'redux-saga-controller';

const controllerState = useControllerData(controller);
```

</TabItem>
<TabItem value="js" label="Java Script">

```jsx
import { useControllerData } from 'redux-saga-controller';

const controllerState = useControllerData(controller);
```

</TabItem>
</Tabs>

