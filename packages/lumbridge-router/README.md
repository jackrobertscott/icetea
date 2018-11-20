# lumbridge

> 🏰 Improved route management for React apps.

## Installation

Using npm:

```shell
npm i --save lumbridge-router
```

Using yarn:

```shell
yarn add lumbridge-router
```

Then import the helper classes where needed.

```js
import { Router } from 'lumbridge-router';

const router = Router.create({
  // code...
});
```

## Examples

Problems being addressed:

1. Remove complexity behind structuring routes (caused by components).
2. Easier to access the exact path of a route when creating links to it.
3. Route guards can be easily implemented.
4. Save data before exiting can also be done pretty easily.

```js
const authRouter = Router.create({
  /**
   * Listen for changes in the route.
   */
  change: ({ location }) => console.log(location),
  /**
   * Define routes that can be accessed with this router.
   */
  routes: {
    /**
     * Each route is given a key which represents the name of the
     * route which not only makes it easy to use but also structures
     * the code quite nicely.
     */
    home: {
      exact: true,
      path: ({ match }) => `${match}/`,
      component: HomePage,
    },
    /**
     * See how you can add "enter" and "leave" methods which
     * help people set routing guards and protection methods
     * which might save a form's data before routing away.
     */
    login: {
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
      enter: () => someStateAccess.usersIsNotSignedIn,
      leave: () => saveTheDataBeforeRouting(),
    },
    /**
     * In this route we have some aliases which can be used to
     * request a path to a route by a different name.
     */
    logout: {
      alias: ['hello', 'yellow'],
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
    },
  }
});

/**
 * Easily insert the routes into the app like a normal component.
 */
const App = () => (
  <div>
    <h1>Use Like Another Component</h1>
    <nav>
      <authRouter.Link to="home" params={{ userId: '123' }}>
        Home
      </authRouter.Link>
      <a {...authRouter.anchor('login', { userId: '123' })}>
        Login
      </a>
    </nav>
    <authRouter.Routes />
  </div>
);
```

## Packages

- [lubridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lubridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lubridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lubridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lubridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)