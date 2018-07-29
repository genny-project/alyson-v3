import React, { Component, Fragment } from 'react';
import { shape, object, any, bool } from 'prop-types';
import Layout from '../../layout';
import DataQuery from '../../../utils/data-query';
import { store } from '../../../redux';
import { Box, Text, Timeout, Button, ActivityIndicator } from '../../components';
import Recursive from './Recursive';

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
  }

  handleRetry = () => {
    if ( this.timeout )
      this.timeout.startTimeout();
  }

  render() {
    const { layout, data, navigation, sublayoutProps, sublayout } = this.props;

    if ( !layout ) {
      return (
        <Layout
          title="Loading..."
          appColor="dark"
          header={{ variant: 'default' }}
          sidebar={{ variant: 'default' }}
        >
          <Timeout
            duration={60000}
            ref={timeout => this.timeout = timeout}
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
                    <ActivityIndicator size="large" />

                    <Box height={10} />

                    <Text align="center">
                      Loading...
                    </Text>

                    <Box height={10} />

                    {secondsElapsed > 5 ? (
                      <Text align="center">
                        {secondsElapsed > 30 ? 'Still loading - please wait a little longer...'
                        : secondsElapsed > 20 ? 'Still loading - please wait...'
                        : secondsElapsed > 10 ? 'Still loading...'
                        : 'This is taking longer than usual...'}
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
      query: new DataQuery( data ).query(
        layout.query || [],
        { navigation: navigation && navigation.state ? navigation.state.params : {} }
      ),
      navigation: {
        ...( navigation && navigation.state && navigation.state.params ) || {},
        ...currentRouteParams,
      },
      props: sublayoutProps,
    };

    const Holder = sublayout ? Box : Layout;

    return (
      <Holder
        {...layout.layout}
        context={context}
      >
        {(
          layout.children != null &&
          layout.children instanceof Array
        )
          ? layout.children.map(( child, index ) => (
            <Recursive
              key={index} // eslint-disable-line react/no-array-index-key
              {...child}
              context={context}
            />
          ))
          : (
            layout.children ||
            null
          )}
      </Holder>
    );
  }
}

export default LayoutLoader;
