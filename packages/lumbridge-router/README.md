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
```

**Note:** the `lumbridge` parent package contains [`lumbridge-router`, `lumbridge-store`, `lumbridge-persistor`].

## Usage

Configure the router with React components.

```js
import { Router } from 'lumbridge';
import { HomePage, LoginPage, SignUpPage } from '../components/pages';

export const authRouter = Router.create({
    enter: {
      before: () => authState.state.isLoggedIn,
    }
  })
  .route({
    path: '/',
    exact: true,
    component: HomePage,
  })
  .route({
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
    path: '/sign-up',
    component: SignUpPage,
    enter: {
      before: () => userIsNotLoggedIn(),
    },
  });
```

Compile the router and use in your app.

```jsx
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

## API

### Router

#### `const router = Router.create()`

Each router is configured with a `config` object.

```ts
const config: IRouterConfig = {
  change: {
    before: () => ensureUserAuthenticated(),
    after: () => recordPageChange(),
  },
  nomatch: {
    redirect: '/not-found',
  },
};

const router = Router.create(config);
```

Type definitions.

```ts
export interface IRouterConfig {
  base?: string;
  change?: IEvents;
  nomatch?: INomatch;
  routes?: IRoute[];
}
```

#### `router.route()`

Add a route to the router.

```ts
const routeOptions: IRoute = {
  path: '/settings',
  component: SettingsComponent,
};

const router = Router.create()
  .route(routeOptions);
```

Type definitions.

```ts
export interface IRoute {
  path: string;
  component: any;
  name?: string;
  sensitive?: boolean;
  strict?: boolean;
  exact?: boolean;
  start?: boolean;
  enter?: IEvents;
  leave?: IEvents;
}

export interface IEvents {
  before?: (options: IEventOptions) => boolean | void;
  after?: (options: IEventOptions) => void;
}

export interface IEventOptions {
  location: ILocation;
}
```

#### `router.compile()`

A React component which is used to display the routes in the DOM.

```js
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

#### `Router.Link`

A React component which let's you link to your routes.

```js
import { Router } from 'lumbridge';

const Menu = () => (
  <Wrap>
    <Router.Link to="/" contents="Home" />
    <Router.Link to="/faq" contents="FAQ" />
    <Router.Link to="/about" contents="About" />
  </Wrap>
);
```

### Nested Routes

The router does not provide functionality for nested routes.

> Hang on... why do this?

We made this decision on *purpose* to avoid unnecessary complexity. If you would like to use nested routes, simply create multiple route components and put those routes inside the components rendered by other routers.

```js
const ChildRoutes = Router.create()
  .route({
    path: '/main/nested',
    component: NestedComponent,
  })
  .compile();

const NestedComponent = () => (
  <InnerWrap>
    <ChildRoutes />
  </InnerWrap>
);

const ParentRoutes = Router.create()
  .route({
    path: '/main',
    component: NestedComponent,
  })
  .compile();

const App = () => (
  <OuterWrap>
    <ParentRoutes />
  </OuterWrap>
);
```

## Troubleshooting

- Only one route will be shown at a time for a single router - but you may use multiple routers.
- The route with a `path` most similar to the actual route will be rendered.
- Routes with the `exact` key will be matched only when the location exactly matches the `path` key.
- Each route has a key (e.g. `config.routes.home`) which may be used to identify the route.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
