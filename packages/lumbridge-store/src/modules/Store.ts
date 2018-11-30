import { expect, Watchable } from 'lumbridge-core';

export interface IState {
  [key: string]: any;
}

export interface IErrors {
  [key: string]: Error;
}

export interface ISchema {
  [key: string]: {
    state: any;
    validate?: any;
  };
}

export interface IDispatches {
  [name: string]: (...args: any[]) => void;
}

export interface IActions {
  [name: string]: (...args: any[]) => IState;
}

export interface IConfig {
  schema: ISchema;
  actions?: IActions;
}

export interface IStoreWatcher {
  state?: (state: IState) => void;
  errors?: (errors: IErrors) => void;
}

export interface IStoreUpdates {
  state?: IState;
  errors?: IErrors;
}

export default class Store extends Watchable<IStoreWatcher, IStoreUpdates> {
  public static create(config: IConfig): Store {
    return new Store(config);
  }

  public dispatch: IDispatches;
  private config: IConfig;
  private schema: ISchema;
  private actions: IActions;
  private currentState: IState;
  private currentErrors: IErrors;
  private defaultSchema: ISchema;

  constructor(config: IConfig) {
    super();
    expect.type('config', config, 'object');
    expect.type('config.schema', config.schema, 'object');
    expect.type('config.actions', config.actions, 'object', true);
    this.config = { ...config };
    this.schema = this.config.schema;
    this.actions = this.config.actions || {};
    this.currentState = {};
    this.currentErrors = {};
    this.generateState({});
    this.generateErrors();
    this.dispatch = this.createDispatches();
    this.defaultSchema = this.createDefaults();
  }

  public get state(): IState {
    return { ...this.currentState };
  }

  public get errors(): IState {
    return { ...this.currentErrors };
  }

  public watch(watcher: IStoreWatcher): () => void {
    expect.type('watcher.state', watcher.state, 'function', true);
    expect.type('watcher.errors', watcher.errors, 'function', true);
    return super.watch(watcher);
  }

  public update(changes: IState): void {
    this.generateState(changes, state => this.batch({ state }));
    this.generateErrors(errors => this.batch({ errors }));
  }

  private generateState(changes: IState, cb?: (state: IState) => any): void {
    this.currentState = {
      ...this.defaultSchema,
      ...this.currentState,
      ...changes,
    };
    if (cb) {
      cb(this.currentState);
    }
  }

  private generateErrors(cb?: (errors: IErrors) => any) {
    this.currentErrors = Object.keys(this.schema).reduce((collection, key) => {
      const { validate } = this.schema[key];
      const issue: Error | null = validate
        ? this.validateProp(validate, this.currentState[key], key)
        : null;
      if (issue) {
        return {
          ...collection,
          [key]: issue,
        };
      }
      return collection;
    }, {});
    if (cb) {
      cb(this.currentErrors);
    }
  }

  private validateProp(validate: any, value: any, key: string): Error | null {
    if (validate.validateSync) {
      try {
        validate.validateSync(value);
      } catch (error) {
        return error;
      }
    } else if (typeof validate === 'function') {
      if (!validate(value)) {
        return new Error(`The ${key} is not valid.`);
      }
    }
    return null;
  }

  private createDispatches(): IDispatches {
    return Object.keys(this.actions).reduce((collection, key) => {
      const dispatchAction = (...args: any[]) =>
        this.update(this.actions[key](...args));
      return {
        ...collection,
        [key]: dispatchAction,
      };
    }, {});
  }

  private createDefaults(): ISchema {
    return Object.keys(this.schema).reduce((collection, key) => {
      return {
        ...collection,
        [key]: this.schema[key].state,
      };
    }, {});
  }
}
