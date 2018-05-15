import React, { PureComponent, Fragment } from 'react';
import { ActivityIndicator } from 'react-native';
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
  }

  handleRetry = () => {
    refresh();
  }

  render() {
    const { layout, data } = this.props;

    if ( !layout ) {
      return (
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
      );
    }

    /* Calculate the data for the layout */
    const context = { query: new DataQuery( data ).query( layout.query || [] ) };

    return (
      <Layout {...layout.layout} context={context}>
        {(
          layout.children != null &&
          layout.children instanceof Array
        )
          ? layout.children.map(( child, index ) => (
            <Recursive
              {...child}
              context={context}
              key={`${child.component}_${index}`} // eslint-disable-line react/no-array-index-key
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

export default LayoutLoader;
