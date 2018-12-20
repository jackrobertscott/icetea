# lumbridge-router

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Installation

Using [npm](https://www.npmjs.com/package/lumbridge-router):

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

## API

### Router

#### `Router.create()`

Each router is configured with a `config` object.

```js
interface IRouterConfig {
  // todo...
}

const config: IRouterConfig = {
  // options...
};

const router = Router.create(config);
```

This config object will contain all the information required by the router.

Example:

```js
const router = Router.create({
  routes: {
    home: {
      path: '/',
      exact: true,
      component: HomePage,
    },
    dashboard: {
      path: '/dashboard'
      component: Dashboard,
      enter: {
        before: () => userIsLoggedIn(),
      },
      leave: {
        after: () => sendGoodbyeMessage(),
      },
    },
  },
});
```

Properties:

- `routes[routeName].path` [string]: the path which will be checked against the url.
- `routes[routeName].component` [node]: a React component which will be shown when this route is rendered.
- `routes[routeName].exact` [node]: specifies that this route must match exactly to the url.
- `routes[routeName].enter.before` [func]: handler called before the route is rendered. Returning false to this will stop the route rendering and is a good place to put route guards.
- `routes[routeName].enter.after` [func]: handler called after the route has been rendered.
- `routes[routeName].leave.before` [func]: handler called before the route is rendered. Returning false to this will stop the route from changing.
- `routes[routeName].leave.after` [func]: handler called after the route has been rendered.

Troubleshooting:

- Only one route will be shown at a time for a single router (but you may use multiple routers).
- The route with a `path` most similar to the actual route will be rendered.
- Routes with the `exact` key will be matched only when the location exactly matches the `path` key.
- Each route has a key (e.g. `config.routes.home`) which may be used to identify the route.

#### `config.change`

- Type: `object`
- Required: `false`

A collection of handlers which will be called when the router renders a new route.

```js
const router = Router.create({
  change: {
    // handlers...
  },
  routes: {
    // code...
  },
});
```

Example:

```js
const router = Router.create({
  change: {
    before: () => console.log('The route is about to change.'),
    after: () => console.log('The route has changed.'),
  },
  routes: {
    // code...
  },
});
```

Properties:

- `change.before` [func]: handler called before the route changes. Returning false to this will prevent the route from changing.
- `change.after` [func]: handler called after rendering a route.

#### `config.nomatch`

- Type: `object`
- Required: `false`

These values are used when *no* routes are matched by the routes.

```js
const router = Router.create({
  nomatch: {
    // redirect...
  },
  routes: {
    // code...
  },
});
```

Example:

```js
const router = Router.create({
  nomatch: {
    redirect: '/not-found',
  },
  routes: {
    // code...
  },
});
```

Properties:

- `nomatch.redirect` [node]: the url which the app will redirect to when no route matches found.

### Usage

#### `router.compile`

- Type: `node` (React component)

A React component which is used to display the routes in the DOM.

```js
const router = Router.create({
  routes: {
    // code...
  },
});

const Routes = router.compile();

const App = () => (
  <div>
    <h1>My Cool App</h1>
    <div>
      <Routes />
    </div>
  </div>
);
```

#### `Link`

- Type: `node` (React component)

A React component which let's you link to your routes.

```js
import { Link } from 'lumbridge'; // or 'lumbridge-router'

const Menu = () => (
  <Wrap>
    <Link to="/">Home</Link>
    <Link to="/faq">FAQ</Link>
    <Link to="/about">About</Link>
  </Wrap>
);
```

### Nested Routes

The router does not provide functionality for nested routes.

> ✋ Hold up! How could this be?...

We made this decision on *purpose* to avoid unnecessary complexity. If you would like to use nested routes, simply create multiple route components and put those routes inside the components rendered by other routers.

Example:

```js
const ChildRoutes = Router.create({
  routes: {
    nested: {
      path: '/main/nested',
      component: NestedComponent,
    },
  },
}).compile();

const NestedComponent = () => (
  <InnerWrap>
    <ChildRoutes />
  </InnerWrap>
);

const ParentRoutes = Router.create({
  routes: {
    nested: {
      path: '/main',
      component: NestedComponent,
    },
  },
}).compile();

const App = () => (
  <OuterWrap>
    <ParentRoutes />
  </OuterWrap>
);
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
