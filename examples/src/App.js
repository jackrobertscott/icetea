import React from 'react';
import { Link } from 'lumbridge-router';
import Main from './layouts/Main';
import mainRouter from './routes/mainRouter';

const Router = mainRouter.render();

export default () => (
  <Main>
    <nav>
      <Link to="/" style={{ marginRight: '10px' }}>
        Home
      </Link>
      <Link to="/about" style={{ marginRight: '10px' }}>
        About
      </Link>
      <Link to="/faq" style={{ marginRight: '10px' }}>
        Faq
      </Link>
    </nav>
    <hr />
    <Router />
  </Main>
);
