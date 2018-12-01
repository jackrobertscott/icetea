# lumbridge-store

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Installation

Using [npm](https://www.npmjs.com/package/lumbridge-store):

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

## API

### Config

Each store is configured with a `config` object:

```js
const config = {
  // options...
};

const store = Store.create(config);
```

This config object will contain all the information required by the store.

#### `config.schema`

- Type: `object`
- Required: `true`

Describes the shape of the state object and can optionally set validations on that shape.

```js
const store = Store.create({
  schema: {
    // properties...
  },
});
```

Example:

```js
import { string, boolean, object } from 'yup';

const store = Store.create({
  schema: {
    userId: {
      state: null,
      validate: string(),
    },
    loggedIn: {
      state: false,
      validate: boolean().required(),
    },
    deepExample: {
      state: null,
      validate: object({
        one: string(),
        two: string().required(),
      }),
    },
  },
});
```

**Note:** the above example uses the validation library [Yup](https://www.npmjs.com/package/yup) to make thinds easier but you can use any validation function.

Properties:

- `schema[propName].state` [any]: the default value of this property.
- `schema[propName].validate` [func]: a function which is passed the value to check and should return `true` if it is valid.

#### `config.actions`

- Type: `object`
- Required: `false`

The actions object is used for more complex state manipulation functions. However, you do not need to use this in order to use the store.

```js
const store = Store.create({
  schema: {
    // properties...
  },
  actions: {
    // actions...
  },
});
```

Example:

```js
const store = Store.create({
  schema: {
    // token, userId, loggedIn...
  },
  actions: {
    loginUser: ({ token, userId }) => ({
      token,
      userId,
      loggedIn: Boolean(token && userId),
    }),
  },
});

/**
 * Then you can execute the action...
 */
store.dispatch.loginUser({ token, userId });
```

Properties:

- `actions[actionName]` [func]: actions enable you to manipulate multiple store values in one method. This function must return an object which will be used to *partially* update the state.

### Usage

There are a number of methods you can use to update and extract the values of the store.

#### `store.update`

- Type: `func`
- Returns: `void`

Make a *partial* update to the values of the store.

```js
import { string, boolean } from 'yup';

const store = Store.create({
  schema: {
    fullName: {
      state: null,
      validate: string().nullable(),
    },
    isMember: {
      state: false,
      validate: boolean().required(),
    },
  },
});

store.update({
  fullName: 'Jack Scott',
});
```

**Note:** when `store.update` is called, a new object is created by combining the old values with the new values passed into the update function. This is similar to how `this.setState()` works in React components.

#### `store.dispatch[actionName]`

- Type: `func`
- Returns: `void`

To improve code reuse and encourage refactoring of your code, actions let you update multiple state values in one go.

```js
const store = Store.create({
  schema: {
    // code...
  },
  actions: {
    startQuest: ({ name, inFalador }) => ({
      questName: inFalador ? `${name} is in Falador!` : `${name} is *not* in Falador!`,
      doingQuest: true,
    }),
  },
})

store.dispatch.startQuest({
  name: 'Jack Scott',
  inFalador: true,
});
```

Notice how the `startQuest` action is being set in `actions` and then is being *dispatched* by the `store` later in the code.

#### `store.watch`

- Type: `func`
- Returns: `unwatch`

Pass optional listener functions into this in order to get informative updates on changes in the store.

```js
const store = Store.create(config);

const unwatch = store.watch({
  state: state => console.log(state),
  errors: errors => console.log(errors),
});

const componentWillUnmount = () => unwatch();
```

**Note:** when you start watching a store, don't forget to call the `unwatch` function when the component unmounts and you stop listening for changes (see above code). If you don't unwatch, then you might cause a memory leak.

#### `store.state`

- Type: `object`

This property gives you access to the internal store values.

```js
const authStore = Store.create(config);

const mainRouter = Router.create({
  routes: {
    home: {
      path: '/',
      exact: true,
      component: HomePage,
      enter: {
        before: () => authStore.state.loggedIn,
      },
    },
  },
});
```

The above code ([using the lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)) will only allow the use to access the home page when they are logged in.

#### `store.errors`

- Type: `object`

This property gives you access to errors between the state and the validators.

```js
const userStore = Store.create(config);

const usersRouter = Router.create({
  routes: {
    home: {
      path: '/update',
      component: UserUpdateForm,
      leave: {
        before: () => !Object.keys(userStore.errors).length,
      },
    },
  },
});
```

The above code only allows users to leave when there are no errors in the store.

#### `store.reset`

- Type: `func`

This will reset the store to the default schema.

```js
const userStore = Store.create(config);

const logout = () => userStore.reset();
```

**Note:** this does *not* unsubscribe from any of the watch functions.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)