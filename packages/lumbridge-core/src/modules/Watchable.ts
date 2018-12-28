export interface IWatcher {
  [name: string]: (value: any) => any;
}

export interface IUpdates {
  [name: string]: any;
}

export default class Watchable<W extends IWatcher, U extends IUpdates> {
  protected watchers: Map<number, W>;

  constructor() {
    this.watchers = new Map();
  }

  public watch(watcher: W): () => void {
    let id: number;
    do {
      id = Math.random();
    } while (this.watchers.has(id));
    this.watchers.set(id, watcher);
    return () => {
      if (this.watchers.has(id)) {
        this.watchers.delete(id);
      }
    };
  }

  protected batch(updates: U): void {
    this.watchers.forEach((watcher: W, id: number) => {
      this.isolation(id, watcher, updates);
    });
  }

  protected isolation(id: number, watcher: W, updates: U): void {
    Object.keys(watcher).forEach(key => {
      const run: any = watcher[key];
      const value: any = updates[key];
      if (
        this.watchers.has(id) &&
        typeof run === 'function' &&
        value !== undefined
      ) {
        run(value);
      }
    });
  }
}
