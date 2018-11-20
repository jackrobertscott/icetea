# Lumbridge

> 🏎 Improved logic management for React apps.

Once upon a time, a small company called Facebook created a front-end library to help in the development of application views.

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