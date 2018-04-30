import React from 'react';
import { Box, Dropdown, KeycloakConsumer } from '../../../components';
import HeaderItem from '../item';

const HeaderRight = () => (
  <KeycloakConsumer>
    {({ user, isAuthenticated }) => (
      <Box
        paddingX={5}
        alignItems="center"
      >
        <HeaderItem
          href="chat"
          icon="chat"
        />

        <HeaderItem
          href="alerts"
          icon="notifications"
        />

        <Dropdown
          text={isAuthenticated ? `Hi, ${user.firstName}!` : 'G\'day!'}
          iconWhenTextHidden="person"
          facingRight
          items={[
            {
              text: 'Settings',
              icon: 'settings',
              href: 'home',
            },
            {
              text: 'Logout',
              icon: 'power-settings-new',
              href: 'logout',
            },
          ]}
        />
      </Box>
    )}
  </KeycloakConsumer>
);

export default HeaderRight;
