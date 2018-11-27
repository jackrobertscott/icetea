import * as React from 'react';
import { IRoute } from './Router';
import EventsRoute from './EventsRoute';

export interface IRouteProps {
  history: any;
  retrieveCurrentRoute: (pathname?: string) => IRoute | null;
  nomatch?: {
    redirect: string;
  };
}

export interface IRouteState {
  location: any;
  currentRoute: IRoute | null;
  lastRoute: IRoute | null;
}

export interface ILocation {
  pathname: string;
  search: string;
  hash: string;
}

export default class Route extends React.Component<IRouteProps, IRouteState> {
  private unlisten?: () => void;

  constructor(props: IRouteProps) {
    super(props);
    const { location } = props.history;
    this.state = {
      location,
      currentRoute: props.retrieveCurrentRoute(location.pathname),
      lastRoute: null,
    };
  }

  public componentDidMount() {
    this.unlisten = this.props.history.listen((location: ILocation) => {
      const { currentRoute } = this.state;
      this.setState({
        location,
        lastRoute: currentRoute,
        currentRoute: this.props.retrieveCurrentRoute(location.pathname),
      });
    });
  }

  public componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  public shouldComponentUpdate() {
    const { lastRoute, currentRoute, location } = this.state;
    return (
      lastRoute !== currentRoute &&
      location.pathname !== this.props.history.location.pathname
    );
  }

  public render() {
    const { history, nomatch } = this.props;
    const { location, currentRoute } = this.state;
    if (!currentRoute) {
      return <React.Fragment />;
    }
    let enterable = true;
    if (currentRoute.enter && typeof currentRoute.enter.before === 'function') {
      const guard = currentRoute.enter.before({ location });
      if (typeof guard === 'boolean') {
        enterable = guard;
      }
    }
    if (!enterable) {
      if (nomatch && nomatch.redirect) {
        history.replace(nomatch.redirect);
      }
      return null;
    }
    return (
      <EventsRoute
        key={currentRoute.path}
        component={currentRoute.component}
        after={currentRoute.enter && currentRoute.enter.after}
      />
    );
  }
}
