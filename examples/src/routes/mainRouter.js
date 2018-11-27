import React from 'react';
import { Router } from 'lumbridge-router';

export default Router.create({
  routes: {
    home: {
      path: '/',
      component: () => <div>Home Page</div>,
    },
    about: {
      path: '/about',
      component: () => <div>About Page</div>,
    },
    faq: {
      path: '/faq',
      component: () => <div>FAQ Page</div>,
    },
  },
});
