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

Each route shown by the router will be stored in this object.

```js
const router = Router.create({
  routes: {
    // routes...
  },
});
```

Rules:

- Only one route will be shown at a time for a single router (but you may use multiple routers).
- The route with a `path` most similar to the actual route will be rendered.
- Routes with the `exact` key will be matched only when the location exactly matches the `path` key.
- Each route has a key (e.g. `config.routes.home`) which may be used to identify the route.
- You may return a `Promise` to any of the handlers and they will wait for the promise to resolve before continuing.

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

Route config:

- `[routeName].path` [string]: the path which will be checked against the url.
- `[routeName].component` [node]: a React component which will be shown when this route is rendered.
- `[routeName].exact` [node]: specifies that this route must match exactly to the url.
- `[routeName].enter.before` [func]: handler called before the route is rendered. Returning false to this will stop the route rendering and is a good place to put route guards.
- `[routeName].enter.after` [func]: handler called after the route has been rendered.
- `[routeName].leave.before` [func]: handler called before the route is rendered. Returning false to this will stop the route from changing.
- `[routeName].leave.after` [func]: handler called after the route has been rendered.

#### `config.change`

Type: `object`

```js
const router = Router.create({
  change: {
    // handlers...
  },
});
```

This is a collection of handlers which will be called when the router changes any of it's routes.

```js
const router = Router.create({
  change: {
    before: () => console.log('The route is about to change.'),
    after: () => console.log('The route has changed.'),
  },
});
```

Change config:

- `change.before` [func]: handler called before the route changes. Returning false to this will prevent the route from changing.
- `change.after` [func]: handler called after rendering a route.

### Components

#### `router.Routes`

Type: `node` (React component)

```
const faladorRouter = Router.create(config);

const FaladorRoutes = () => <faladorRouter.Routes />
```

This component can be inserted into regular React code like normal.

#### Nested Routes

The router does not provide functionality for nested routes. This has been done on *purpose* to avoid unneeded complexity. If you would like to use nested routes, simply create multiple route components and put the routes inside the rendered components.

Basic nested routes example:

```
const nestedRoutes = Router.create(config);

const NestedComponent = () => (
  <InnerWrap>
    <nestedRoutes.Routes />
  </InnerWrap>
);

const parentRoutes = Router.create({
  routes: {
    nest: {
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
