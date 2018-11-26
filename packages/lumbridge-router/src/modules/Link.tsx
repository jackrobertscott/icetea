import * as React from 'react';
import history from '../utils/history';

interface ILinkProps {
  to: string;
  replace?: boolean;
}

export default class Link extends React.Component<ILinkProps> {
  public render() {
    const extraProps = this.extractLinkProps();
    return <a {...extraProps} onClick={this.handleClick} />;
  }

  private handleClick = (event: any): void => {
    const { to, replace } = this.props;
    const mouseLeftButton = 0;
    if (event.button === mouseLeftButton) {
      event.preventDefault();
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };

  private extractLinkProps = (): object => {
    const { to, replace, ...args } = this.props;
    return args || {};
  };
}
