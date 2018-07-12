import React, { PureComponent, Fragment } from 'react';
import { any, string, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header } from '../components';
import { Sidebar } from '../routing';

class Layout extends PureComponent {
  static propTypes = {
    children: any,
    title: string,
    header: object,
    hideSidebar: bool,
    layout: object,
    appColor: string,
    appName: string,
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
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideSidebar, header } = this.props;

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

    layout.setHeaderVisibility( !!header );
    layout.setHeaderProps( header );
  }

  render() {
    const { children, title, header, hideSidebar, appName } = this.props;

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

        {header && (
          <Header {...header} />
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
