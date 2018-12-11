import { expect } from 'lumbridge-core';
import Instance, { IExecute, IMethod } from './Instance';

export interface IMethods {
  [name: string]: IMethod;
}

export interface IConfig {
  methods: IMethods;
}

export interface IPersistorInstanceConfig {
  name: string;
  map?: (map: IExecute) => {
    [name: string]: any
  };
}

export default class Persistor {
  public static create(config: IConfig): Persistor {
    return new Persistor(config);
  }

  private config: IConfig;
  private methods: IMethods;

  constructor(config: IConfig) {
    expect.type('config', config, 'object');
    expect.type('config.methods', config.methods, 'object');
    this.config = { ...config };
    this.methods = this.config.methods;
  }

  public instance(config: IPersistorInstanceConfig) {
    expect.type('instance.config.map', config.map, 'function', true);
    const method = this.methods[config.name];
    if (!method) {
      const options: string = Object.keys(this.methods).join(', ');
      throw new Error(
        `The method "${
          config.name
        }" does not exist on persistor (options are: [${options}]).`
      );
    }
    return Instance.create({ mapped: config.map, method });
  }
}
