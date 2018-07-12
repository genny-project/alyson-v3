import React from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf } from 'prop-types';
import { Box, StatusBar } from '../index';
import HeaderLeft from './left';
import HeaderRight from './right';
import { LayoutConsumer } from '../../layout';

const Header = ({
  layout,
  backgroundColor = layout.appColor,
  barStyle = 'light-content',
  boxShadow = 'light',
  paddingX = 5,
  paddingY,
  padding,
  height = 60,
  headerLeft,
  headerRight,
}) => (
  <StatusBar
    barStyle={barStyle}
    backgroundColor={backgroundColor}
  >
    <Box
      height={height}
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      backgroundColor={backgroundColor}
      paddingX={paddingX}
      paddingY={paddingY}
      padding={padding}
      boxShadow={boxShadow}
    >
      <HeaderLeft {...headerLeft} />
      <HeaderRight {...headerRight} />
    </Box>
  </StatusBar>
);

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

Header.propTypes = {
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
  }),
  headerRight: shape({
    items: arrayOf( headerItemPropTypes ),
  }),
};

export default props => (
  <LayoutConsumer>
    {layout => (
      <Header
        {...props}
        layout={layout}
      />
    )}
  </LayoutConsumer>
);
