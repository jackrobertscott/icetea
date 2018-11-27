import React from 'react';
import { Router } from 'lumbridge-router';

export default Router.create({
  routes: {
    home: {
      path: '/',
      component: () => <div>Home Page</div>,
    },
  },
});
