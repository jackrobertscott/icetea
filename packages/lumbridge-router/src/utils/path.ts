import * as pathToRegexp from 'path-to-regexp';

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
