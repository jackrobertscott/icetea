interface IStyles {
  [cssProperty: string]: string;
}

interface IConfig {
  base?: IStyles;
  mutations?: {
    [name: string]: IStyles;
  };
  combos?: {
    [name: string]: (props: any) => object;
  };
}

export default class Persistor {
  public static create(config: IConfig): Persistor {
    return new Persistor(config);
  }

  protected config: IConfig;

  constructor(config: IConfig) {
    if (!config) {
      throw new Error('Expected config object to be given to constructor.');
    }
    this.config = config;
  }
}
