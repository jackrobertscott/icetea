import React from 'react';
import { Router } from 'lumbridge-router';

export default Router.create({
  routes: [
    {
      path: '/',
      component: () => <div>Home Page</div>,
    },
    {
      path: '/about',
      component: () => <div>About Page</div>,
    },
    {
      path: '/faq',
      component: () => <div>FAQ Page</div>,
    },
  ],
});
