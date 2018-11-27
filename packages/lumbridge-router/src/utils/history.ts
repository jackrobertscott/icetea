import { createBrowserHistory, History } from 'history';

const history: History = createBrowserHistory();

export default history;

export interface ILocation {
  pathname: string;
  search: string;
  hash: string;
}
