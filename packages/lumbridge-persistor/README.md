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

## Examples

Problems being addressed:

- Purely acts as an interface for asynchronous data requests.
- Not specific to a technology such as REST, GraphQL, LocalStorage, etc.
- Handles keeping different data in-sync across app nicely with scopes.
- Efficiently allows multiple instances to access the same data without overhead.

```js
import apolloClient from '../client'; // apollo client instance

const apolloPersistor = Persistor.create({
  /**
   * These are validations for the handler payload so that we
   * can find our potential errors before they happen.
   */
  validations: {
    query: Yup.string().isRequired,
    variables: Yup.object(),
  },
  /**
   * This handles the payload request.
   */
  handler: ({ done, catch }) => payload => {
    const { query, variables } = payload;
    return apolloClient.query({ query, variables })
      .then(({ data }) => data);
  },
});

/**
 * This will execute the handler and update the data.
 */
const meInstance = apolloPersistor.instance({
  map: ({ variables }) => {
    query: `
      query {
        me { name }
      }
    `,
    variables,
  },
  /**
   * SCOPES!
   *
   * Whenever a query is executed and has a scope, all the other
   * interfaces with the same scope will be REFRESHED. This keeps
   * our data nicely in sync across the app. :)
   */
  scopes: {
    user: true
  },
});

/**
 * Subscriptions to the data are seperately handled so that we don't
 * have to keep redefining this every time we want to update the
 * execution e.g. on a search with pings every 300ms.
 *
 * This also gives us the advantage of calling the watch function
 * from files which don't call the execute function (such as error
 * handling files).
 */
meInstance.watch(({ data, error, loading }) => {
  console.log(data, error, loading);
});

/**
 * BAD.
 *
 * Don't implement "seperate calls" as this will require memory leakage
 * if the unwatching calls are not correctly handled (which requires
 * a lot of code)...
 *
 * const unwatchData = meInstance.data(handleData);
 * const unwatchLoading = meInstance.loading(handleLoading);
 * const unwatchError = meInstance.catch(handleError);
 */

/**
 * Example usage in a component with lifecycle and unwatching.
 */
const MyProfile = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  /**
   * Notice the empty array at the end. This will only fire when
   * the component mounts and unmounts - not inbetween.
   */
  useEffect(() => {
    const unwatch = meInstance.watch(({ data, loading, error }) => {
        setData(data);
        setLoading(loading);
        setError(error);
      });
    return () => unwatch();
  }, []);

  /**
   * Notice that this effect will refresh the query on a new id.
   */
  useEffect(() => {
    meInstance.execute({
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

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)