import React, { Component } from 'react';
import { Router } from 'lumbridge-router';
import Main from './layouts/Main';
import mainRouter from './routes/mainRouter';
import authStore from './stores/authStore';

const Routes = mainRouter.compile();

export default class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userId: null,
    };
  }

  componentDidMount() {
    this.unmount = authStore.watch({
      state: data => this.setState({ userId: data.userId }),
    });
  }

  componentWillUnmount() {
    if (this.unmount) {
      this.unmount();
    }
  }

  render() {
    return (
      <Main>
        <div>User id: {this.state.userId}</div>
        <nav>
          <Router.Link to="/" style={{ marginRight: '10px' }}>
            Home
          </Router.Link>
          <Router.Link to="/about" style={{ marginRight: '10px' }}>
            About
          </Router.Link>
          <Router.Link to="/faq" style={{ marginRight: '10px' }}>
            Faq
          </Router.Link>
        </nav>
        <hr />
        <Routes />
      </Main>
    );
  }
}
