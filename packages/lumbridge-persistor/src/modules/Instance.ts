import { expect, Watchable } from 'lumbridge-core';

export interface IInstanceAction {
  name: string;
  handler: (...args: any[]) => Promise<any> | any;
}

export interface IInstanceStatus {
  loading: boolean;
}

export interface IInstancePayload {
  [name: string]: any;
}

export type IInstanceCommon = IInstancePayload;

export interface IInstanceConfig {
  action: IInstanceAction;
  common?: IInstanceCommon;
}

export interface IInstanceWatcher {
  data?: (data: any) => void;
  catch?: (error: Error) => void;
  status?: (status: IInstanceStatus) => void;
}

export interface IInstanceUpdates {
  data?: any;
  catch?: Error;
  status?: IInstanceStatus;
}

export default class Instance extends Watchable<
  IInstanceWatcher,
  IInstanceUpdates
> {
  public static create(config: IInstanceConfig): Instance {
    return new Instance(config);
  }

  private action: IInstanceAction;
  private common?: IInstanceCommon;
  private payloadLast?: IInstancePayload;

  constructor({ common, action }: IInstanceConfig) {
    super();
    expect.type('config.action', action, 'object');
    expect.type('config.common', common, 'function', true);
    this.action = action;
    this.common = common;
  }

  public watch(watcher: IInstanceWatcher): () => void {
    expect.type('watcher.data', watcher.data, 'function', true);
    expect.type('watcher.catch', watcher.catch, 'function', true);
    expect.type('watcher.status', watcher.status, 'function', true);
    return super.watch(watcher);
  }

  public redo() {
    this.execute({
      ...(this.payloadLast || {}),
    });
  }

  public execute(payload?: IInstancePayload): void {
    this.payloadLast = payload || {};
    this.batch({
      status: { loading: true },
    });
    const updatedStatus = { loading: false };
    const map = { ...(this.common || {}), ...payload };
    const response = this.action.handler(map);
    /**
     * Leave the other functions outside of try/catch as we only
     * want errors to be caught if they are cause by a server response
     * and not a coding error.
     */
    try {
      if (response instanceof Promise) {
        response
          .then(data => this.batch({ data, status: updatedStatus }))
          .catch(error => this.batch({ catch: error, status: updatedStatus }));
      } else {
        this.batch({ data: response, status: updatedStatus });
      }
    } catch (error) {
      this.batch({ catch: error, status: updatedStatus });
    }
  }
}
