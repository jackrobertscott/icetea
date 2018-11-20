# lumbridge-store

> 🏰 Improved global data management for React apps.

## Installation

Using npm:

```shell
npm i --save lumbridge-store
```

Using yarn:

```shell
yarn add lumbridge-store
```

Then import the helper classes where needed.

```js
import { Store } from 'lumbridge-store';

const store = Store.create({
  // code...
});
```

## Examples

Problems being addressed:

- Creating a data store is really simple (much easier than creating redux reducers).
- Access and change data store from anywhere in the app that imports the store.
- Easily integrates with forms making form validation super simple.

```js
/**
 * Keep it simple.
 *
 * 1. No asyncronise calls, leave that work up to the data services.
 * 2. Make the data flat, avoid complex objects.
 */
const authStore = Store.create({
  /**
   * This is the initial state of the store.
   */
  state: {
    token: str({ default: '' }),
    userId: null,
    loggedIn: false,
  },
  /**
   * Add validations on the store data which will populate an
   * errors object on this store (useful for forms).
   */
  validations: {
    token: Yup.string(),
    userId: Yup.string(),
    loggedIn: Yup.boolean().required(),
  },
  /**
   * Mutations are a cross between a reducer function and the setState
   * method which does not require you to destructure over and over.
   *
   * The reason we use "store.update({ })" instead of just returning
   * an object "({ })" is because it helps people understand how the
   * api works and that enables them to make better code decisions.
   */
  actions: {
    updateUserId: store => ({ userId }) => store.update({
      userId,
      loggedIn: !!userId,
    }),
  }
});

/**
 * Use in an auth routing guard...
 */
const authRouter = Router.create({
  routes: {
    home: {
      exact: true,
      path: ({ match }) => `${match}/`,
      component: HomePage,
      enter: () => authStore.state.loggedIn,
    },
  },
});

/**
 * Use in a form...
 */
const LoginForm = () => (
  <form>
    <div>
      <input
        type="text"
        name="username"
        value={authStore.state.username}
        onChange={
          event => authStore.update({ username: event.target.value })
        }
      />
      {authStore.errors.username && <div>{authStore.errors.username}</div>}
    </div>
    <div>
      <authStore.Field name="username" />
      <authStore.Error name="username" />
    </div>
  </form>
);
```

## Packages

- [lubridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lubridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lubridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lubridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lubridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)