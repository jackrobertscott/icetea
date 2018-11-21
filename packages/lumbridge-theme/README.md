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

## Examples

Problems being addressed:

- A group of styles is often used multiple times.
- Component reuse carries too many styles across, where as this would carry only the exact amount of styles across.
- Handles different property changes and how they relate to styles.

```js
/**
 * Define styles with a single property...
 */
const padding = Theme.create({
  defaults: { padding: '14px' },
  mutations: {
    tiny: { padding: '16px' },
    small: { padding: '16px' },
    medium: { padding: '16px' },
    big: { padding: '16px' }
  },
});

/**
 * Define styles with multiple properties...
 */
const font = Theme.create({
  defaults: {
    lineHeight: '1.15',
    fontFamily: 'inherit',
    fontSize: '100%',
    fontWeight: 'normal',
  },
  /**
   * We should initially start with these properties only as
   * strings. This is because it promotes good coding practice
   * by reducing complexity in the code and will cause less
   * confusion when coding.
   */
  mutations: {
    primary: {
      fontSize: '20px'
      fontWeight: 'bold',
    },
    mono: {
      fontFamily: 'monospace',
    },
    active: {
      color: 'blue',
    }
  },
  /**
   * Instead, use functions down here in this section which can
   * help set groups of styles on an item which can be
   * changed by it's properties.
   */
  actions: {
    active: style => ({ active }) => style.mutation({
      active,
      mono: !active,
    }),
  }
});

/**
 * Compile styles into a component on the page.
 */
const Wrap = Element.create({
  as: 'div',
  /**
   * TODO: these need thought, is this best way?
   * Using props instead of functions forces refactoring into the
   * actual style (which can be a good thing) but it might be bad?
   * Is it a bad thing? Maybe it's a great thing?
   */
  theme: [
    font,
    padding.mutation.big,
    font.action.active,
  ],
  style: {
    backgroundColor: 'green',
  },
});

/**
 * Use the styles in multiple different ways.
 */
const StyledComponent = ({ active }) => (
  <Wrap active={active}>
    <font.Element as="span" mutation="mono">
      Hello world!
    </font.Element>
  </Wrap>
);
```

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
- [lumbridge-theme](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-theme)