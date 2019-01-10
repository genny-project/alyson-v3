/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import { shape, object, any, bool , func } from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native-web';

import Layout from '../../layout';
import { openSidebar } from '../../../redux/actions';
import { isArray, curlyBracketParse, getDeviceSize } from '../../../utils';
import DataQuery from '../../../utils/data-query';
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

const windowDimensions = Dimensions.get( 'window' );
const screenDimensions = Dimensions.get( 'screen' );

class LayoutLoader extends PureComponent {
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

  static getDerivedStateFromProps( props, state ) {
    const result = {};

    if (
      state.sidebar.left.isOpen !== props.sidebar.left.isOpen ||
      state.sidebar.right.isOpen !== props.sidebar.right.isOpen
    ) {
      result.sidebar = props.sidebar;
    }

    if (
      props.router &&
      props.router.location.state && (
        !state.navigation ||
        props.router.location.state != state.navigation
      )
    ) {
      result.navigation = props.router.location.state;
    }

    if ( props.sublayoutProps != state.props )
      result.props = props.sublayoutProps;

    return Object.keys( result ).length > 0 ? result : null;
  }

  /* eslint-disable react/sort-comp */

  handleOpenSidebar = side => () => {
    this.props.openSidebar( side );
  }

  /* eslint-enable react/sort-comp */

  state = {
    query: {},
    navigation: null,
    time: timeUtils,
    user: this.props.data.user,
    sidebar: this.props.sidebar,
    actions: {
      openSidebar: this.handleOpenSidebar( 'left' ),
      openSidebarRight: this.handleOpenSidebar( 'right' ),
    },
    props: this.props.sublayoutProps,
    media: {
      window: windowDimensions,
      screen: screenDimensions,
      size: getDeviceSize(),
    },
  }

  // shouldComponentUpdate( nextProps, nextState ) {
  //   console.warn( 'LayoutLoader', nextProps != this.props, {
  //     data: nextProps.data == this.props.data ,
  //     router: nextProps.router == this.props.router ,
  //     sidebar: nextProps.sidebar == this.props.sidebar ,
  //     state: this.state == nextState,
  //   }, { this: this.state, next: nextState });

  //   return true;
  // }

  componentDidUpdate( prevProps ) {
    if (
      this.props.layout && (
        this.props.data != prevProps.data ||
        this.props.layout != prevProps.layout
      )
    ) {
      this.doDataQuery();
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener( 'change' );
  }

  shouldPullFromCache() {
    const { layout, data } = this.props;

    if ( layout.cache ) {
      const { id, key } = layout.cache;

      /* Check that the browser has local storage support */
      if ( typeof localStorage === 'undefined' ) {
        return false;
      }

      /* Check the cache exists */
      if ( !localStorage.getItem( `cache-${id}` )) {
        return false;
      }

      const existingCache = JSON.parse( localStorage.getItem( `cache-${id}` ));

      /* Check whether the cache has expired */
      if ( existingCache.expiry < new Date().getTime()) {
        return false;
      }

      /* Calculate the key and see if it matches the previous key */
      const newKey = curlyBracketParse( key, data );

      /* Check whether the keys match */
      if ( newKey !== existingCache.key ) {
        return false;
      }

      return true;
    }

    return false;
  }

  shouldStoreCache( result ) {
    const { onlyStoreIf } = this.props.layout.cache;

    if ( !onlyStoreIf ) {
      return true;
    }

    const existing = onlyStoreIf.filter( key => result[key] == null );

    return existing.length === 0;
  }

  doDataQuery() {
    const { data, layout } = this.props;

    /* Check whether we should pull the data from the cache */
    const shouldPullFromCache = this.shouldPullFromCache();

    if ( shouldPullFromCache ) {
      const cachedData = JSON.parse( localStorage.getItem( `cache-${layout.cache.id}` )).data;

      this.setState({ query: cachedData });
    } else {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const query = new DataQuery( data ).query( layout.query, this.state );

      /* Store the data in the cache */
      if ( layout.cache ) {
        if ( this.shouldStoreCache( query )) {
          localStorage.setItem( `cache-${layout.cache.id}`, JSON.stringify({
            key: curlyBracketParse( layout.cache.key, data ),
            expiry: new Date().getTime() + layout.cache.expiry * 1000,
            data: query,
          }));
        }
      }

      this.setState({ query });
    }
  }

  handleRetry = () => {
    if ( this.timeout ) this.timeout.startTimeout();
  };

  render() {
    const {
      layout,
      sublayout,
      isDialog,
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

    // const { routes, index } = store.getState().navigation;
    // const currentRoute = routes && routes[index];
    // const currentRouteParams = currentRoute && currentRoute.params;

    /**
     * TODO:
     *
     * Move the context object into state so it doesn't happen every render
     */

    /* Calculate the data for the layout */

    const Holder = (
      sublayout ||
      isDialog
    )
      ? Fragment
      : Layout;

    return (
      <Holder
        {...layout.layout}
        context={this.state}
      >
        {isArray( layout.children ) ? (
          layout.children.map(( child, index ) => (
            <Recursive
              key={index} // eslint-disable-line react/no-array-index-key
              {...child}
              context={this.state}
            />
          ))
        ) : layout.children}
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
