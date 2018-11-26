# lumbridge

> 🏰 React application management made simple.

## Installation

Using npm:

```shell
npm i --save lumbridge
```

Using yarn:

```shell
yarn add lumbridge
```

Then import the helper classes where needed.

### Router

```js
import { Router } from 'lumbridge';

const router = Router.create({
  // code...
});
```

### Persistor

```js
import { Persistor, Scope } from 'lumbridge';

const persistor = Persistor.create({
  // code...
});
```

### Store

```js
import { Store } from 'lumbridge';

const store = Store.create({
  // code...
});
```

### Theme

```js
import { Theme } from 'lumbridge';

const fonts = Theme.create({
  // code...
});
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)