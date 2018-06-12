import React, { PureComponent, Fragment } from 'react';
import { ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { shape, object, any } from 'prop-types';
import Layout from '../../layout';
import { refresh } from '../../../utils';
import DataQuery from '../../../utils/data-query';
import { Box, Text, Timeout, Button } from '../../components';
import Recursive from './Recursive';

class LayoutLoader extends PureComponent {
  static propTypes = {
    layout: shape({
      layout: object,
      children: any,
      context: any,
    }),
    data: object,
    navigation: object,
  }

  handleRetry = () => {
    refresh();
  }

  render() {
    const { layout, data, navigation } = this.props;

    if ( !layout ) {
      return (
        <Layout
          title="Loading..."
          hideHeader
          appColor="light"
        >
          <Timeout duration={60000}>
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

    /* Calculate the data for the layout */
    const context = {
      query: new DataQuery( data ).query(
        layout.query || [], { navigation: navigation.state.params }
      ),
      navigation: navigation.state.params,
    };

    return (
      <Layout
        {...layout.layout}
        context={context}
      >
        {(
          layout.children != null &&
          layout.children instanceof Array
        )
          ? layout.children.map(( child, index ) => (
            <Recursive
              key={`${child.component}_${index}`} // eslint-disable-line react/no-array-index-key
              {...child}
              context={context}
            />
          ))
          : (
            layout.children ||
            null
          )}
      </Layout>
    );
  }
}

export default withNavigation( LayoutLoader );
