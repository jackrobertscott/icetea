# lumbridge

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Installation

Using npm:

```shell
npm i --save lumbridge
```

Using yarn:

```shell
yarn add lumbridge
```

Then import the helper classes where needed.

## Overview

[See main repository.](https://github.com/jackrobertscott/lumbridge)

This package exports all of the lumbridge helper classes.

### Router

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)

Example:

```js
import { Router } from 'lumbridge'; // or 'lumbridge-router'

const mainRouter = Router.create({
  change: {
    before: () => isUserLoggedIn(),
    after: () => recordRouteChange(),
  },
  nomatch: {
    redirect: '/',
  },
  routes: {
    home: {
      path: '/',
      component: Home,
    },
    about: {
      path: '/about',
      component: About,
    },
    faq: {
      path: '/dashboard',
      component: Dashboard,
      enter: {
        before: () => faqRouteGuard(),
      },
      leave: {
        before: () => saveData(),
      }
    },
  },
});
```

### Persistor

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)

Example:

```js
import { Persistor, Scope } from 'lumbridge'; // or 'lumbridge-persistor'

const localStoragePersistor = Persistor.create({
  methods: {
    store: {
      payload: {
        id: string().required(),
        data: object().required(),
      },
      handler: ({ id, data }) => {
        return new Promise((resolve, reject) => {
          try {
            const save = JSON.stringify(data);
            localStorage.setItem(id, save);
            resolve({ id, data });
          } catch (error) {
            reject(error);
          }
        });
      },
    },
    retrieve: {
      payload: {
        id: string().required(),
      },
      handler: ({ id }) => {
        return new Promise((resolve, reject) => {
          try {
            const encode = localStorage.getItem(id);
            const data = JSON.parse(encode);
            resolve({ id, data });
          } catch (error) {
            reject(error);
          }
        });
      },
    },
  },
});
```

### Store

[See detailed docs.](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)

Example:

```js
import { Store } from 'lumbridge'; // or 'lumbridge-store'

const authStore = Store.create({
  schema: {
    userId: {
      state: null,
      validate: string().nullable(),
    },
    token: {
      state: null,
      validate: string().nullable(),
    },
    loggedIn: {
      state: false,
      validate: boolean().required(),
    },
  },
  actions: {
    authenticate: ({ userId, token } = {}) => ({
      userId,
      token,
      loggedIn: Boolean(userId && token),
    }),
  },
});
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)