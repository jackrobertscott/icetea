import * as pathToRegexp from 'path-to-regexp';
import { IRoute } from '../modules/Router';

interface IBag {
  currentPath: string;
  routePath: string;
  keys?: any[];
  options?: {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
    start?: boolean;
  };
}

export const matchPath = ({
  currentPath,
  routePath,
  keys = [],
  options = {},
}: IBag): boolean => {
  const regexp = pathToRegexp(routePath, keys, options);
  const match = regexp.exec(currentPath);
  return match !== null;
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
