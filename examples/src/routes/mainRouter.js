import React from 'react';
import { Router } from 'lumbridge-router';

export default Router.create({
  change: {
    before: () => console.log('before change'),
    after: () => console.log('after change'),
  },
  nomatch: {
    redirect: '/',
  },
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
      enter: {
        before: () => console.log('> enter before faq') || false,
        after: () => console.log('< enter after faq'),
      },
    },
  ],
});
