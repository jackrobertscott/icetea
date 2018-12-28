import { expect, Watchable } from 'lumbridge-core';

export interface IStoreConfig {
  schema?: IStoreField[];
  actions?: IStoreAction[];
}

export interface IStoreField {
  name: string;
  default: any;
  validate?: any;
}

export interface IStoreAction {
  name: string;
  execute: ({ state, data }: { state: IStoreState; data: any }) => IStoreState;
}

export interface IStoreDispatch {
  [name: string]: (data: any) => void;
}

export interface IStoreState {
  [key: string]: any;
}

export interface IStoreErrors {
  [key: string]: Error | any;
}

export interface IStoreWatcher {
  state?: (state: IStoreState) => void;
  errors?: (errors: IStoreErrors) => void;
}

export interface IStoreUpdates {
  state?: IStoreState;
  errors?: IStoreErrors;
}

export default class Store extends Watchable<IStoreWatcher, IStoreUpdates> {
  public static create(config: IStoreConfig = {}): Store {
    return new Store(config);
  }

  private schema: IStoreField[];
  private actions: IStoreAction[];
  private current: {
    state: IStoreState;
    errors: IStoreErrors;
  };

  constructor({ schema, actions }: IStoreConfig = {}) {
    super();
    expect.type('config.schema', schema, 'object', true);
    expect.type('config.actions', actions, 'object', true);
    this.schema = schema || [];
    this.actions = actions || [];
    this.current = { state: {}, errors: {} };
  }

  public assign(field: IStoreField): Store {
    this.schema.push(field);
    return this;
  }

  public action(action: IStoreAction): Store {
    this.actions.push(action);
    return this;
  }

  public watch({ state, errors, ...args }: IStoreWatcher): () => void {
    expect.type('watcher.state', state, 'function', true);
    expect.type('watcher.errors', errors, 'function', true);
    return super.watch({ state, errors, ...args });
  }

  public defaults(): IStoreState {
    return this.schema.reduce(
      (state, field) => ({
        ...state,
        [field.name]: field.default,
      }),
      {}
    );
  }

  public reset(): void {
    const state = this.defaults();
    this.current = { ...this.current, state };
    this.batch({ state });
  }

  public update(changes: IStoreState): void {
    const state = this.createState(changes);
    const errors = this.createErrors(state);
    this.current = { state, errors };
    this.batch({ state, errors });
  }

  public get state(): IStoreState {
    return { ...this.current.state };
  }

  public get errors(): IStoreState {
    return { ...this.current.errors };
  }

  public get dispatch() {
    return this.actions.reduce(
      (dispatchables, action) => ({
        ...dispatchables,
        [action.name]: (data: any) =>
          this.update(action.execute({ ...this.current, data })),
      }),
      {}
    );
  }

  private createState(changes?: IStoreState): IStoreState {
    return {
      ...this.defaults(),
      ...this.current.state,
      ...(changes || {}),
    };
  }

  private createErrors(state?: IStoreState): IStoreErrors {
    return this.schema.reduce((errors, field) => {
      const issue: Error | null = field.validate
        ? expect.validate(
            field.validate,
            (state || {})[field.name],
            `The ${field} is not valid.`
          )
        : null;
      if (issue) {
        return {
          ...errors,
          [field.name]: issue,
        };
      }
      return errors;
    }, {});
  }
}
