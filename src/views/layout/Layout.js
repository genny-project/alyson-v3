import React, { Component, Fragment } from 'react';
import { any, string } from 'prop-types';
import Helmet from 'react-helmet';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
  }

  render() {
    const { children, title } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {children}
      </Fragment>
    );
  }
}

export default Layout;
