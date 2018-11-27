import * as React from 'react';
import history from '../utils/history';

export interface ILinkProps {
  to: string;
  replace?: boolean;
}

export default class Link extends React.Component<ILinkProps> {
  public render() {
    const { to, replace, ...extraProps } = this.props;
    return <a {...extraProps} href={to} onClick={this.handleClick} />;
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
}
