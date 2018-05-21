import React, { Component, Fragment } from 'react';
import { oneOf, node, object, string, bool } from 'prop-types';
import { LayoutConsumer } from '../layout';

class Layout extends Component {
  static propTypes = {
    children: node,
    appColor: oneOf(
      ['light', 'dark']
    ),
    // backgroundColor: oneOf(
    // ['white', 'grey']
    // ),
    title: string,
    layout: object,
    hideHeader: bool,
    hideSidebar: bool,
  }

  componentDidMount() {
    this.checkForLayoutChanges();
  }

  checkForLayoutChanges() {
    const { layout, title, appColor, hideHeader, hideSidebar } = this.props;

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

    layout.setSidebarVisibility( hideSidebar );
    layout.setHeaderVisibility( hideHeader );
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

export default props => (
  <LayoutConsumer>
    {layout => (
      <Layout {...props} layout={layout} />
    )}
  </LayoutConsumer>
);
