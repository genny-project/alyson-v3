import React, { Component } from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf } from 'prop-types';
import { Box } from '../index';
import HeaderLeft from './left';
import HeaderRight from './right';
import { LayoutConsumer } from '../../layout';
// import { PropInjection } from '../prop-injection';

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

class Header extends Component {
  static defaultProps = {
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
    navigation: object,
  }

  render() {
    const {
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
    } = this.props;

    return (
      <LayoutConsumer>
        {layout => (
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
              stackNavigation={navigation}
              title={title}
            />
            <HeaderRight {...headerRight} />
          </Box>
        )}
      </LayoutConsumer>
    );
  }
}

export default Header;
