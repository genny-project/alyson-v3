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
        {props => (
          <LayoutConsumer>
            {layout => (
              <StatusBar
                barStyle={props.barStyle}
                backgroundColor={props.backgroundColor || layout.appColor}
              >
                {ifIphoneX ? (
                  <Box
                    position="absolute"
                    top={-( props.height + getStatusBarHeight())}
                    left={0}
                    width="100%"
                    height={props.height + getStatusBarHeight()}
                    backgroundColor={props.backgroundColor || layout.appColor}
                  />
                ) : null}

                <Box
                  height={props.height}
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  backgroundColor={props.backgroundColor || layout.appColor}
                  paddingX={props.paddingX}
                  paddingY={props.paddingY}
                  padding={props.padding}
                  boxShadow={props.boxShadow}
                >
                  <HeaderLeft
                    {...props.headerLeft}
                    title={props.title}
                  />
                  <HeaderRight {...props.headerRight} />
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
