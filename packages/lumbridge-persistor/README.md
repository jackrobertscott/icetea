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

- Type: `object`
- Required: `true`

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

- Type: `func`
- Returns: `persistorAction`

Create a persistor action with more specific properties to the method being called.

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

**Note:** the callback provided is used to map the variables passed to the `meQueryAction.execute` function to the handler payload.

#### `persistorAction.execute`

- Type: `func`
- Returns: `void`

Execute the persistor action with parameters (which you specify).

```js
meQueryAction.execute({
  variables: { id },
});
```

**Note:** by seperating the functionality of *executing* an action and *receiving* that action's data, it enables you to more efficiently re-query the data without the code overhead. A good example would be when you wish to load a list of items that will change based upon a search filter. The list can be requeried easily while you only have to handle how that data is handled only once.

#### `persistorAction.watch`

- Type: `func`
- Returns: `unwatch`

Listen to any updates in the persistor as the persistor instance executes.

```js
const unwatch = meQueryAction.watch({
  done: data => setData(data),
  catch: error => setError(error),
  status: loading => setLoading(loading),
});

const componentWillUnmount = () => unwatch();
```

**Note:** the `watch` function will listen to any updates. However, to make sure that you don't have a memory leak, it's important to run the `unwatch` function when the listeners are no longer needed.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)
