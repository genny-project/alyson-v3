import React, { Component } from 'react';
import { shape, object, any, bool , func } from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../layout';
import { openSidebar } from '../../../redux/actions';
import { isArray } from '../../../utils';
import DataQuery from '../../../utils/data-query';
import { store } from '../../../redux';
import { Box, Text, Timeout, Button, ActivityIndicator, Fragment } from '../../components';
import Recursive from './Recursive';

const currentHourOfDay = new Date().getHours();

const timeUtils = {
  timeOfDay: (
    currentHourOfDay < 6 ? 'evening'
    : currentHourOfDay < 12 ? 'morning'
    : currentHourOfDay < 18 ? 'afternoon'
    : 'evening'
  ),
};

class LayoutLoader extends Component {
  static propTypes = {
    layout: shape({
      layout: object,
      children: any,
      context: any,
    }),
    data: object,
    navigation: object,
    sublayoutProps: object,
    sublayout: bool,
    router: object,
    isDialog: bool,
    sidebar: object,
    openSidebar: func,
    context: object,
  };

  handleRetry = () => {
    if ( this.timeout ) this.timeout.startTimeout();
  };

  handleOpenSidebar = () => {
    this.props.openSidebar( 'left' );
  }

  handleOpenSidebarRight = () => {
    this.props.openSidebar( 'right' );
  }

  render() {
    const {
      layout,
      data,
      navigation,
      router,
      sublayoutProps,
      sublayout,
      isDialog,
      sidebar,
    } = this.props;

    if ( !layout ) {
      if (
        sublayout ||
        isDialog
      ) {
        return (
          <Box
            width="100%"
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <ActivityIndicator size="large" />
          </Box>
        );
      }

      return (
        <Layout
          title="Loading..."
          appColor="dark"
          header={{ variant: 'default' }}
          sidebar={{ variant: 'default' }}
        >
          <Timeout
            duration={60000}
            ref={timeout => ( this.timeout = timeout )}
          >
            {({ isTimeUp, secondsElapsed }) => (
              <Box
                justifyContent="center"
                alignItems="center"
                height="100%"
                flex={1}
                flexDirection="column"
              >
                {isTimeUp ? (
                  <Fragment>
                    <Text align="center">
                      Sorry! We were unable to load this page.
                    </Text>

                    <Box height={10} />

                    <Text align="center">
                      Please check your internet connection and try again.
                    </Text>

                    <Box height={20} />

                    <Button
                      color="blue"
                      onPress={this.handleRetry}
                    >
                      Retry
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Box padding={10}>
                      <ActivityIndicator size="large" />
                    </Box>

                    <Box marginBottom={10}>
                      <Text align="center">
                        Loading...
                      </Text>
                    </Box>

                    {secondsElapsed > 5 ? (
                      <Text align="center">
                        {secondsElapsed < 10 ? 'This is taking longer than usual...'
                        : secondsElapsed < 20 ? 'Still loading - please wait...'
                        : secondsElapsed < 30 ? 'Still loading...'
                        : 'Still loading - please wait a little longer...'}
                      </Text>
                    ) : null}
                  </Fragment>
                )}
              </Box>
            )}
          </Timeout>
        </Layout>
      );
    }

    const { routes, index } = store.getState().navigation;
    const currentRoute = routes && routes[index];
    const currentRouteParams = currentRoute && currentRoute.params;

    /**
     * TODO:
     *
     * Move the context object into state so it doesn't happen every render
     */

    /* Calculate the data for the layout */
    const context = {
      ...this.props.context,
      query: new DataQuery( data ).query( layout.query || [], {
        navigation: {
          ...(( navigation && navigation.state && navigation.state.params ) || {}),
          ...(( router && router.location && router.location.state ) || {}),
          ...currentRouteParams,
        },
        props: sublayoutProps,
        user: data.user,
      }),
      navigation: {
        ...(( navigation && navigation.state && navigation.state.params ) || {}),
        ...(( router && router.location && router.location.state ) || {}),
        ...currentRouteParams,
      },
      props: sublayoutProps,
      time: timeUtils,
      user: data.user,
      sidebar,
      actions: {
        openSidebar: this.handleOpenSidebar,
        openSidebarRight: this.handleOpenSidebarRight,
      },
    };

    const Holder = (
      sublayout ||
      isDialog
    )
      ? Fragment
      : Layout;

    return (
      <Holder
        {...layout.layout}
        context={context}
      >
        {isArray( layout.children ) ? (
          layout.children.map(( child, index ) => (
            <Recursive
              key={index} // eslint-disable-line react/no-array-index-key
              {...child}
              context={context}
            />
          ))
        ) : layout.children || null}
      </Holder>
    );
  }
}

const mapStateToProps = state => ({
  data: state.vertx,
  router: state.router,
  sidebar: state.sidebar,
});

export default connect( mapStateToProps, { openSidebar })( LayoutLoader );
