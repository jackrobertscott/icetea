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

Structured and intuitive routing which allows you to easily create routes and manage the events related to those routes.

Considerations in design:

- Routing into a component can be aborted by checking data on a routes `enter` method.
- Prevent a user from routing away from a component (such as when a form has not been saved) with a route's `leave` method.
- Record and monitor all changes in the route location with the `change` method.
- Routes are smartly prioritised by showing only the route which was found be the closest to real path.
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
import apolloClient from '../client';

/**
 * Create a persistor which will be the interface with the data source.
 */
const apolloPersistor = Persistor.create({
	validations: {
		query: Yup.string().isRequired,
		variables: Yup.object(),
	},
	handler: () => ({ query, variables }) => {
		return apolloClient.query({ query, variables })
			.then(({ data }) => data);
	},
});

/**
 * Create an instance from the persistor, this will contain the common request information (such as a GraphQL query).
 */
const meInstance = apolloPersistor.instance({
	map: () => ({
		query: 'me { name }',
	}),
	scopes: {
		user: true
	},
});

/**
 * Execute the query and then watch for the response.
 */
const unwatch = meInstance.execute()
  .watch(({ data, error, loading }) => {
    console.log(data, error, loading);
  });
  
/**
 * Stop watching the data for new information.
 */
unwatch();
```

### Store

Considerations in design:

- Provide a simple way to pass local data through an app.
- Validate the local data as it comes in and provide clean and helpful data validation errors.
- Use as a clean alternative to managing form information.

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
