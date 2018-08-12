import React, { Component } from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf } from 'prop-types';
import { ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Box, StatusBar } from '../index';
import { LayoutConsumer } from '../../layout';
import Header from './Header.js';

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

class HeaderNative extends Component {
  static defaultProps = {
    barStyle: 'light-content',
    boxShadow: 'light',
    paddingX: 5,
    height: 60,
  }

  static propTypes = {
    height: oneOfType(
      [string, number]
    ),
    padding: oneOfType(
      [string, number]
    ),
    paddingX: oneOfType(
      [string, number]
    ),
    paddingY: oneOfType(
      [string, number]
    ),
    boxShadow: string,
    barStyle: string,
    backgroundColor: string,
    layout: object,
    title: string,
    headerLeft: shape({
      showMenu: oneOfType(
        [bool, arrayOf( oneOf( 'ios', 'native', 'android', 'web' ))]
      ),
      showTitle: oneOfType(
        [bool, arrayOf( oneOf( 'ios', 'native', 'android', 'web' ))]
      ),
      showLogo: oneOfType(
        [bool, arrayOf( oneOf( 'ios', 'native', 'android', 'web' ))]
      ),
      showBack: oneOfType(
        [bool, arrayOf( oneOf( 'ios', 'native', 'android', 'web' ))]
      ),
    }),
    headerRight: shape({
      items: arrayOf( headerItemPropTypes ),
    }),
  }

  render() {
    const { barStyle, backgroundColor } = this.props;

    return (
      <LayoutConsumer>
        {layout => (
          <StatusBar
            barStyle={barStyle}
            backgroundColor={backgroundColor || layout.appColor}
          >
            {ifIphoneX ? (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height={getStatusBarHeight( true )}
                backgroundColor={backgroundColor || layout.appColor}
              />
            ) : null}

            <Header
              {...this.props}
              marginTop={getStatusBarHeight( true )}
            />
          </StatusBar>
        )}
      </LayoutConsumer>
    );
  }
}

export default HeaderNative;
