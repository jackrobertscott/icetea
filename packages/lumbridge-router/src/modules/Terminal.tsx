import history from '../utils/history';

export default class Terminal {
  public static navigate(path: string, state?: any) {
    history.push(path, state);
  }
}
