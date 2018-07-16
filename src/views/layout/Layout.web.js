import React, { Component, Fragment } from 'react';
import { any, string, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header } from '../components';
import { removeStartingAndEndingSlashes, shallowCompare } from '../../utils';
import { Sidebar } from '../routing';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
    header: object,
    hideSidebar: bool,
    layout: object,
    appColor: string,
    appName: string,
    baseEntities: object,
    headerProps: object,
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
    const { layout, title, appColor, hideSidebar } = this.props;

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

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( false );
    }

    this.setHeaderProperties();
  }

  setHeaderProperties() {
    const { header } = this.props;

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
            }

            break;
          }
        }
      }
    }
    else {
      this.props.layout.setHeaderVisibility( false );
    }
  }

  render() {
    const { children, title, layout, hideSidebar, appName } = this.props;
    const { headerProps } = layout;

    return (
      <Fragment>
        <Helmet>
          <title>
            {(
              !appName ||
              title === appName
            )
              ? title
              : `${title} | ${appName}`}
          </title>
        </Helmet>

        {(
          headerProps != null &&
          Object.keys( headerProps ).length > 0
        ) && (
          <Header {...headerProps} />
        )}

        {!hideSidebar && (
          <Sidebar />
        )}

        {children}
      </Fragment>
    );
  }
}

export { Layout };

const mapStateToProps = state => ({
  appName: state.layout.appName,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )(
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
