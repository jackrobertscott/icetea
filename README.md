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

## API

### Router

Considerations in design:

- Routing into a component can be aborted by checking data on a routes `enter` method.
- Prevent a user from routing away from a component (such as when a form has not been saved) with a route's `leave` method.
- Record and monitor all changes in the route location with the `change` method.
- Routes are smartly prioritised by showing only the route which was found be the closest to real path.
- Each route has a key which you can use to generate a link which you may route to.

```js
import { Router } from 'lumbridge';
import { HomePage, LoginPage, SignUpPage } from '../components/pages';

const authRouter = Router.create({
  routes: {
    home: {
      path: ({ match: { path } }) => `${path}/`,
      component: HomePage,
    },
    login: {
      path: ({ match: { path } }) => `${path}/login`,
      component: LoginForm,
      enter: () => userIsNotLoggedIn(),
      leave: () => saveDataBeforeLeaving(),
    },
    logout: {
      alias: ['hello', 'yellow'],
      path: ({ match }) => `${match}/sign-up`,
      component: SignUpPage,
    },
  },
  change: ({ match: { path } }) => {
    recordRouteForAnalytics(path);
  },
});
```

- The routes can be easily inserted into a regular app component.
- Nesting components are not supported on purpose. Instead, we encourage you to make multiple router instances and nest them in your normal components.

```js
import authRouter from '../routers/authRouter';

const App = () => (
  <Dashboard>
    <authRouter.Routes />
  </Dashboard>
);
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)
