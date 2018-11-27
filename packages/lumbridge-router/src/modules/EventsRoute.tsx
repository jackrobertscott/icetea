import * as React from 'react';

export interface IEventsRouteProps {
  after?: () => any;
  component: React.ReactNode;
}

export default class EventsRoute extends React.Component<IEventsRouteProps> {
  public componentDidMount() {
    const { after } = this.props;
    if (after) {
      after();
    }
  }

  public render() {
    const CurrentRoute = this.props.component as any;
    return <CurrentRoute />;
  }
}
