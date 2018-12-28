import * as React from 'react';
import { expect } from 'lumbridge-core';
import { matchPath, compareRoutePaths } from '../utils/path';
import history, { ILocation } from '../utils/history';
import Route from './Route';
import Link from './Link';

export interface IRouterConfig {
  routes?: IRouterRoute[];
  nomatch?: IRouterNomatch;
  change?: IRouterEvents;
  base?: string;
}

export interface IRouterRoute {
  path: string;
  component: any;
  name?: string;
  sensitive?: boolean;
  strict?: boolean;
  exact?: boolean;
  start?: boolean;
  enter?: IRouterEvents;
  leave?: IRouterEvents;
}

export interface IRouterEvents {
  before?: (options: IRouterEventsOptions) => boolean | void;
  after?: (options: IRouterEventsOptions) => void;
}

export interface IRouterEventsOptions {
  location: ILocation;
}

export interface IRouterNomatch {
  redirect: string;
}

export default class Router {
  public static Link = Link;
  public static create(config: IRouterConfig = {}): Router {
    return new Router(config);
  }
  public static navigate(path: string, state?: any) {
    history.push(path, state);
  }

  protected routes: IRouterRoute[];
  protected nomatch?: IRouterNomatch;
  protected change?: IRouterEvents;
  protected base?: string;

  constructor({ base, nomatch, change, routes }: IRouterConfig = {}) {
    expect.type('config.base', base, 'string', true);
    expect.type('config.nomatch', nomatch, 'object', true);
    expect.type('config.change', change, 'object', true);
    expect.type('config.routes', routes, 'object', true);
    this.base = base;
    this.change = change;
    this.nomatch = nomatch;
    this.routes = (routes || []).sort(compareRoutePaths);
  }

  public route(item: IRouterRoute): Router {
    this.routes = [...this.routes, item].sort(compareRoutePaths);
    return this;
  }

  public compile(): React.FunctionComponent {
    return () => (
      <Route
        history={history}
        retrieveCurrentRoute={this.currentRoute}
        change={this.change}
        nomatch={this.nomatch}
      />
    );
  }

  private currentRoute = (pathname?: string): IRouterRoute | null => {
    const [match] = this.routes.filter((route: IRouterRoute) => {
      const options = {
        sensitive: route.sensitive || false,
        strict: route.sensitive || false,
        end: route.exact || false,
        start: route.start || true,
      };
      return matchPath({
        currentPath: pathname || history.location.pathname,
        routePath: `${this.base || ''}${route.path}`,
        options,
      });
    });
    return match || null;
  };
}
