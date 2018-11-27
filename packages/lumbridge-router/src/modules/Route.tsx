import * as React from 'react';
import { IRoute } from './Router';

export interface IRouteProps {
  currentRoute: () => IRoute | null;
  history: {
    listen: any;
  };
}

export interface IRouteState {
  location: any;
}

export interface ILocation {
  pathname: string;
  search: string;
  hash: string;
}

export default class Route extends React.Component<IRouteProps, IRouteState> {
  private unlisten?: () => void;

  constructor(props: IRouteProps) {
    super(props);
    this.state = {
      location: null,
    };
  }

  public componentDidMount() {
    this.unlisten = this.props.history.listen((location: ILocation) => {
      this.setState({ location });
    });
  }

  public componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  public render() {
    const CurrentRoute =
      (this.props.currentRoute() || ({} as any)).component || React.Fragment;
    return <CurrentRoute />;
  }
}
