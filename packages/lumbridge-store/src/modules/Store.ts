export interface IState {
  [key: string]: string;
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
    this.regenerateState(changes);
    this.determineErrors();
  }

  private regenerateState(changes: IState): void {
    const clonedState = {
      ...this.currentState,
      ...changes,
    };
    this.currentState = Object.keys(this.schema).reduce((collection, key) => {
      if (!this.schema[key]) {
        return collection;
      }
      const value =
        typeof clonedState[key] === undefined
          ? this.schema[key].state
          : clonedState[key];
      return { ...collection, [key]: value };
    }, {});
    this.executeStateListeners();
  }

  private determineErrors() {
    const tasks = Object.keys(this.schema)
      .map((key: string) => {
        const { validate } = this.schema[key];
        const value = this.currentState[key];
        if (validate) {
          if (validate.validate) {
            return [key, validate.validate()];
          }
          if (typeof validate === 'function' && !validate(value)) {
            return [key, `The ${key} is not valid.`];
          }
        }
        return [];
      })
      .filter(schema => schema.length);
    Promise.all(tasks.map(schema => schema[1])).then(errors => {
      this.currentErrors = errors.reduce((collection, error, index) => {
        const name = tasks[index][0] as string;
        return {
          ...collection,
          [name]: error,
        };
      }, {});
      this.executeErrorListeners();
    });
  }

  private executeStateListeners(): void {
    this.watchSets.forEach(
      ({ state }) => state && state({ ...this.currentState })
    );
  }

  private executeErrorListeners(): void {
    this.watchSets.forEach(
      ({ errors }) => errors && errors({ ...this.currentErrors })
    );
  }
}
