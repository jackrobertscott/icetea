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

export default class Router {
  public static create(config: IConfig): Router {
    return new Router(config);
  }

  protected config: IConfig;

  constructor(config: IConfig) {
    if (!config) {
      throw new Error('Expected config object to be given to constructor.');
    }
    this.config = config;
  }
}
