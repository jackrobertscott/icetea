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
import { Persistor, Scope } from 'lumbridge-persistor';
```

**Note:** the `lumbridge` parent package contains [`lumbridge-router`, `lumbridge-store`, `lumbridge-persistor`].

## Usage

Configure a persistor by creating a interface with a data source.

```js
import { Persistor } from 'lumbridge';
import apollo from '../client';

const apolloPersistor = Persistor.create()
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

Create instances which will preserve and listen to data from the data source.

```jsx
import React from 'react';
import { apolloPersistor } from '../persistors/apolloPersistor';

export const meQueryInstance = apolloPersistor.instance({
  action: 'query',
  common: () => ({
    query: `
      query($id: String) {
        me(id: $id) { name }
      }
    `,
  }),
});

const MyProfile = ({ id }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  /**
   * By passing everything in via an object, you get the following benefits:
   * 1. Unsubscribe from all functions on unwatch (avoid memory leaks)
   * 2. Get to pick and choose which functions to use where.
   * 3. Only fire run on mounting and unmounting of component.
   */
  useEffect(() => {
    const unwatch = meQueryInstance.watch({
      data: data => setData(data),
      catch: error => setError(error),
      status: loading => setLoading(loading),
    });
    return () => unwatch();
  }, []);
  /**
   * Executions are seperated from results so that it's
   * easy to refresh without extra code.
   */
  useEffect(() => {
    meQueryInstance.execute({
      variables: { id },
    });
  }, [id]);
  return (
    <div>
      {data.me.name}
      {error && error.message}
      {loading}
    </div>
  );
};
```

## API

### Persistor

#### `const persistor = Persistor.create()`

Create a new persistor to begin making requests.

```ts
const persistor = Persistor.create();
```

#### `persistor.action()`

Make a new persistor which includes this action.

```ts
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

**Note:** your `handler` function may return a normal value or a promise e.g. `new Promise((resolve, reject) => resolve(data))`.

#### `const instance = persistor.instance()`

Create a persistor method with more specific properties to the method being called.

```ts
const meQueryInstance = serverPersistor.instance({
  action: 'query',
  common: () => ({
    query: `
      query($id: String) {
        me(id: $id) { name }
      }
    `,
  })
});
```

**Note:** the `common` property allows you to specify common data sent along with the request and will usually contain a specific endpoint or query.

### Instance

#### `instance.execute()`

Execute the persistor method with parameters - which you specify.

```js
meQueryInstance.execute({
  variables: { id },
});
```

**Note:** by seperating the functionality of *executing* an method and *receiving* that method's data, it enables you to more efficiently re-query the data without the code overhead. A good example would be when you wish to load a list of items that will change based upon a search filter. The list can be requeried easily while you only have to handle how that data is handled only once.

#### `instance.watch()`

Listen to any updates in the persistor as the persistor instance executes.

```ts
const unwatch = exampleInstance.watch({
  data: data => setData(data),
  catch: error => setError(error),
  status: ({ loading }) => setLoading(loading),
});
```

Here is an example with a React hook.

```jsx
export function LoadUserData() {
  const [me, setMe] = useState(null);
  useEffect(() => {
    const unwatch = meQueryInstance.watch({
      data: data => setMe(data || null);
    });
    return () => unwatch();
  }, []);
  if (!me) {
    return <div>Loading...</div>;
  }
  return (
    <div>{me.name}</div>
  );
}
```

**Note:** when you start watching a persistor method, don't forget to call the `unwatch` function when the component unmounts and you stop listening for changes (see above code). If you don't unwatch, then you might cause a memory leak.

### Scopes

It is often the case that a persistor will update application data in one location of the app, which may then lead to incorrect information shown in another location of the app.

For example, imagine being on a user settings page and changing a person's name. If the person's name is also shown in the top bar of the app, you will need to update this to the correct information after saving the person's name. Using a store can be a way of solving this problem.

However, sometimes knowing which data need to change is not clearly known. For example, imagine instead of showing a person's name in the top bar, it shows the number of videos a person has watched (on a video watching app). In this case, you can only "guess" the information if you use a store. A better way would be to requery the number of videos watched at the time that another query resolves and changes that.

For those use cases, we created the `Scope` data structure.

#### `const scope = Scope.create()`

Create a scope to add extra functionality to persistors so that they can listen and react to changes in each other.

```js
const scope = Scope.create();
```

#### `scope.absorb()`

This will connect a persistor method to the scope. Connecting a persistor method will enable the scope to listen to the changes in all the connected methods.

```js
const examplePersistor = Persistor.create();
const firstInstance = examplePersistor.instance({ action: 'exampleQuery' });
const secondInstance = examplePersistor.instance({ action: 'otherQuery' });

const scope = Scope.create();
  .absorb(firstInstance);
  .absorb(secondInstance);
```

#### `scope.watch()`

This will combine and watch all of the persistor methods. This can be useful when you want to listen to any errors which occur in your methods and respond to them all in the same way (such as by creating a toast message).

```ts
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
