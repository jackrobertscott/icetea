interface IState {
  [key: string]: string;
}

interface ISchema {
  [key: string]: {
    default: string;
    validate?: () => boolean;
  };
}

interface IConfig {
  schema: ISchema;
}

interface IWatchable {
  state?: (state: IState) => any;
  errors?: () => any;
}

export default class Store {
  public static create(config: IConfig): Store {
    return new Store(config);
  }

  private config: IConfig;
  private schema: ISchema;
  private currentState: IState;
  private watchSets: Map<number, IWatchable>;

  constructor(config: IConfig) {
    this.config = { ...config };
    this.schema = this.config.schema;
    this.watchSets = new Map();
    this.currentState = {};
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
    this.updateState(changes);
    this.executeListeners();
  }

  private updateState(changes: IState): IState {
    this.currentState = {
      ...this.currentState,
      ...changes,
    };
    return this.currentState;
  }

  private executeListeners(): void {
    this.watchSets.forEach(({ state, errors }) => {
      if (state) {
        state({ ...this.currentState });
      }
      if (errors) {
        errors();
      }
    });
  }
}
