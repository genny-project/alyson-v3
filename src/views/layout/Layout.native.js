import React, { Component, Fragment } from 'react';
import { any } from 'prop-types';

class Layout extends Component {
  static propTypes = {
    children: any,
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}

export default Layout;
