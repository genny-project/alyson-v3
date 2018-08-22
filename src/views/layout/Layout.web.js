import React, { Component, Fragment } from 'react';
import { any, string, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header } from '../components';
import { shallowCompare } from '../../utils';
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
    }

    if ( !shallowCompare( this.props.header, prevProps.header )) {
      this.setHeaderProperties();
    }

    if (
      this.state.unableToFindHeader &&
      this.props.header &&
      this.props.header.variant
    ) {
      const variant = `header-${this.props.header.variant}`;

      if ( this.props.layouts.sublayouts[variant] )
        this.setHeaderProperties();
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideSidebar, backgroundColor } = this.props;

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

    layout.setBackgroundColor( backgroundColor || '#FFF' );

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( false );
    }

    this.setHeaderProperties();
  }

  setHeaderProperties() {
    const { header, layouts } = this.props;

    if ( header && header.variant ) {
      const variant = `header-${header.variant}`;
      const headerProps = layouts.sublayouts[variant];

      if ( headerProps ) {
        this.props.layout.setHeaderProps( headerProps );
        this.props.layout.setHeaderVisibility( true );

        if ( this.state.unableToFindHeader )
          this.setState({ unableToFindHeader: false });
      }
      else {
        this.setState({ unableToFindHeader: true });
      }
    }
    else {
      this.props.layout.setHeaderVisibility( false );
    }
  }

  render() {
    const { children, title, layout, hideSidebar, appName } = this.props;
    const { headerProps, showHeader } = layout;

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

          <style>
            {`
              html,
              body {
                background: ${layout.backgroundColor} !important
              }
            `}
          </style>
        </Helmet>

        {(
          showHeader &&
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
  layouts: state.vertx.layouts,
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
