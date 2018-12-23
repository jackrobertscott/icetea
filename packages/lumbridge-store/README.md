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
```

**Note:** the `lumbridge` parent package contains [`lumbridge-router`, `lumbridge-store`, `lumbridge-persistor`].

## Usage

Create the store and configure it's shape.

```js
import { Store } from 'lumbridge';
import * as Yup from 'yup';

const authStore = Store.create()
  .assign({
    name: 'token',
    default: null,
  })
  .assign({
    name: 'userId',
    default: null,
    validate: Yup.string(),
  })
  .assign({
    name: 'loggedIn',
    default: false,
    validate: Yup.boolean().required(),
  })
  .assign({
    name: 'count',
    default: 0,
    validate: Yup.number().required(),
  })
  .action({
    name: 'increment',
    execute: ({ state, data }) => ({
      count: state.count += data,
    }),
  });
```

Include the store in regular React code like normal.

```jsx
import React from 'react';
import { authStore } from '../stores/authStore';

const HeaderBar = () => (
  <Menu>
    <Item onClick={() => authStore.dispatch.increment(1)}>
      Count
    </Item>
  </Menu>
);
```

Use stores in combination with routes such as detecting authentication states.

```js
import { Router } from 'lumbridge';
import { authStore } from '../stores/authStore';

const authRouter = Router.create()
  .route({
    name: 'home',
    path: '/',
    exact: true,
    component: HomePage,
    enter: {
      before: () => authStore.state.loggedIn,
    },
  });
```

Forms can even be improved by stores.

```jsx
import React from 'react';
import { authStore } from '../stores/authStore';
import FieldError from '../components/FieldError';

/**
 * Here is the same form but using React hooks.
 */
const LoginFormHooks = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({});
  useEffect(() => {
    const unwatch = authStore.watch({
      state: state => setState(state),
      errors: errors => setErrors(errors),
    });
    return () => unwatch();
  }, []); // fire only on mount and unmount (empty array)
  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={event => authStore.update({ username: event.target.value })}
        />
        {errors.username && <div>{errors.username}</div>}
      </div>
    </form>
  );
};
```

## API

### Store

#### `const store = Store.create()`

Create a new store to begin storing values.

```js
const store = Store.create();
```

#### `store.assign()`

Assign a property on the store.

```ts
store.assign({
  name: 'fullName',
  default: null,
  validate: Yup.string(),
});
```

**Note:** the above example uses the validation library [Yup](https://www.npmjs.com/package/yup) to make thinds easier but you can use any validation function.

#### `store.update()`

Make a *partial* update to the values of the store.

```js
const store = Store.create()
  .assign({
    name: 'fullName',
    default: null,
    validate: Yup.string().nullable(),
  }),
  .assign({
    name: 'isMember',
    default: false,
    validate: Yup.boolean().required(),
  });

store.update({ fullName: 'Jack Scott' });
```

**Note:** when `store.update` is called, a new object is created by combining the old values with the new values passed into the update function. This is similar to how `this.setState()` works in React components.

#### `store.action()`

Create optional actions for more complex state manipulations.

```js
const store = Store.create()
  .action({
    name: 'hugeIncrement',
    handler: ({ state, data }) => {
      return {
        count: state.count + (data.amount * 100),
      };
    },
  })
  .action({
    name: 'loginUser',
    handler: ({ data }) => {
      const { token, userId } = data || {};
      return {
        token,
        userId,
        loggedIn: Boolean(token && userId),
      };
    },
  });

store.dispatch.loginUser({ token, userId });
```

#### `store.dispatch[actionName]()`

To use our store actions; we dispatch them.

```js
const store = Store.create()
  .action({
    name: 'startQuest',
    handler: ({ name, inFalador }) => ({
      questName: inFalador ? `${name} is in Falador!` : `${name} is *not* in Falador!`,
      doingQuest: true,
    }),
  });

store.dispatch.startQuest({
  name: 'Jack Scott',
  inFalador: true,
});
```

Notice how the `startQuest` action is being set in `actions` and then is being *dispatched* by the `store` later in the code.

#### `store.watch()`

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

This property gives you access to the internal store values.

```ts
const authStore = Store.create();
```

```ts
const mainRouter = Router.create()
  .route({
    path: '/',
    exact: true,
    component: HomePage,
    enter: {
      before: () => authStore.state.loggedIn,
    },
  });
```

The above code ([using the lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)) will only allow the use to access the home page when they are logged in.

#### `store.errors`

This property gives you access to errors between the state and the validators.

```js
const userStore = Store.create(config);

const usersRouter = Router.create()
  .route({
    path: '/update',
    component: UserUpdateForm,
    leave: {
      before: () => Object.keys(userStore.errors).length === 0,
    },
  });
```

The above code only allows users to leave when there are no errors in the store.

#### `store.reset()`

This will reset the store to the default schema.

```js
const logout = () => exampleStore.reset();
```

**Note:** this does *not* unsubscribe from any of the watch functions.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)