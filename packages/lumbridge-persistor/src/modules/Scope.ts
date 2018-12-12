import { expect, Watchable } from 'lumbridge-core';
import Instance, { IInstanceWatcher, IInstanceUpdates } from './Instance';

export interface IScopeInstance {
  unwatch: () => void;
  instance: Instance;
  depends: boolean;
}

export default class Scope extends Watchable<
  IInstanceWatcher,
  IInstanceUpdates
> {
  public static create(): Scope {
    return new Scope();
  }

  private items: IScopeInstance[];

  constructor() {
    super();
    this.items = [];
  }

  public absorb(instance: Instance, depends: boolean = false): void {
    const unwatch = instance.watch({
      data: data => {
        this.batch({ data });
        this.dependencies();
      },
      catch: error => this.batch({ catch: error }),
      status: status => this.batch({ status }),
    });
    this.items.push({
      unwatch,
      instance,
      depends,
    });
  }

  public watch(watcher: IInstanceWatcher): () => void {
    expect.type('watcher.data', watcher.data, 'function', true);
    expect.type('watcher.catch', watcher.catch, 'function', true);
    expect.type('watcher.status', watcher.status, 'function', true);
    return super.watch(watcher);
  }

  private dependencies() {
    this.items
      .filter(({ depends }) => depends)
      .forEach(({ instance }) => instance.refresh());
  }
}
