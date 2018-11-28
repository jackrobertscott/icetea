export interface IState {
  [key: string]: any;
}

export interface IErrors {
  [key: string]: string;
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

export default class Store {
  public static create(config: IConfig): Store {
    return new Store(config);
  }

  private config: IConfig;
  private schema: ISchema;
  private actions: IActions;
  private currentState: IState;
  private currentErrors: IErrors;
  private watchSets: Map<number, IWatchable>;

  constructor(config: IConfig) {
    if (!config) {
      throw new Error('Expected config object to be given to constructor.');
    }
    if (!config.schema) {
      throw new Error(
        'Expected config.schema object to be given to constructor.'
      );
    }
    this.config = { ...config };
    this.schema = this.config.schema;
    this.actions = this.config.actions || {};
    this.watchSets = new Map();
    this.currentState = {};
    this.currentErrors = {};
    this.generateState({});
    this.generateErrors();
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

  public get state(): IState {
    return { ...this.currentState };
  }

  public get dispatch(): void {
    return Object.keys(this.actions).reduce(
      (collection, key) => {
        const dispatchAction = (...args: any[]) =>
          this.update(this.actions[key](...args));
        return {
          ...collection,
          [key]: dispatchAction,
        };
      },
      {} as any
    );
  }

  public update(changes: IState): void {
    this.generateState(changes, () => this.executeStateListeners());
    this.generateErrors(() => this.executeErrorListeners());
  }

  private generateState(changes: IState, cb?: () => any): void {
    this.currentState = {
      ...this.defaultSchema(),
      ...this.currentState,
      ...changes,
    };
    if (cb) {
      cb();
    }
  }

  private generateErrors(cb?: () => any) {
    this.currentErrors = Object.keys(this.schema).reduce((collection, key) => {
      const { validate } = this.schema[key];
      const issue: string | null = validate
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
      cb();
    }
  }

  private validateProp(validate: any, value: any, key: string): string | null {
    if (validate.validateSync) {
      try {
        validate.validateSync(value);
      } catch (error) {
        return error.errors[0];
      }
    }
    if (typeof validate === 'function') {
      if (!validate(value)) {
        return `The ${key} is not valid.`;
      }
    }
    return null;
  }

  private defaultSchema() {
    return Object.keys(this.schema).reduce((collection, key) => {
      if (this.schema[key].state) {
        return {
          ...collection,
          [key]: this.schema[key].state,
        };
      }
      return collection;
    }, {});
  }

  private executeStateListeners(): void {
    const clone = { ...this.currentState };
    this.watchSets.forEach(({ state }) => state && state(clone));
  }

  private executeErrorListeners(): void {
    const clone = { ...this.currentErrors };
    if (Object.keys(clone).length) {
      this.watchSets.forEach(({ errors }) => errors && errors(clone));
    }
  }
}
