import * as React from 'react';
import { expect } from 'lumbridge-core';
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
  protected routes: IRoute[];

  constructor(config: IConfig) {
    expect.type('config', config, 'object');
    expect.type('config.routes', config.routes, 'object');
    expect.type('config.change', config.change, 'object', true);
    expect.type('config.nomatch', config.nomatch, 'object', true);
    this.config = { ...config };
    this.routes = this.createRoutes();
  }

  public setup(): React.ReactNode {
    return () => (
      <Route
        history={history}
        retrieveCurrentRoute={this.currentRoute}
        change={this.config.change}
        nomatch={this.config.nomatch}
      />
    );
  }

  private createRoutes(): IRoute[] {
    return Object.keys(this.config.routes)
      .reduce((collection: IRoute[], name): IRoute[] => {
        return collection.concat([{ name, ...this.config.routes[name] }]);
      }, [])
      .sort(compareRoutePaths);
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
