import React, { Component, Fragment } from 'react';
import { oneOf, node, object, string, bool } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { store } from '../../redux';
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
    header: object,
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

      this.props.navigation.setParams({
        title: this.props.title,
      });
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, header, hideSidebar, navigation } = this.props;

    if ( !layout )
      return;

    if (
      typeof title === 'string' &&
      title.length > 0
    ) {
      layout.setTitle( title );

      if ( navigation ) {
        navigation.setParams({
          hideHeader: true,
          title,
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

    layout.setHeaderVisibility( !!header );

    if ( header.variant ) {
      const { attributes } = store().getState().vertx.baseEntities;
      const keys = Object.keys( attributes );

      for ( let i = 0; i < keys.length; i++ ) {
        const attribute = keys[i];

        if ( attribute.startsWith( 'LAY_' )) {
          if ( attributes[attribute].LAYOUT_URI.value === `sublayouts/header-${header.variant}/` ) {
            const layout = attributes[attribute].PRI_LAYOUT_DATA.value;

            console.warn({ layout });

            let parsed = null;

            try {
              parsed = JSON.parse( layout );
              layout.setHeaderProps( parsed );
            }
            catch ( e ) {
              console.warn( 'Unable to parse header layout data', layout );
            }

            break;
          }
        }
      }

      layout.setHeaderProps( header );
    }

    if ( navigation ) {
      navigation.setParams({
        showHeader: !!header,
        headerProps: header,
      });
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
        <Layout
          {...props}
          layout={layout}
        />
      )}
    </LayoutConsumer>
  )
);
