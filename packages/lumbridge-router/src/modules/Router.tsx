import * as React from 'react';
import { matchPath } from '../utils/path';
import history from '../utils/history';

interface IEvents {
  before: () => Promise<any>;
  after: () => Promise<any>;
}

interface IRoute {
  path: string;
  exact?: boolean;
  component: React.ReactNode;
  enter?: IEvents;
  after?: IEvents;
}

interface IConfig {
  routes: {
    [name: string]: IRoute;
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
  protected routes: Array<IRoute & { name: string }>;

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

  private setupRoutes(): Array<IRoute & { name: string }> {
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

  private isRouteMatch(route: IRoute & { name: string }): boolean {
    return matchPath({
      currentPath: history.location.pathname,
      routePath: route.path,
    });
  }

  get Routes(): React.SFC<{}> {
    // TODO: find the correct route and render...
    return () => <div />;
  }
}
