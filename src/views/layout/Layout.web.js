import React, { Component, Fragment } from 'react';
import { any, string, bool } from 'prop-types';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header, Sidebar } from '../routing';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
    hideHeader: bool,
    hideSidebar: bool,
  }

  render() {
    const { children, title, hideHeader, hideSidebar } = this.props;

    return (
      <LayoutConsumer>
        {() => (
          <Fragment>
            <Helmet>
              <title>{title}</title>
            </Helmet>

            {!hideHeader && (
              <Header />
            )}

            {!hideSidebar && (
              <Sidebar />
            )}

            {children}
          </Fragment>
        )}
      </LayoutConsumer>
    );
  }
}

export default Layout;
