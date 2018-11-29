import React, { Component } from 'react';
import { Link } from 'lumbridge-router';
import Main from './layouts/Main';
import mainRouter from './routes/mainRouter';
import authStore from './stores/authStore';

const Routes = mainRouter.setup();

export default class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userId: null,
    };
  }

  componentDidMount() {
    this.unmount = authStore.watch({
      data: data => console.log(data) || this.setState({ userId: data.userId }),
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
