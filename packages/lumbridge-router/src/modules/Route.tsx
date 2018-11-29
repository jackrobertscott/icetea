import * as React from 'react';
import { IRoute, IEvents } from './Router';
import EventsRoute from './EventsRoute';
import { ILocation } from '../utils/history';

export interface IRouteProps {
  history: any;
  retrieveCurrentRoute: (pathname?: string) => IRoute | null;
  change?: IEvents;
  nomatch?: {
    redirect: string;
  };
}

export interface IRouteState {
  location: any;
  currentRoute: IRoute | null;
  lastRoute: IRoute | null;
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
      const oldRoute = this.state.currentRoute;
      const newRoute = this.props.retrieveCurrentRoute(location.pathname);
      if (oldRoute !== newRoute) {
        this.setState({
          location,
          lastRoute: oldRoute,
          currentRoute: newRoute,
        });
      }
    });
  }

  public componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  public render() {
    const { currentRoute } = this.state;
    if (!currentRoute) {
      return this.nomatchRoute();
    }
    if (!this.runBeforeHooks(currentRoute)) {
      return this.nomatchRoute();
    }
    const after = () => this.runAfterHooks(currentRoute);
    return (
      <EventsRoute
        key={currentRoute.path}
        component={currentRoute.component}
        after={after}
      />
    );
  }

  private nomatchRoute() {
    const { history, nomatch } = this.props;
    if (nomatch && nomatch.redirect) {
      /**
       * Set timeout is used to push function to next process tick
       * so that it does not try and update state before end of render.
       */
      setTimeout(() => history.replace(nomatch.redirect));
    }
    return <React.Fragment />;
  }

  private runBeforeHooks(route: IRoute): boolean {
    const { change } = this.props;
    const { location } = this.state;
    if (change && typeof change.before === 'function') {
      if (change.before({ location }) === false) {
        return false;
      }
    }
    if (route.enter && typeof route.enter.before === 'function') {
      if (route.enter.before({ location }) === false) {
        return false;
      }
    }
    return true;
  }

  private runAfterHooks(route: IRoute): void {
    const { change } = this.props;
    const { location } = this.state;
    if (route.enter && typeof route.enter.before === 'function') {
      route.enter.after({ location });
    }
    if (change && typeof change.after === 'function') {
      change.after({ location });
    }
  }
}
