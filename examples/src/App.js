import React from 'react';
import Main from './layouts/Main';
import mainRouter from './routes/mainRouter';

export default () => (
  <Main>
    <p>React app.</p>
    <p>Hello world.</p>
    <hr />
    <mainRouter.Routes />
  </Main>
);
