import * as pathToRegexp from 'path-to-regexp';
import { IRoute } from '../modules/Router';

interface IDigestOptions {
  sensitive?: boolean;
  strict?: boolean;
  end?: boolean;
  start?: boolean;
}

interface IDigestBag {
  routePath: string;
  options?: IDigestOptions;
}

export const digestPath = ({
  routePath,
  options = {},
}: IDigestBag): { keys: any[]; regexp: RegExp } => {
  const keys: any[] = [];
  const regexp: RegExp = pathToRegexp(routePath, keys, options);
  return {
    keys,
    regexp,
  };
};

interface IMatchBag {
  currentPath: string;
  routePath: string;
  options?: IDigestOptions;
}

export const matchPath = ({
  currentPath,
  routePath,
  options = {},
}: IMatchBag): boolean => {
  const { regexp } = digestPath({ routePath, options });
  return regexp.exec(currentPath) !== null;
};

export const compareRoutePaths = (a: IRoute, b: IRoute): number => {
  if (a.exact && !b.exact) {
    return -1;
  }
  if (b.exact && !a.exact) {
    return 1;
  }
  return b.path.split('/').length - a.path.split('/').length;
};
