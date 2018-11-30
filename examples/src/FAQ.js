import React, { Component } from 'react';
import { setAuthInstance } from './services/auth';
import authStore from './stores/authStore';

export default class FAQ extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      time: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      setAuthInstance.execute({ data: { time: Date.now() } });
    }, 3000);
    this.unwatch = setAuthInstance.watch({
      data: ({ data: { time } }) => {
        authStore.update({ userId: String(time) });
        this.setState({ time });
      },
    });
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.unwatch) {
      this.unwatch();
    }
  }

  render() {
    return <div>FAQ Page! Time: {this.state.time}</div>;
  }
}
