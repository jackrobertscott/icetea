import React, { Component } from 'react';
import { setAuthInstance } from './services/auth';

export default class App extends Component {
  componentDidMount() {
    setAuthInstance.execute({ data: 'blahblahblah' });
  }

  render() {
    return <div>FAQ Page!</div>;
  }
}
