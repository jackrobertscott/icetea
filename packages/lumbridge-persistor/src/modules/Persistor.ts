import { expect } from '../utils/types';
import { Instance, IExecute, IMethod } from './Instance';

export interface IMethods {
  [name: string]: IMethod;
}

export interface IConfig {
  methods: IMethods;
}

export default class Persistor {
  public static create(config: IConfig): Persistor {
    return new Persistor(config);
  }

  private config: IConfig;
  private methods: IMethods;

  constructor(config: IConfig) {
    expect('config', config, 'object');
    expect('config.methods', config.methods, 'object');
    this.config = { ...config };
    this.methods = this.config.methods;
  }

  public get map(): void {
    return Object.keys(this.methods).reduce(
      (collection, key) => {
        const createInstance = (mapped: IExecute) =>
          Instance.create({ mapped, method: this.methods[key] });
        return {
          ...collection,
          [key]: createInstance,
        };
      },
      {} as any
    );
  }
}
