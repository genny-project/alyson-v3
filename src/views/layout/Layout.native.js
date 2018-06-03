import React, { Component, Fragment } from 'react';
import { oneOf, node, object, string, bool } from 'prop-types';
import { withNavigation } from 'react-navigation';
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
    navigation: object,
  }

  componentDidMount() {
    this.setLayoutProperties();
  }

  componentDidUpdate( prevProps ) {
    if (
      this.props.appColor !== prevProps.appColor &&
      this.props.appColor != null
    ) {
      this.props.layout.setAppColor( this.props.appColor );
    }

    if (
      this.props.title !== prevProps.title &&
      this.props.title != null
    ) {
      this.props.layout.setTitle( this.props.title );
    }

    if (
      prevProps.hideHeader === true &&
      this.props.hideHeader == null &&
      this.props.navigation != null
    ) {
      this.props.navigation.setParams({
        hideHeader: false,
      });

      this.props.layout.setHeaderVisibility( false );
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideHeader, hideSidebar, navigation } = this.props;

    if ( !layout )
      return;

    if (
      typeof title === 'string' &&
      title.length > 0
    ) {
      layout.setTitle( title );

      if ( this.props.navigation ) {
        this.props.navigation.setParams({
          hideHeader: true,
        });
      }
    }

    if (
      typeof appColor === 'string' &&
      appColor.length > 0
    ) {
      layout.setAppColor( appColor );
    }

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( true );
    }

    if ( hideHeader !== layout.hideHeader ) {
      layout.setHeaderVisibility( hideHeader );

      if ( navigation ) {
        this.props.navigation.setParams({
          hideHeader: hideHeader,
        });
      }
    }
    else if ( hideHeader == null ) {
      layout.setHeaderVisibility( true );

      if ( navigation ) {
        this.props.navigation.setParams({
          hideHeader: false,
        });
      }
    }
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

export default withNavigation(
  props => (
    <LayoutConsumer>
      {layout => (
        <Layout {...props} layout={layout} />
      )}
    </LayoutConsumer>
  )
);
