# lumbridge-router

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

## API

### Config

Each router is configured with a `config` object:

```js
const router = Router.create(config);
```

This config object will contain all the information required by the router.

#### `config.routes`

Type: `object`

A collection of routes which may be rendered by the router relative to the app's url.

```js
const router = Router.create({
  routes: {
    // routes...
  },
});
```

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
        before: () => makeSureAllDataIsSaved(),
      },
    },
  },
});
```

Properties:

- `[routeName].path` [string]: the path which will be checked against the url.
- `[routeName].component` [node]: a React component which will be shown when this route is rendered.
- `[routeName].exact` [node]: specifies that this route must match exactly to the url.
- `[routeName].enter.before` [func]: handler called before the route is rendered. Returning false to this will stop the route rendering and is a good place to put route guards.
- `[routeName].enter.after` [func]: handler called after the route has been rendered.
- `[routeName].leave.before` [func]: handler called before the route is rendered. Returning false to this will stop the route from changing.
- `[routeName].leave.after` [func]: handler called after the route has been rendered.

Rules:

- Only one route will be shown at a time for a single router (but you may use multiple routers).
- The route with a `path` most similar to the actual route will be rendered.
- Routes with the `exact` key will be matched only when the location exactly matches the `path` key.
- Each route has a key (e.g. `config.routes.home`) which may be used to identify the route.
- You may return a `Promise` to any of the handlers and they will wait for the promise to resolve before continuing.

#### `config.change`

Type: `object`

A collection of handlers which will be called when the router renders a new route.

```js
const router = Router.create({
  change: {
    // handlers...
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
});
```

Properties:

- `change.before` [func]: handler called before the route changes. Returning false to this will prevent the route from changing.
- `change.after` [func]: handler called after rendering a route.

#### `config.nomatch`

Type: `object`

These values are used when *no* routes are matched by the routes.

```js
const router = Router.create({
  nomatch: {
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
});
```

Properties:

- `nomatch.redirect` [node]: the url which the app will redirect to when no route matches found.

### Usage

#### `router.Routes`

Type: `node` (React component)

A React component which is used to display the routes in the DOM.

```js
const router = Router.create({
  routes: {
    // code...
  },
});

const App = () => <router.Routes />
```

#### Nested Routes

The router does not provide functionality for nested routes. This has been done on *purpose* to avoid unneeded complexity. If you would like to use nested routes, simply create multiple route components and put the routes inside the rendered components.

Example:

```js
const nestedRoutes = Router.create({
  // routes...
});

const NestedComponent = () => (
  <InnerWrap>
    <nestedRoutes.Routes />
  </InnerWrap>
);

const parentRoutes = Router.create({
  routes: {
    nested: {
      path: '/cool',
      component: NestedComponent,
    },
  },
});

const App = () => (
  <OuterWrap>
    <parentRoutes.Routes />
  </OuterWrap>
);
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)
