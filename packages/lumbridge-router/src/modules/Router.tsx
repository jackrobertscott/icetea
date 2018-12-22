import * as React from 'react';
import { expect } from 'lumbridge-core';
import { matchPath, compareRoutePaths } from '../utils/path';
import history, { ILocation } from '../utils/history';
import Route from './Route';
import { Link } from '..';

export interface IEvents {
  before?: (options: { location: ILocation }) => boolean | void;
  after?: (options: { location: ILocation }) => void;
}

export interface IRoute {
  path: string;
  component: any;
  name?: string;
  sensitive?: boolean;
  strict?: boolean;
  exact?: boolean;
  start?: boolean;
  enter?: IEvents;
  leave?: IEvents;
}

export interface IRoutes {
  [name: string]: IRoute;
}

export interface INomatch {
  redirect: string;
}

export interface IConfig {
  routes: IRoutes;
  nomatch?: INomatch;
  change?: IEvents;
  base?: string;
}

export default class Router {
  public static Link = Link;
  public static create(config: IConfig): Router {
    return new Router(config);
  }

  protected routes: IRoute[];
  protected nomatch?: INomatch;
  protected change?: IEvents;
  protected base?: string;

  constructor({ routes, change, nomatch, base }: IConfig) {
    expect.type('config.routes', routes, 'object');
    expect.type('config.change', change, 'object', true);
    expect.type('config.nomatch', nomatch, 'object', true);
    expect.type('config.base', base, 'string', true);
    this.routes = this.createRoutes(routes);
    this.nomatch = nomatch;
    this.change = change;
    this.base = base;
  }

  public render(): React.FunctionComponent {
    return () => (
      <Route
        history={history}
        retrieveCurrentRoute={this.currentRoute}
        change={this.change}
        nomatch={this.nomatch}
      />
    );
  }

  private createRoutes(routes: IRoutes): IRoute[] {
    return Object.keys(routes)
      .reduce((collection: IRoute[], name): IRoute[] => {
        return collection.concat([{ name, ...routes[name] }]);
      }, [])
      .sort(compareRoutePaths);
  }

  private currentRoute = (pathname?: string): IRoute | null => {
    return (
      (this.routes as any[]).filter((route: IRoute) => {
        return matchPath({
          currentPath: pathname || history.location.pathname,
          routePath: `${this.base || ''}${route.path}`,
          options: {
            sensitive: route.sensitive || false,
            strict: route.sensitive || false,
            end: route.exact || false,
            start: route.start || true,
          },
        });
      })[0] || null
    );
  };
}
