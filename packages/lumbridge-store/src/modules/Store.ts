import { expect } from 'lumbridge-core';

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

export interface IActions {
  [name: string]: (...args: any[]) => IState;
}

export interface IConfig {
  schema: ISchema;
  actions?: IActions;
}

export interface IWatchable {
  state?: (state: IState) => any;
  errors?: (errors: IErrors) => any;
}

export interface IDispatches {
  [name: string]: (...args: any[]) => void;
}

export default class Store {
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
  private watchSets: Map<number, IWatchable>;

  constructor(config: IConfig) {
    expect.type('config', config, 'object');
    expect.type('config.schema', config.schema, 'object');
    expect.type('config.actions', config.actions, 'object', true);
    this.config = { ...config };
    this.schema = this.config.schema;
    this.actions = this.config.actions || {};
    this.watchSets = new Map();
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

  public watch(watchable: IWatchable): () => void {
    if (watchable.state && typeof watchable.state !== 'function') {
      throw new Error(
        'Expected "state" in "store.watch({ state })" to be a function.'
      );
    }
    if (watchable.errors && typeof watchable.errors !== 'function') {
      throw new Error(
        'Expected "errors" in "store.watch({ errors })" to be a function.'
      );
    }
    let id: number;
    do {
      id = Math.random();
    } while (this.watchSets.has(id));
    this.watchSets.set(id, watchable);
    return () => {
      if (this.watchSets.has(id)) {
        this.watchSets.delete(id);
      }
    };
  }

  public update(changes: IState): void {
    this.generateState(changes, state => this.executeListeners({ state }));
    this.generateErrors(errors => this.executeListeners({ errors }));
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

  private executeListeners(updates: {
    state?: IState;
    errors?: IErrors;
  }): void {
    this.watchSets.forEach((watchable: IWatchable) => {
      this.executeIsolation(watchable, updates);
    });
  }

  private executeIsolation(
    watchable: IWatchable,
    updates: {
      state?: IState;
      errors?: IErrors;
    }
  ): void {
    if (watchable.state !== undefined && updates.state !== undefined) {
      watchable.state({ ...updates.state });
    }
    if (watchable.errors !== undefined && updates.errors !== undefined) {
      watchable.errors({ ...updates.errors });
    }
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
