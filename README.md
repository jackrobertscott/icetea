# Lumbridge

> 🏎 Helper classes which every React developer wishes they had.

Once upon a time, a small company called Facebook created a front-end library to help in the development of application views.

## Classes

The following classes provide functionality to front-end code development that are designed to work with React out of the box.

### Router

```js
const authRouter = new Router({
  change: ({ location }) => console.log(location),
  routes: {
    /**
     * Each route is given a key which represents the name of the
     * route which not only makes it easy to use but also structures
     * the code quite nicely.
     */
    home: {
      exact: true,
      path: ({ match }) => `${match}/`,
      component: HomePage,
    },
    /**
     * See how you can add "enter" and "leave" methods which
     * help people set routing guards and protection methods
     * which might save a form's data before routing away.
     */
    login: {
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
      enter: () => someStateAccess.usersIsNotSignedIn,
      leave: () => saveTheDataBeforeRouting(),
    },
    /**
     * In this route we have some aliases which can be used to
     * request a path to a route by a different name.
     */
    logout: {
      alias: ['hello', 'yellow'],
      path: ({ match }) => `${match}/login`,
      component: LoginForm,
    },
  }
});
```