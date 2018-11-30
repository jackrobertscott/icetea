import { expect, Watchable } from 'lumbridge-core';

export interface IMethod {
  payload: {
    [prop: string]: any;
  };
  handler: (...args: any[]) => Promise<any>;
}

export interface IStatus {
  loading: boolean;
}

export type IExecute = (...args: any[]) => object;

export interface IConfig {
  mapped?: IExecute;
  method: IMethod;
}

export interface IInstanceWatcher {
  data?: (data: object) => void;
  catch?: (error: Error) => void;
  status?: (status: IStatus) => void;
}

export interface IInstanceUpdates {
  data?: any;
  catch?: Error;
  status?: IStatus;
}

export default class Instance extends Watchable<
  IInstanceWatcher,
  IInstanceUpdates
> {
  public static create(config: IConfig): Instance {
    return new Instance(config);
  }

  private config: IConfig;
  private mapped?: IExecute;
  private method: IMethod;
  private cache: any;

  constructor(config: IConfig) {
    super();
    expect.type('config', config, 'object');
    expect.type('config.mapped', config.mapped, 'function');
    expect.type('config.method', config.method, 'object');
    this.config = { ...config };
    this.mapped = this.config.mapped;
    this.method = this.config.method;
  }

  public watch(watcher: IInstanceWatcher): () => void {
    expect.type('watcher.data', watcher.data, 'function', true);
    expect.type('watcher.catch', watcher.catch, 'function', true);
    expect.type('watcher.status', watcher.status, 'function', true);
    const unwatch = super.watch(watcher);
    if (this.cache) {
      this.isolation(watcher, { data: this.cache });
    }
    return unwatch;
  }

  public execute(payload: any) {
    this.batch({
      status: { loading: false },
    });
    const map = this.mapped ? this.mapped(payload) : { ...payload };
    // TODO: validate with "this.method.payload" schema
    const response = this.method.handler(map);
    if (!(response instanceof Promise)) {
      throw new Error(
        `Expected "method.handler" to return a Promise but got "${typeof response}".`
      );
    }
    response
      .then(data => {
        this.cache = data;
        this.batch({
          data,
          status: { loading: false },
        });
      })
      .catch(error => {
        this.batch({
          catch: error,
          status: { loading: false },
        });
      });
  }
}
