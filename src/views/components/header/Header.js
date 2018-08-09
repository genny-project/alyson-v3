import React, { Component } from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf } from 'prop-types';
import { ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Box, StatusBar } from '../index';
import HeaderLeft from './left';
import HeaderRight from './right';
import { LayoutConsumer } from '../../layout';
import { PropInjection } from '../prop-injection';

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

class Header extends Component {
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
    return (
      <PropInjection {...this.props}>
        {({
          barStyle,
          backgroundColor,
          height,
          paddingX,
          paddingY,
          padding,
          boxShadow,
          headerLeft,
          headerRight,
          title,
          navigation,
          ...restProps
        }) => (
          <LayoutConsumer>
            {layout => (
              <StatusBar
                barStyle={barStyle}
                backgroundColor={backgroundColor || layout.appColor}
              >
                {ifIphoneX ? (
                  <Box
                    position="absolute"
                    top={-( height + getStatusBarHeight())}
                    left={0}
                    width="100%"
                    height={height + getStatusBarHeight()}
                    backgroundColor={backgroundColor || layout.appColor}
                  />
                ) : null}

                <Box
                  {...restProps}
                  height={height}
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  backgroundColor={backgroundColor || layout.appColor}
                  paddingX={paddingX}
                  paddingY={paddingY}
                  padding={padding}
                  boxShadow={boxShadow}
                >
                  <HeaderLeft
                    {...headerLeft}
                    navigation={navigation}
                    title={title}
                  />
                  <HeaderRight {...headerRight} />
                </Box>
              </StatusBar>
            )}
          </LayoutConsumer>
        )}
      </PropInjection>
    );
  }
}

export default Header;
