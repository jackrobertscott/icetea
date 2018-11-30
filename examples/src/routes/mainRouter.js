import React from 'react';
import { Router } from 'lumbridge';
import FAQ from '../FAQ';

export default Router.create({
  change: {
    before: () => console.log('>> before change'),
    after: () => console.log('<< after change'),
  },
  nomatch: {
    redirect: '/',
  },
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
      component: () => <FAQ />,
      enter: {
        before: () => console.log('> enter before faq'),
        after: () => console.log('< enter after faq'),
      },
    },
  },
});
