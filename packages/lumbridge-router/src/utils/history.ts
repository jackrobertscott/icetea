import { createBrowserHistory, createMemoryHistory, History } from 'history';

declare const document: any;

const history: History =
  typeof document !== 'undefined'
    ? createBrowserHistory()
    : createMemoryHistory();

export default history;

export interface ILocation {
  pathname: string;
  search: string;
  hash: string;
}
