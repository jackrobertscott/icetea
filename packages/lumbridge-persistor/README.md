# lumbridge-persistor

> 🏰 React application management made simple.

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

**Note:** when you start watching a persistor action, don't forget to call the `unwatch` function when the component unmounts and you stop listening for changes (see above code). If you don't unwatch, then you might cause a memory leak.

### Scopes

It is often the case that a persistor will update application data in one location of the app, which may then lead to incorrect information shown in another location of the app.

For example:

Imagine being on a user settings page and changing a person's name. If the person's name is also shown in the top bar of the app, you will need to update this to the correct information after saving the person's name.

Using a store can be a way of solving this problem.

However, sometimes knowing which data need to change is not clearly known. For example, imagine instead of showing a person's name in the top bar, it shows the number of videos a person has watched (on a video watching app). In this case, you can only "guess" the information if you use a store. A better way would be to requery the number of videos watched at the time that another query resolves and changes that.

For those use cases, we created the `Scope` data structure.

```js
import { Scope } from 'lumbridge-persistor';

const scope = Scope.create({});
```

Scopes are used to add extra functionality to persistors so that they can listen and react to changes in each other.

#### `scope.absorb`

- Type: `func`
- Returns: `void`

This will connect a persistor action to the scope. Connecting a persistor action will enable the scope to listen to the changes in all the connected actions.

```js
const persistor = Persistor.create({});
const persistorFirstAction = persistor.map.exampleQuery(() => {});
const persistorSecondAction = persistor.map.otherQuery(() => {});
const scope = Scope.create({});

scope.absorb(persistorFirstAction);
scope.absorb(persistorSecondAction, true);
```

Parameters:

- `arguments[0]` [persistorAction]: the persistor action to add to the scope.
- `arguments[1]` [boolean]: if this is `true` then the action will re-run the last execution after *any* of the other connected actions run successfully.

#### `scope.watch`

- Type: `func`
- Returns: `unwatch`

This will combine and watch all of the persistor actions. This can be useful when you want to listen to any errors which occur in your actions and respond to them all in the same way (such as by creating a toast message).

```js
const unwatch = scope.watch({
  catch: error => console.warn(error),
});
```

**Note:** when you start watching a scope, don't forget to call the `unwatch` function when you don't need it any more. If you don't unwatch, then you might cause a memory leak.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
