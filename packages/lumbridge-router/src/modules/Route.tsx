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
  private backup: boolean;

  constructor(props: IRouteProps) {
    super(props);
    const { location } = props.history;
    this.state = {
      location,
      currentRoute: props.retrieveCurrentRoute(location.pathname),
      lastRoute: null,
    };
    this.backup = false;
  }

  public componentDidMount() {
    const { history, retrieveCurrentRoute } = this.props;
    this.unlisten = history.listen((location: ILocation) => {
      const { currentRoute } = this.state;
      if (this.backup) {
        this.backup = false;
      } else if (currentRoute && !this.runBeforeLeaveHooks(currentRoute)) {
        this.backup = true;
        history.goBack();
        return;
      }
      const nextRoute = retrieveCurrentRoute(location.pathname);
      if (currentRoute !== nextRoute) {
        this.setState({
          location,
          lastRoute: currentRoute,
          currentRoute: nextRoute,
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
    const { currentRoute, lastRoute } = this.state;
    if (!currentRoute) {
      return this.nomatchRoute();
    }
    if (!this.runBeforeEnterHooks(currentRoute)) {
      return this.nomatchRoute();
    }
    const afterEnter = () => {
      if (lastRoute) {
        this.runAfterLeaveHooks(lastRoute);
      }
      this.runAfterEnterHooks(currentRoute);
    };
    return (
      <EventsRoute
        key={currentRoute.path}
        component={currentRoute.component}
        afterEnter={afterEnter}
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

  private runBeforeEnterHooks(route: IRoute): boolean {
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

  private runAfterEnterHooks(route: IRoute): void {
    const { change } = this.props;
    const { location } = this.state;
    if (route.enter && typeof route.enter.after === 'function') {
      route.enter.after({ location });
    }
    if (change && typeof change.after === 'function') {
      change.after({ location });
    }
  }

  private runBeforeLeaveHooks(route: IRoute): boolean {
    const { location } = this.state;
    if (route.leave && typeof route.leave.before === 'function') {
      if (route.leave.before({ location }) === false) {
        return false;
      }
    }
    return true;
  }

  private runAfterLeaveHooks(route: IRoute): void {
    const { location } = this.state;
    if (route.leave && typeof route.leave.after === 'function') {
      route.leave.after({ location });
    }
  }
}
