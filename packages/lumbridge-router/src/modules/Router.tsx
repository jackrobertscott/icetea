import * as React from 'react';
import { matchPath } from '../utils/path';
import history from '../utils/history';
import Route from './Route';

export interface IEvents {
  before: (...args: any[]) => Promise<any>;
  after: (...args: any[]) => Promise<any>;
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
  protected routes: IRoute[];

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
    this.routes = this.config.routes.sort((a, b) => {
      if (a.exact && !b.exact) {
        return -1;
      }
      if (b.exact && !a.exact) {
        return 1;
      }
      return b.path.split('/').length - a.path.split('/').length;
    });
  }

  public render(): React.ReactNode {
    return () => (
      <Route
        history={history}
        retrieveCurrentRoute={this.currentRoute}
        nomatch={this.config.nomatch}
      />
    );
  }

  private currentRoute = (pathname?: string): IRoute | null => {
    return (
      (this.routes as any[]).filter((route: IRoute) => {
        return matchPath({
          currentPath: pathname || history.location.pathname,
          routePath: route.path,
        });
      })[0] || null
    );
  };
}
