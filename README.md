# Lumbridge

> 🏰 Focused & simple helper objects which improve React application management.

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

Using yarn:

```shell
yarn add lumbridge
```

Import into a your app:

```js
import { Store } from 'lumbridge';

const authStore = Store.create({
  // code...
});
```

**Note:** the components will usually be created in their own files (e.g. `src/stores/authStore.js`) which can then be imported into a React component file.

## API

### Router

Structured and intuitive routing which allows you to easily create routes and manage the events related to those routes.

Considerations in design:

- Routing into a component can be aborted by checking data on a routes `enter` method.
- Prevent a user from routing away from a component (such as when a form has not been saved) with a route's `leave` method.
- Record and monitor all changes in the route location with the `change` method.
- Routes are smartly prioritised by showing only the route which was found be the closest to real path.
- Exact match routes are checked first and will have priority over non-exact routes.
- Each route has a key which you can use to generate a link which you may route to.

```js
import { Router } from 'lumbridge';
import { HomePage, LoginPage, SignUpPage } from '../components/pages';

/**
 * Define your routes in a regular JavaScript method.
 */
const authRouter = Router.create({
  routes: {
    home: {
      exact: true,
      path: ({ match: { path } }) => `${path}/`,
      component: HomePage,
    },
    login: {
      path: ({ match: { path } }) => `${path}/login`,
      component: LoginForm,
      enter: {
        before: () => userIsNotLoggedIn(),
      },
      leave: {
        before: () => saveDataBeforeLeaving(),
      },
    },
    signUp: {
      alias: ['hello', 'yellow'],
      path: ({ match }) => `${match}/sign-up`,
      component: SignUpPage,
      enter: {
        before: () => userIsNotLoggedIn(),
      },
    },
  },
  change: {
    after: ({ match: { path } }) => {
      recordRouteForAnalytics(path);
    },
  },
});
```

- The routes can be easily inserted into a regular app component.
- Nesting components are not supported on purpose. Instead, we encourage you to make multiple router instances and nest them in your normal components.

```js
import authRouter from '../routers/authRouter';

/**
 * Add the routes into your React component like a regular component.
 */
const App = () => (
  <Dashboard>
    <authRouter.Routes />
  </Dashboard>
);
```

### Persistor

Easily communicate and interact with persistant data stores such as `localStorage`, GraphQL Servers, REST Servers, etc.

Considerations in design:

- Built to be flexible so you can use interface with multiple kinds of data stores.
- Seperates the data *requests* from the data *retrieval* so you can access the data in multiple locations.
- Data *scopes* allow multiple requests to depend on each other and update efficiently with minimal overhead.
- Easily integrate the data persistors into existing apps.

```js
import { Persistor } from 'lumbridge';
import { string, object } from 'yup';
import apolloClient from '../client';

/**
 * Create a persistor which will be the interface with the data source.
 */
const apolloPersistor = Persistor.create({
  validations: {
    query: string().required().isValid,
    variables: object().isValid,
  },
  handler: () => ({ query, variables }) => {
    return apolloClient.query({ query, variables })
      .then(({ data }) => data);
  },
});
```

Create instances of the persistor which you can listen to in your components.

```js
import React from 'react';
import { apolloPersistor } from '../persistors/apolloPersistor';

/**
 * Create an instance from the persistor, this will contain the common
 * request information (such as a GraphQL query).
 */
const meInstance = apolloPersistor.instance({
  map: () => ({
    query: `
      query($id: String) {
        me(id: $id) { name }
      }
    `,
  }),
  scopes: {
    user: true
  },
});

/**
 * Here is how you can use the instance in a React component using hooks.
 */
const MyProfile = ({ id }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  /**
   * Notice the empty array at the end. This will only fire when
   * the component mounts and unmounts - not inbetween.
   */
  useEffect(() => {
    const unwatch = meInstance.watch(({ data, loading, error }) => {
        setError(error);
        setLoading(loading);
        setData(data);
      });
    return () => unwatch();
  }, []);

  /**
   * Notice that this effect will refresh the query on a new id.
   */
  useEffect(() => {
    meInstance.execute({
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

### Store

Considerations in design:

- Access data in multiple locations throughout app without passing data through components.
- Provides data validation to help avoid errors.
- Is effective at managing form data.
- Updates state using `store.update({})` which is similar to how `this.setState({})` works, only partially updating the store.
- Reset the store by using `store.reset()` which will set the stores values back to their defaults.

```js
import { Store } from 'lumbridge';
import { string, boolean, object } from 'yup';

/**
 * Create a data source which can be accessed from anywhere in the app.
 */
const authStore = Store.create({
	schema: {
		token: {
      validate: string().isValid,
      default: null,
    },
		userId: {
      validate: string().isValid,
      default: null,
    },
		loggedIn: {
      validate: boolean().required().isValid,
      default: false,
    },
    big: {
      validate: object({
        one: string().required(),
        two: string().required(),
      }).isValid,
      default: null,
    },
	},
	actions: {
		updateUserId: store => ({ userId }) => {
      store.update({
        userId,
        loggedIn: !!userId,
      });
    },
	}
});

/**
 * Quickly reset the store when you need to (such as logging out a user).
 */
const logoutUser = () => authStore.reset();
```

### Theme

Considerations in design:

- Arrange your styles in groups of functional properties and use those groups to compose component styles.
- Write your styles as JavaScript objects which makes code reuse and refactoring simple.
- Default CSS is removed from all HTML elements so that you don't have to undo styles all the time.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)
