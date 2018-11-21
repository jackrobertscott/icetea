# Lumbridge

> 🏰 Focused & simple helper objects which improve React application structure and composability.

## Main Features

- `Router`: Easy to use route guards, enter and leave hooks, simplified route structure to improve maintainability.
- `Store`: Quick to setup, modular and scalable local state management.
- `Persistor`: Keep your application data syncronized easily.
- `Theme`: Functional styles which act like lego when building components.

## Usage

Using [npm](https://www.npmjs.com/package/lumbridge):

```shell
npm i --save lumbridge
```

Using yarn

```shell
yarn add lumbridge
```

Import into a your react app like normal.

```js
import { Store } from 'lumbridge';

const authStore = Store.create({
  // code...
});
```

**Note:** the components will usually be created in their own files (e.g. `src/stores/authStore.js`) which can then be imported into a React component file.

### Example Router

```js
const authRouter = new Router({
  change: ({ location }) => console.log(location),
  routes: {
    home: {
      exact: true,
      path: ({ match }) => `${match}/`,
      component: HomePage,
    },
    login: {
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
      enter: () => someStateAccess.usersIsNotSignedIn,
      leave: () => saveTheDataBeforeRouting(),
    },
    logout: {
      alias: ['hello', 'yellow'],
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
    },
  }
});
```

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

```js
import { Router } from 'lumbridge';

const router = Router.create({
  // code...
});
```

## Packages

- [lubridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lubridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lubridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lubridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lubridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)
