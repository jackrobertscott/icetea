# lumbridge-persistor

> 🏰 Improved persistant data management for React apps.

## Installation

Using npm:

```shell
npm i --save lumbridge-persistor
```

Using yarn:

```shell
yarn add lumbridge-persistor
```

Then import the helper classes where needed.

```js
import { Persistor } from 'lumbridge-persistor';

const persistor = Persistor.create({
  // code...
});
```

## API

### Config

Each persistor is configured with a `config` object:

```js
const persistor = Persistor.create(config);
```

This config object will contain all the information required by the persistor.

#### `config.actions`

Type: `object`

A set of methods which provide an common interface for interacting with a data source.

```js
const serverPersistor = Persistor.create({
  actions: {
    // code...
  },
});
```

Example:

```js
const serverPersistor = Persistor.create({
  actions: {
    query: {
      payload: {
        query: string().required(),
        variables: object(),
      },
      handler: ({ query, variables }) => {
        return graphQLClient.query({ query, variables })
          .then(({ data }) => data);
      },
    },
    mutate: {
      payload: {
        query: string().required(),
        variables: object(),
      },
      handler: ({ query, variables }) => {
        return graphQLClient.mutate({ mutation: query, variables })
          .then(({ data }) => data);
      },
    },
  },
});
```

Properties:

- `[actionName].payload` [object]: a set of validations used to check that the payload is the correct shape and type.
- `[actionName].handler` [func]: the executed function which handles

#### `persistor.map[actionName]`

Type: `func`

Create a persistor instance with more specific properties to the method being called.

```js
const serverPersistor = Persistor.create(config);

const meQueryAction = serverPersistor.map.query(({ variables }) => ({
  query: `
    query($id: String) {
      me(id: $id) { name }
    }
  `,
  variables,
}));
```

#### `persistorInstance.execute`

Type: `func`

Get the action to execute (with optionally passed in variables).

```js
meQueryAction.execute({
  variables: { id },
});
```

#### `persistorInstance.watch`

Type: `func`

Listen to any updates in the persistor as the persistor instance executes.

```js
const unwatch = meQueryAction.watch({
  done: data => setData(data),
  catch: error => setError(error),
  status: loading => setLoading(loading),
});

const componentWillUnmount = () => unwatch();
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)