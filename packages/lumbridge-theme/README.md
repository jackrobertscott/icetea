# lumbridge-theme

> 🏰 Improved theme management for React apps.

## Installation

Using npm:

```shell
npm i --save lumbridge-theme
```

Using yarn:

```shell
yarn add lumbridge-theme
```

Then import the helper classes where needed.

```js
import { Theme } from 'lumbridge-theme';

const theme = Theme.create({
  // code...
});
```

## API

### Config

Each theme is configured with a `config` object:

```js
const theme = Theme.create(config);
```

This config object will contain all the information required by the theme.

#### `config.base`

Type: `object`

A group of base styles which will applied when this theme is used.

```js
const fonts = Theme.create({
  base: {
    // styles...
  },
});
```

Example:

```js
const fonts = Theme.create({
  base: {
    fontSize: '14px',
    lineHeight: '1.5em',
  },
});
```

Properties:

- `[cssProperty]` [string]: add multiple css properties which are in camelCase as opposed to kebab-case (which is what CSS uses).

#### `config.mutations`

Type: `object`

A set of mutations to the base CSS styles which are applied only when they are needed.

```js
const fonts = Theme.create({
  mutations: {
    // code...
  },
});
```

Example:

```js
const fonts = Theme.create({
  mutations: {
    primary: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    mono: {
      fontFamily: 'monospace',
    },
    active: {
      color: 'blue',
    },
  },
});
```

Properties:

- `[mutationName][cssProperty]` [string]: similar to the `base` property, name your mutations and then provide them CSS variables.

#### `config.actions`

Type: `object`

A set of methods which can take React element props and combine them with mutations to turn those mutations on and off.

```js
const fonts = Theme.create({
  actions: {
    // code...
  },
});
```

Example:

```js
const fonts = Theme.create({
  base: {
    color: 'black',
  },
  mutations: {
    mono: {
      fontFamily: 'monospace',
    },
    active: {
      color: 'blue',
    },
  },
  actions: {
    deactivate: ({ deactivate }) => ({
      active: !deactivate,
      mono: deactivate,
    }),
  },
});
```

Properties:

- `[actionName]` [func]: a function which recieves props as the first argument and should return a set of mutation names with boolean values relating to if those mutations should be on or off.

### Elements

To use our themes, we can **compose** them into a React element.

```js
const StyledComponent = Theme.compose(composeConfig);
```

Notice the difference between `Theme.create` and `Theme.compose` which both have seperate functions.

#### `composeConfig.as`

Type: `string` | `node`

This will be the type of node that will be used to apply the styles to.

```js
const StyledComponent = Theme.compose({
  as: 'div',
});
```

#### `composeConfig.theme`

Type: `array`

This is an array of the themes which will be used to compose the visuals of the component.

```js
const StyledComponent = Theme.compose({
  theme: [
    // themes...
  ],
});
```

Example:

```js
const StyledComponent = Theme.compose({
  theme: [
    paddings,
    fonts.add({
      mutations: {
        primary: config.compressed ? true : false,
      },
      actions: {
        deactivate: true,
      },
    }),
  ],
});
```

As you can see, the entries to the array can be just the theme itself (e.g. `paddings`) or it can specify the mutations and actions you wish to use from the theme (e.g. `fonts.add({})`).

**Note:** the `add` method accepts `mutations` and `actions` as properties. These properties should be objects which specify the mutation or action to use and a boolean value of wether to include them or not (see the example).

#### `composeConfig.extra`

Type: `object`

This is a group of CSS properties which are can be used to add extra styling to the component when the themes are not enough.

```js
const StyleComponent = Theme.compose({
  extra: {
    // css...
  },
});
```

Example:

```js
const StyleComponent = Theme.compose({
  extra: {
    backgroundColor: 'green',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
  },
});
```

Properties:

- `[cssProperty]` [string]: add multiple css properties which are in camelCase as opposed to kebab-case (which is what CSS uses).

### Usage

To use the themes, simply use the component that is created by the `Theme.compose` method in your normal React code.

```js
const Wrap = Theme.compose({
  as: 'div',
  theme: [
    fonts.add({
      actions: {
        deactivate: true,
      },
    }),
  ]
});

const HelloWorld = ({ isActive }) => (
  <Wrap deactivate={!isActive}>
    <span>Hello world!</span>
  <Wrap>
);
```

In the above example, the `deactivate` property which is set on the `Wrap` element can be used by any actions which were added to the theme.

#### `theme.Instance`

Type: `node`

You can quickly create an insance of a theme as a react element with the `theme.Instance` property.

```js
const HelloWorld = ({ isActive }) => (
  <div>
    <fonts.Instance
      mutations={{ mono: true }}
      actions={{ active: true }}
      deactivate={!isActive}
    >
      Hello world!
    </fonts.Instance>
  </div>
);
```

You can see the `mutations` and `actions` properties on the element should correspond to the properties in the `theme.add` method (as shown in above docs).

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)