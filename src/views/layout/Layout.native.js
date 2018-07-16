import React, { Component, Fragment } from 'react';
import { oneOf, node, object, string, bool } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { LayoutConsumer } from '../layout';
import shallowCompare from '../../utils/shallow-compare';
import removeStartingAndEndingSlashes from '../../utils/string/removeStartingAndEndingSlashes';

class Layout extends Component {
  static propTypes = {
    children: node,
    appColor: oneOf(
      ['light', 'dark']
    ),
    title: string,
    layout: object,
    header: object,
    hideSidebar: bool,
    navigation: object,
    baseEntities: object,
  }

  state = {
    hasLoadedLayouts: false,
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

    if ( !shallowCompare( this.props.header, prevProps.header )) {
      this.setHeaderProperties();
    }

    if ( !this.state.hasLoadedLayouts ) {
      const hasNowLoadedLayouts = (
        Object
          .keys( this.props.baseEntities.attributes )
          .find( attribute => attribute.startsWith( 'LAY_' ))
      );

      if (
        hasNowLoadedLayouts &&
        this.props.header != null
      ) {
        this.setHeaderProperties();
      }
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideSidebar, navigation } = this.props;

    if ( !layout )
      return;

    if (
      typeof title === 'string' &&
      title.length > 0
    ) {
      layout.setTitle( title );

      if ( navigation ) {
        navigation.setParams({ title });
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
  }

  setHeaderProperties() {
    const { header, navigation } = this.props;

    if ( header && header.variant ) {
      const { attributes } = this.props.baseEntities;
      const keys = Object.keys( this.props.baseEntities.attributes );

      for ( let i = 0; i < keys.length; i++ ) {
        if ( keys[i].startsWith( 'LAY_' )) {
          if ( !this.state.hasLoadedLayouts ) {
            this.setState({ hasLoadedLayouts: true });
          }

          const attribute = attributes[keys[i]];
          const layoutPath = removeStartingAndEndingSlashes( attribute.PRI_LAYOUT_URI.value );

          if (
            layoutPath === `header/header.${header.variant}` ||
            layoutPath === `sublayouts/header-${header.variant}`
          ) {
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
              this.props.layout.setHeaderVisibility( true );

              if ( navigation ) {
                navigation.setParams({
                  headerProps: parsed,
                  showHeader: true,
                });
              }
            }

            break;
          }
        }
      }
    }
    else {
      this.props.layout.setHeaderVisibility( false );

      if ( navigation ) {
        navigation.setParams({
          showHeader: false,
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
