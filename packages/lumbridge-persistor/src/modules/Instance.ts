import { expect } from 'lumbridge-core';

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
  mapped: IExecute;
  method: IMethod;
}

export interface IWatchable {
  data?: (data: any) => void;
  catch?: (error: Error) => void;
  status?: (status: IStatus) => void;
}

export class Instance {
  public static create(config: IConfig): Instance {
    return new Instance(config);
  }

  private config: IConfig;
  private mapped: IExecute;
  private method: IMethod;
  private cache: any;
  private watchSets: Map<number, IWatchable>;

  constructor(config: IConfig) {
    expect.type('config', config, 'object');
    expect.type('config.mapped', config.mapped, 'function');
    expect.type('config.method', config.method, 'object');
    this.config = { ...config };
    this.mapped = this.config.mapped;
    this.method = this.config.method;
    this.watchSets = new Map();
  }

  public watch(watchable: IWatchable): () => void {
    expect.type('watchable.data', watchable.data, 'function', true);
    expect.type('watchable.catch', watchable.catch, 'function', true);
    expect.type('watchable.status', watchable.status, 'function', true);
    let id: number;
    do {
      id = Math.random();
    } while (this.watchSets.has(id));
    this.watchSets.set(id, watchable);
    if (this.cache) {
      this.executeIsolation(watchable, { data: this.cache });
    }
    return () => {
      if (this.watchSets.has(id)) {
        this.watchSets.delete(id);
      }
    };
  }

  public execute(payload: any) {
    this.executeListeners({
      status: { loading: false },
    });
    const map = this.mapped(payload);
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
        this.executeListeners({
          data,
          status: { loading: false },
        });
      })
      .catch(error => {
        this.executeListeners({
          error,
          status: { loading: false },
        });
      });
  }

  private executeListeners(updates: {
    data?: any;
    error?: Error;
    status?: IStatus;
  }): void {
    this.watchSets.forEach((watchable: IWatchable) => {
      this.executeIsolation(watchable, updates);
    });
  }

  private executeIsolation(
    watchable: IWatchable,
    updates: {
      data?: any;
      error?: Error;
      status?: IStatus;
    }
  ): void {
    if (watchable.data !== undefined && updates.data !== undefined) {
      const clone =
        typeof updates.data === 'object' ? { ...updates.data } : updates.data;
      watchable.data(clone);
    }
    if (watchable.catch !== undefined && updates.error !== undefined) {
      watchable.catch(updates.error);
    }
    if (watchable.status !== undefined && updates.status !== undefined) {
      watchable.status(updates.status);
    }
  }
}
