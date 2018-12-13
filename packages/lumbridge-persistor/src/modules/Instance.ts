import { expect, Watchable } from 'lumbridge-core';

export interface IMethod {
  payload: {
    [prop: string]: any;
  };
  handler: (...args: any[]) => Promise<any> | any;
}

export interface IStatus {
  loading: boolean;
}

export type IExecute = (...args: any[]) => { [name: string]: any };

export interface IConfig {
  mapped?: IExecute;
  method: IMethod;
}

export interface IInstanceWatcher {
  data?: (data: any) => void;
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

  private mapped?: IExecute;
  private method: IMethod;
  private payloadLast: any;

  constructor({ mapped, method }: IConfig) {
    super();
    expect.type('config.mapped', mapped, 'function');
    expect.type('config.method', method, 'object');
    this.mapped = mapped;
    this.method = method;
  }

  public watch(watcher: IInstanceWatcher): () => void {
    expect.type('watcher.data', watcher.data, 'function', true);
    expect.type('watcher.catch', watcher.catch, 'function', true);
    expect.type('watcher.status', watcher.status, 'function', true);
    return super.watch(watcher);
  }

  public redo() {
    this.execute({ ...(this.payloadLast || {}) });
  }

  public execute(payload: any = {}): void {
    const map = this.mapped ? this.mapped({ ...payload }) : { ...payload };
    const issue = this.generateErrors(map);
    if (issue) {
      this.batch({ catch: issue });
      return;
    }
    this.payloadLast = payload;
    this.batch({ status: { loading: true } });
    const status = { loading: false };
    try {
      const response = this.method.handler(map);
      if (response instanceof Promise) {
        response
          .then(data => this.batch({ data, status }))
          .catch(error => this.batch({ catch: error, status }));
      } else {
        this.batch({ data: response, status });
      }
    } catch (error) {
      this.batch({ catch: error, status });
    }
  }

  private generateErrors(payload: any = {}): Error | null {
    const issues: Error[] = Object.keys(this.method.payload)
      .map(key => {
        return expect.validate(
          this.method.payload[key],
          payload[key],
          `The ${key} is not valid.`
        );
      })
      .filter(error => error) as Error[];
    if (issues.length) {
      const error: any = new Error('The payload is not valid.');
      error.errors = issues;
      return error;
    }
    return null;
  }
}
