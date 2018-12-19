# lumbridge-persistor

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Installation

Using [npm](https://www.npmjs.com/package/lumbridge-persistor):

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

#### `Persistor.create()`

Each persistor is configured with a `config` object:

```js
interface IPersistorConfig {
  // todo...
}

const config: IPersistorConfig = {
  // options...
};

const persistor = Persistor.create(config);
```

Example:

```js
const serverPersistor = Persistor.create()
  .action({
    name: 'query',
    handler: ({ query, variables }) => {
      return apollo.query({ query, variables })
        .then(({ data }) => data);
    },
  })
  .action({
    name: 'mutate',
    handler: ({ query, variables }) => {
      return apollo.mutate({ mutation: query, variables })
        .then(({ data }) => data);
    },
  });
```

**Note:** make sure your `handler` function returns a promise (e.g. `new Promise((resolve, reject) => resolve(data))`) or it will not work.

#### `persistor.instance()`

Create a persistor method with more specific properties to the method being called.

```js
interface IInstanceConfig {
  // todo...
}

const instanceConfig: IInstanceConfig = {
  name: 'query',
  map: ({ ...args }) => ({
    ...args,
    query: `
      query($id: String) {
        me(id: $id) { name }
      }
    `,
  })
}

const meQueryInstance = serverPersistor.instance(instanceConfig);
```

#### `persistorInstance.execute()`

Execute the persistor method with parameters (which you specify).

```js
meQueryInstance.execute({
  variables: { id },
});
```

**Note:** by seperating the functionality of *executing* an method and *receiving* that method's data, it enables you to more efficiently re-query the data without the code overhead. A good example would be when you wish to load a list of items that will change based upon a search filter. The list can be requeried easily while you only have to handle how that data is handled only once.

#### `persistorInstance.watch()`

Listen to any updates in the persistor as the persistor instance executes.

```js
interface IWatchEvents {
  // todo...
}

const events: IWatchEvents = {
  // options...
};

const unwatch = persistorInstance.watch(events);
```

Example:

```js
const unwatchData = meQueryInstance.watch({
  done: data => setData(data),
  status: ({ loading }) => setLoading(loading),
});

const unwatchErrors = meQueryInstance.watch({
  catch: error => setError(error),
});

const componentWillUnmount = () => {
  unwatchData();
  unwatchErrors();
};
```

**Note:** when you start watching a persistor method, don't forget to call the `unwatch` function when the component unmounts and you stop listening for changes (see above code). If you don't unwatch, then you might cause a memory leak.

### Scopes

It is often the case that a persistor will update application data in one location of the app, which may then lead to incorrect information shown in another location of the app.

For example, imagine being on a user settings page and changing a person's name. If the person's name is also shown in the top bar of the app, you will need to update this to the correct information after saving the person's name. Using a store can be a way of solving this problem.

However, sometimes knowing which data need to change is not clearly known. For example, imagine instead of showing a person's name in the top bar, it shows the number of videos a person has watched (on a video watching app). In this case, you can only "guess" the information if you use a store. A better way would be to requery the number of videos watched at the time that another query resolves and changes that.

For those use cases, we created the `Scope` data structure.

```js
import { Scope } from 'lumbridge-persistor';

interface IScopeConfig {
  // todo...
}

const config = {
  // code...
};

const scope = Scope.create(config);
```

Scopes are used to add extra functionality to persistors so that they can listen and react to changes in each other.

#### `scope.absorb()`

This will connect a persistor method to the scope. Connecting a persistor method will enable the scope to listen to the changes in all the connected methods.

```js
const persistor = Persistor.create({/* code... */});
const persistorFirstInstance = persistor.instance({ name: 'exampleQuery' });
const persistorSecondInstance = persistor.instance({ name: 'otherQuery' });

const scope = Scope.create({/* code... */});
scope.absorb(persistorFirstInstance);
scope.absorb(persistorSecondInstance, true);
```

#### `scope.watch()`

This will combine and watch all of the persistor methods. This can be useful when you want to listen to any errors which occur in your methods and respond to them all in the same way (such as by creating a toast message).

```js
interface IWatchEvents {
  // todo...
}

const events: IWatchEvents = {
  // options...
};

const unwatch = scope.watch(events);
```

Example:

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
