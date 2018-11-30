export interface IWatcher {
  [name: string]: any; // ((...args: any[]) => any) | undefined
}

export interface IUpdates {
  [name: string]: any;
}

export default class Watchable<W extends IWatcher, U extends IUpdates> {
  protected watchers: Map<number, W>;

  constructor() {
    this.watchers = new Map();
  }

  public watch(watchable: W): () => void {
    let id: number;
    do {
      id = Math.random();
    } while (this.watchers.has(id));
    this.watchers.set(id, watchable);
    return () => {
      if (this.watchers.has(id)) {
        this.watchers.delete(id);
      }
    };
  }

  protected batch(updates: U): void {
    this.watchers.forEach((watcher: W) => {
      this.isolation(watcher, updates);
    });
  }

  protected isolation(watcher: W, updates: U): void {
    Object.keys(watcher).forEach(key => {
      const run: any = watcher[key];
      const value: any = updates[key];
      if (typeof run === 'function' && value !== undefined) {
        run(typeof value === 'object' ? { ...value } : value);
      }
    });
  }
}
