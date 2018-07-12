import React, { Component, Fragment } from 'react';
import { oneOf, node, object, string, bool } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
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
    baseEntities: object,
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

    this.setHeaderProperties();

    layout.setHeaderVisibility( !!header );

    if ( navigation ) {
      navigation.setParams({
        showHeader: !!header,
      });
    }
  }

  setHeaderProperties() {
    const { header, navigation } = this.props;

    if ( header && header.variant ) {
      const { attributes } = this.props.baseEntities;
      const keys = Object.keys( this.props.baseEntities.attributes );

      for ( let i = 0; i < keys.length; i++ ) {
        if ( keys[i].startsWith( 'LAY_' )) {
          const attribute = attributes[keys[i]];

          if ( attribute.PRI_LAYOUT_URI.value === `sublayouts/header-${header.variant}/` ) {
            const layout = attribute.PRI_LAYOUT_DATA.valueString;

            let parsed = null;

            try {
              parsed = JSON.parse( layout );
            }
            catch ( e ) {
              console.warn( 'Unable to parse header layout data', layout );
            }

            if ( parsed ) {
              this.props.layout.setHeaderProps( parsed );

              if ( navigation ) {
                navigation.setParams({
                  headerProps: parsed,
                });
              }
            }

            break;
          }
        }
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

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default (
  connect( mapStateToProps )(
    withNavigation(
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
    )
  )
);
