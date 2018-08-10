import React, { Component, Fragment } from 'react';
import { Dimensions } from 'react-native';
import { oneOf, node, object, string, bool } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { LayoutConsumer } from '../layout';
import { Box } from '../components';
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
    sidebar: object,
    hideSidebar: bool,
    navigation: object,
    baseEntities: object,
    backgroundColor: string,
    layouts: object,
  }

  state = {
    unableToFindHeader: false,
  }

  componentDidMount() {
    this.setLayoutProperties();
    this.setHeaderProperties();
  }

  componentDidUpdate( prevProps ) {
    if (
      this.props.appColor !== prevProps.appColor &&
      this.props.appColor != null
    ) {
      this.props.layout.setAppColor( this.props.appColor );
    }

    if (
      this.props.backgroundColor !== prevProps.backgroundColor &&
      this.props.backgroundColor != null
    ) {
      this.props.layout.setBackgroundColor( this.props.backgroundColor );
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

    if ( !shallowCompare( this.props.sidebar, prevProps.sidebar )) {
      this.setSidebarProperties();
    }

    if ( this.state.unableToFindHeader ) {
      const variant = `header-${this.props.header.variant}`;

      if ( this.props.layouts.sublayouts[variant] )
        this.setHeaderProperties();
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideSidebar, navigation, backgroundColor } = this.props;

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

    if (
      typeof backgroundColor === 'string' &&
      backgroundColor.length > 0
    ) {
      layout.setBackgroundColor( backgroundColor );
    }

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( true );
    }
  }

  setHeaderProperties() {
    const { header, navigation, layouts } = this.props;

    if ( header && header.variant ) {
      const variant = `header-${header.variant}`;
      const headerProps = layouts.sublayouts[variant];

      if ( headerProps ) {
        this.props.layout.setHeaderProps( headerProps );
        this.props.layout.setHeaderVisibility( true );

        if ( this.state.unableToFindHeader )
          this.setState({ unableToFindHeader: false });

        if ( navigation ) {
          navigation.setParams({
            headerProps,
            showHeader: true,
          });
        }
      }
      else {
        this.setState({ unableToFindHeader: true });
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

  setSidebarProperties() {
    const { sidebar, navigation } = this.props;

    if ( sidebar && sidebar.variant ) {
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
            layoutPath === `sidebar/sidebar.${sidebar.variant}` ||
            layoutPath === `sublayouts/sidebar-${sidebar.variant}`
          ) {
            const layout = attribute.PRI_LAYOUT_DATA.valueString;
            let parsed = null;

            try {
              parsed = JSON.parse( layout );
            }
            catch ( e ) {
              console.warn( 'Unable to parse sidebar layout data', layout );
            }

            if ( parsed ) {
              this.props.layout.setSidebarProps( parsed );
              this.props.layout.setSidebarVisibility( true );

              if ( navigation ) {
                navigation.setParams({
                  sidebarProps: parsed,
                  showSidebar: true,
                });
              }
            }

            break;
          }
        }
      }
    }
    else {
      this.props.layout.setSidebarVisibility( false );

      if ( navigation ) {
        navigation.setParams({
          showSidebar: false,
        });
      }
    }
  }

  render() {
    const { children, layout } = this.props;
    const { width, height } = Dimensions.get( 'window' );

    return (
      <Fragment>
        {/* This is here to fix a bug with React Navigation showing `cardStyle` styling
         * from `StackNavigator` over the app's background color, but only for . */}
        <Box
          height={height}
          width={width}
          position="absolute"
          top={0}
          left={0}
          zIndex={0}
          backgroundColor={layout.backgroundColor}
        />

        {children}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  layouts: state.vertx.layouts,
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
