# lumbridge

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Main Features

- [`Router`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router): Simplified routing with built in route guards and hooks.
- [`Persistor`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor): Interact with data storage clients with ease.
- [`Store`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store): Quick to setup, modular local state management.

## Installation

Using npm:

```shell
npm i --save lumbridge
```

Using yarn:

```shell
yarn add lumbridge
```

Import into a your app:

```js
import { Store, Persistor, Router } from 'lumbridge';

const authStore = Store.create({
  // code...
});
```

**Note:** lumbridge components require *no additional setup* to start using in an existing React app.

## Router

Structured and intuitive routing which allows you to easily create routes and manage the events related to those routes.

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)

Considerations in design:

- **Avoid complexity** by creating your routes using our simple JavaScript object configuration.
- **Route enter guards** enable you to prevent a person accessing a route.
- **Route leave guards** prevent a user from routing away from a component before the app is ready - such as when a form has not been saved.
- **Hooks** allow you to monitor all changes in the route location.
- **Smart route prioritization** makes sure the route which matches closest to the path is the route which is rendered.
- **Nested routes** are easily created by embedding a router in a child component.

Example:

```js
import { Router } from 'lumbridge';
import { HomePage, LoginPage, SignUpPage } from '../components/pages';

export const authRouter = Router.create({
    enter: {
      before: () => authState.state.isLoggedIn,
    }
  })
  .route({
    name: 'home',
    path: '/',
    exact: true,
    component: HomePage,
  })
  .route({
    name: 'login',
    path: '/login',
    component: LoginForm,
    enter: {
      before: () => userIsNotLoggedIn(),
    },
    leave: {
      before: () => saveDataBeforeLeaving(),
    },
  })
  .route({
    name: 'signUp',
    path: '/sign-up',
    component: SignUpPage,
    enter: {
      before: () => userIsNotLoggedIn(),
    },
  });
```

Usage:

```js
import { Router } from 'lumbridge';
import authRouter from '../routers/authRouter';

const DashboardRoutes = authRouter.compile();

const App = () => (
  <Dashboard>
    <Menu>
      <Router.Link to="/" contents="Home" />
      <Router.Link to="/faq" contents="FAQ" />
      <Router.Link to="/about" contents="About" />
    </Menu>
    <DashboardRoutes />
  </Dashboard>
);
```

## Persistor

Easily interact with persistant data stores such as `localStorage`, GraphQL Servers, REST Servers, etc.

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)

Considerations in design:

- **Built to be flexible** so you can interface with any kind of data store.
- **Seperates concerns** so that data *requests* are made seperately to how that data is *displayed*.
- **Scopes** allow you to listen to multiple data requests with a the same callbacks - reducing a lot of code overhead.

Example:

```js
import { Persistor } from 'lumbridge';
import apollo from '../client';

const apolloPersistor = Persistor.create()
  .action({
    name: 'query',
    handler: ({ query, variables }) => {
      return apollo.query({ query, variables })
        .then(({ data }) => data);
    },
  })
  .action({
    name: 'mutate',
    handler: ({ query, variables }) => {
      return apollo.mutate({ mutation: query, variables })
        .then(({ data }) => data);
    },
  });
```

Usage:

```js
import React from 'react';
import { apolloPersistor } from '../persistors/apolloPersistor';

/**
 * Create an instance from the persistor, this will contain the common
 * request information - such as a graphQL query.
 */
export const meQueryInstance = apolloPersistor.instance({
  action: 'query',
  common: () => ({
    query: `
      query($id: String) {
        me(id: $id) { name }
      }
    `,
  }),
});

/**
 * Here is how you can use the instance in a React component using hooks.
 */
const MyProfile = ({ id }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  /**
   * By passing everything in via an object, you get the following benefits:
   * 1. Unsubscribe from all functions on unwatch (avoid memory leaks)
   * 2. Get to pick and choose which functions to use where.
   * 3. Only fire run on mounting and unmounting of component.
   */
  useEffect(() => {
    const unwatch = meQueryInstance.watch({
      data: data => setData(data),
      catch: error => setError(error),
      status: loading => setLoading(loading),
    });
    return () => unwatch();
  }, []);

  /**
   * Executions are seperated from results so that it's
   * easy to refresh without extra code. This will fire when
   * the "id" changes.
   */
  useEffect(() => {
    meQueryInstance.execute({
      variables: { id },
    });
  }, [id]);

  return (
    <div>
      {data.me.name}
      {error && error.message}
      {loading}
    </div>
  );
};
```

## Store

Share and validate data in multiple places around an app.

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)

Considerations in design:

- Access data in multiple locations throughout app without passing data through components.
- Get awesome data validation by using [Yup](https://www.npmjs.com/package/yup) the third party validation library.
- Is effective at managing form data.
- Updates state using `store.update({})` which is similar to how `this.setState({})` works, only partially updating the store.
- Reset the store by using `store.reset()` which will set the stores values back to their state.

Example:

```js
import { Store } from 'lumbridge';
import * as Yup from 'yup';

const schema = {
  token: {
    state: null,
  },
  userId: {
    state: null,
    validate: Yup.string(),
  },
  loggedIn: {
    state: false,
    validate: Yup.boolean().required(),
  },
  big: {
    state: null,
    validate: Yup.object({
      one: Yup.string().required(),
      two: Yup.string().required(),
    }),
  },
  count: {
    state: 0,
    validate: Yup.number().required(),
  },
};

const authStore = Store.create({ schema })
  .action({
    name: 'increment',
    execute: ({ state, data }) => ({
      count: state.count += data,
    }),
  });
```

Usage:

```js
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

You can also use stores with routes:

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

You can also handle forms with stores:

```js
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

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)