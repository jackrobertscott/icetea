# Lumbridge

> 🏰 React application management made simple.

[![npm](https://img.shields.io/npm/v/lumbridge.svg)](https://www.npmjs.com/package/lumbridge) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![react](https://img.shields.io/badge/framework-react-blue.svg)](https://github.com/facebook/react)

## Main Features

- [`Router`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router): Simplified routing with built in route guards and hooks.
- [`Persistor`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor): Interact with data storage clients with ease.
- [`Store`](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store): Quick to setup, modular local state management.

## Usage

Using [npm](https://www.npmjs.com/package/lumbridge):

```shell
npm i --save lumbridge
```

Using yarn:

```shell
yarn add lumbridge
```

Import into a your app:

```js
import { Store, Persistor, Router } from 'lumbridge';
```

**Note:** the `lumbridge` parent package contains [`lumbridge-router`, `lumbridge-store`, `lumbridge-persistor`].

> 🚩 [**Get started now.**](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)

## Examples

[Forge](https://github.com/jackrobertscott/forge) uses lumbridge to manage it's application state and routing.

## Packages

- [lumbridge](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge)
- [lumbridge-persistor](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-persistor)
- [lumbridge-router](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-router)
- [lumbridge-store](https://github.com/jackrobertscott/lumbridge/tree/master/packages/lumbridge-store)
