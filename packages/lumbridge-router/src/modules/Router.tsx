import * as React from 'react';
import { matchPath } from '../utils/path';
import history from '../utils/history';

interface IEvents {
  before: () => Promise<any>;
  after: () => Promise<any>;
}

interface IRouteOptions {
  path: string;
  exact?: boolean;
  component: React.ReactNode;
  enter?: IEvents;
  after?: IEvents;
}

interface IRoute extends IRouteOptions {
  name: string;
}

interface IConfig {
  routes: {
    [name: string]: IRouteOptions;
  };
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
    this.config = config;
    this.routes = this.setupRoutes();
  }

  private setupRoutes(): IRoute[] {
    return Object.keys(this.config.routes)
      .map(name => ({
        name,
        ...this.config.routes[name],
      }))
      .sort((a, b) => {
        if (a.exact && !b.exact) {
          return -1;
        }
        if (b.exact && !a.exact) {
          return 1;
        }
        return b.path.split('/').length - a.path.split('/').length;
      });
  }

  private currentRoute() {
    const filteredRoutes = (this.routes as any[]).filter((route: IRoute) => {
      return matchPath({
        currentPath: history.location.pathname,
        routePath: route.path,
      });
    });
    return filteredRoutes.length ? filteredRoutes[0] : null;
  }

  get Routes(): React.ReactNode {
    const route = this.currentRoute();
    return route ? route.component : null;
  }
}
