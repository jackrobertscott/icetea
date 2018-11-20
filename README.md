# Lumbridge

> 🏰 Improved logic management for React apps.

Once upon a time, a small company called Facebook created a front-end library to help in the development of application views. Since then, the world took the liberty of moving everything into components. I say no sir. No sir!

This library is here to try a new approach to front-end app development.

## Classes

The following classes provide functionality to front-end code development that are designed to work with React out of the box.

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