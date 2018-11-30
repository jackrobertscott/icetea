import { expect, Watchable } from 'lumbridge-core';
import Instance, { IInstanceWatcher, IInstanceUpdates } from './Instance';

export interface IConfig {}

export interface IScopeInstance {
  unwatch: () => void;
  instance: Instance;
  depends: boolean;
}

export default class Scope extends Watchable<
  IInstanceWatcher,
  IInstanceUpdates
> {
  public static create(config: IConfig): Scope {
    return new Scope(config);
  }

  private config: IConfig;
  private items: IScopeInstance[];
  private cache: any;

  constructor(config: IConfig) {
    super();
    expect.type('config', config, 'object');
    this.config = { ...config };
    this.items = [];
  }

  public absorb(instance: Instance, depends: boolean = false): void {
    const unwatch = instance.watch({
      data: console.log,
      catch: console.log,
      status: console.log,
    });
    this.items.push({
      unwatch,
      instance,
      depends,
    });
  }

  public watch(watchable: IInstanceWatcher): () => void {
    expect.type('watchable.data', watchable.data, 'function', true);
    expect.type('watchable.catch', watchable.catch, 'function', true);
    expect.type('watchable.status', watchable.status, 'function', true);
    const unwatch = super.watch(watchable);
    if (this.cache) {
      this.isolation(watchable, { data: this.cache });
    }
    return unwatch;
  }
}
