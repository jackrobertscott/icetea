import * as React from 'react';
import { expect } from 'lumbridge-core';
import { matchPath, compareRoutePaths } from '../utils/path';
import history, { ILocation } from '../utils/history';
import Route from './Route';
import { Link } from '..';

export interface IRouterConfig {
  routes: IRoute[];
  nomatch?: INomatch;
  change?: IEvents;
  base?: string;
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

export interface IEvents {
  before?: (options: IEventOptions) => boolean | void;
  after?: (options: IEventOptions) => void;
}

export interface IEventOptions {
  location: ILocation;
}

export interface INomatch {
  redirect: string;
}

export default class Router {
  public static Link = Link;
  public static create(config: IRouterConfig): Router {
    return new Router(config);
  }

  protected routes: IRoute[];
  protected nomatch?: INomatch;
  protected change?: IEvents;
  protected base?: string;

  constructor({ change, nomatch, base, routes = [] }: IRouterConfig) {
    expect.type('config.base', base, 'string', true);
    expect.type('config.nomatch', nomatch, 'object', true);
    expect.type('config.change', change, 'object', true);
    this.base = base;
    this.change = change;
    this.nomatch = nomatch;
    this.routes = routes.sort(compareRoutePaths);
  }

  public route(item: IRoute) {
    this.routes = [...this.routes, item].sort(compareRoutePaths);
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
