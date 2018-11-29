import { expect } from 'lumbridge-core';
import { Instance, IExecute, IMethod } from './Instance';

export interface IMethods {
  [name: string]: IMethod;
}

export interface IConfig {
  methods: IMethods;
}

export interface IInstances {
  [name: string]: (map: IExecute) => Instance;
}

export default class Persistor {
  public static create(config: IConfig): Persistor {
    return new Persistor(config);
  }

  public instance: IInstances;
  private config: IConfig;
  private methods: IMethods;

  constructor(config: IConfig) {
    expect.type('config', config, 'object');
    expect.type('config.methods', config.methods, 'object');
    this.config = { ...config };
    this.methods = this.config.methods;
    this.instance = this.createInstances();
  }

  private createInstances(): IInstances {
    return Object.keys(this.methods).reduce((collection, key) => {
      const createInstance = (map: IExecute) =>
        Instance.create({ mapped: map, method: this.methods[key] });
      return {
        ...collection,
        [key]: createInstance,
      };
    }, {});
  }
}
