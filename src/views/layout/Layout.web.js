import React, { Component, Fragment } from 'react';
import { any, string, bool, object } from 'prop-types';
import Helmet from 'react-helmet';
import config from '../../config';
import LayoutConsumer from './consumer';
import { Header, Sidebar } from '../routing';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
    hideHeader: bool,
    hideSidebar: bool,
    layout: object,
    appColor: string,
  }

  componentDidMount() {
    this.checkForLayoutChanges();
  }

  checkForLayoutChanges() {
    const { layout, title, appColor } = this.props;

    if (
      typeof title === 'string' &&
      title.length > 0
    ) {
      layout.setTitle( title );
    }

    if (
      typeof appColor === 'string' &&
      appColor.length > 0
    ) {
      layout.setAppColor( appColor );
    }
  }

  render() {
    const { children, title, hideHeader, hideSidebar } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>
            {title === config.app.name
              ? title
              : `${title} | ${config.app.name}`}
          </title>
        </Helmet>

        {!hideHeader && (
          <Header />
        )}

        {!hideSidebar && (
          <Sidebar />
        )}

        {children}
      </Fragment>
    );
  }
}

export default props => (
  <LayoutConsumer>
    {layout => (
      <Layout {...props} layout={layout} />
    )}
  </LayoutConsumer>
);
