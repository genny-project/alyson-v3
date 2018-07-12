import React from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool } from 'prop-types';
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
  itemsRight = [
    {
      id: 'chat',
      icon: 'chat',
      href: 'chat',
      platforms: ['ios'],
      buttonCode: 'ad',
    },
    {
      id: 'profile',
      icon: 'account-circle',
      href: '/profile',
      eventType: 'PROFILE',
      buttonCode: 'PROFILE',
      platforms: ['ios'],
    },
    {
      id: 'dropdown',
      dropdown: true,
      text: 'Hi, {{user.attributes.PRI_FIRST_NAME.value}}!',
      platforms: ['android', 'web'],
      items: [
        {
          id: 'profile',
          href: '/profile',
          icon: 'person',
          text: 'Profile',
        },
        {
          id: 'logout',
          icon: 'power-settings-new',
          href: '/logout',
          text: 'Logout',
        },
      ],
    },
  ],
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
      <HeaderLeft />

      <HeaderRight
        items={itemsRight}
      />
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
  itemsRight: arrayOf( headerItemPropTypes ),
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
