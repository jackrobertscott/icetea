import React, { Component } from 'react';
import { Link } from 'lumbridge-router';
import Main from './layouts/Main';
import mainRouter from './routes/mainRouter';
import { getAuthInstance } from './services/auth';

const Routes = mainRouter.setup();

export default class App extends Component {
  componentDidMount() {
    getAuthInstance.watch({
      data: data => console.log(data),
    });
  }

  render() {
    return (
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
        <Routes />
      </Main>
    );
  }
}
