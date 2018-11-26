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

## API

### Config

Each store is configured with a `config` object:

```js
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
      default: null,
      validate: string(),
    },
    loggedIn: {
      default: false,
      validate: boolean().required(),
    },
    deepExample: {
      default: null,
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

- `[propName].validate` [func]: a function which is passed the value to check and should return `true` if it is valid.
- `[propName].default` [any]: a default value set to the property.

#### `config.actions`

- Type: `object`
- Required: `false`

The actions object is used for more complex state manipulation functions. However, you do not need to use this in order to use the store.

```js
const store = Store.create({
  actions: {
    // actions...
  },
});
```

Example:

```js
const store = Store.create({
  actions: {
    loginUser: ({ token, userId }) => ({
      token,
      userId,
      loggedIn: Boolean(token && userId),
    }),
  },
});

store.dispatch.loginUser({ token, userId });
```

Properties:

- `[actionName]` [func]: actions enable you to manipulate multiple store values in one method.

### Usage

#### `store.update`

- Type: `func`
- Returns: `void`

Make a partial update to the values of the store.

```js
import { string } from 'yup';

const store = Store.create({
  schema: {
    example: {
      default: '',
      validate: string(),
    },
    other: {
      // code...
    },
  },
})

store.update({
  example: 'Hello world!',
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
    doSomething: ({ name, isInFalador }) => ({
      questName: name,
      doingQuest: isInFalador,
    }),
  },
})

store.dispatch.doSomething({
  name: 'Hello world!',
  isInFalador: true,
});
```

Notice how the `doSomething` action is being set in `actions` and then is being dispatched later on in the code.

#### `store.watch`

- Type: `func`
- Returns: `unwatch`

Pass a listener function into this in order to get informative updates on changes in the store.

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

This property gives you access to the current values of the store.

```js
const authStore = Store.create(config);

const authRouter = Router.create({
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

The above code will only allow the use to access the home page when they are logged in.

#### `store.errors`

- Type: `object`

This property gives you access to any errors between the state and the validators.

```js
const userFormStore = Store.create(config);

const usersRouter = Router.create({
  routes: {
    home: {
      path: '/update',
      component: UserUpdateForm,
      leave: {
        before: () => !userFormStore.errors.length,
      },
    },
  },
});
```

The above code only allows users to leave when there are no errors in the store.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)