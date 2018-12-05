import * as React from 'react';

export interface IEventsRouteProps {
  afterEnter: () => void;
  component: React.ReactNode;
}

export default class EventsRoute extends React.Component<IEventsRouteProps> {
  public componentDidMount() {
    this.props.afterEnter();
  }

  public render() {
    const CurrentRoute = this.props.component as any;
    return <CurrentRoute />;
  }
}
