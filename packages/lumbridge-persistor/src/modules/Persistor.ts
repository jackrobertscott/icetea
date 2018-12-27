import { expect } from 'lumbridge-core';
import Instance, { IInstanceAction, IInstanceCommon } from './Instance';

export interface IPersistorConfig {
  actions: IInstanceAction[];
}

export interface IPersistorInstanceConfig {
  action: string;
  common?: IInstanceCommon;
}

export default class Persistor {
  public static create(config: IPersistorConfig): Persistor {
    return new Persistor(config);
  }

  private actions: IInstanceAction[];

  constructor({ actions }: IPersistorConfig) {
    expect.type('config.actions', actions, 'object');
    this.actions = actions;
  }

  public action(item: IInstanceAction): Persistor {
    this.actions.push(item);
    return this;
  }

  /**
   * @deprecated use persistor.on instead.
   */
  public instance({ action: name, common }: IPersistorInstanceConfig) {
    expect.type('action', name, 'string');
    expect.type('common', common, 'function', true);
    const action = this.actions.find((item: IInstanceAction) => {
      return name === item.name;
    });
    if (!action) {
      const options: string = this.actions
        .map(({ name: actionName }) => actionName)
        .join(', ');
      const message = `Action of name "${action}" does not exist on persistor. Options are: [${options}].`;
      throw new Error(message);
    }
    return Instance.create({ action, common });
  }

  public get on() {
    return this.actions.reduce(
      (actionables, action) => ({
        ...actionables,
        [action.name]: (common: any) => Instance.create({ action, common }),
      }),
      {}
    );
  }
}
