import * as React from 'react';
import { matchPath, compareRoutePaths } from '../utils/path';
import history, { ILocation } from '../utils/history';
import Route from './Route';

export interface IEvents {
  before: (options: { location: ILocation }) => boolean | void;
  after: (options: { location: ILocation }) => void;
}

export interface IRoute {
  path: string;
  component: any;
  name?: string;
  exact?: boolean;
  enter?: IEvents;
  after?: IEvents;
}

export interface IConfig {
  routes: IRoute[];
  change?: IEvents;
  nomatch?: {
    redirect: string;
  };
}

export default class Router {
  public static create(config: IConfig): Router {
    return new Router(config);
  }

  protected config: IConfig;
  protected sortedRoutes: IRoute[];

  constructor(config: IConfig) {
    if (!config) {
      throw new Error('Expected config object to be given to constructor.');
    }
    if (!config.routes) {
      throw new Error(
        'Expected config.routes object to be given to constructor.'
      );
    }
    this.config = { ...config };
    this.sortedRoutes = this.config.routes.sort(compareRoutePaths);
  }

  public routes(): React.ReactNode {
    return () => (
      <Route
        history={history}
        retrieveCurrentRoute={this.currentRoute}
        change={this.config.change}
        nomatch={this.config.nomatch}
      />
    );
  }

  private currentRoute = (pathname?: string): IRoute | null => {
    return (
      (this.sortedRoutes as any[]).filter((route: IRoute) => {
        return matchPath({
          currentPath: pathname || history.location.pathname,
          routePath: route.path,
        });
      })[0] || null
    );
  };
}
