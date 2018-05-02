import React from 'react';
import { Platform } from 'react-native';
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
          paddingX={5}
          text={(
            Platform.select({
              ios: user.firstName,
              android: user.firstName,
              web: isAuthenticated ? `Hi, ${user.firstName}!` : 'Options',
            })
          )}
          facingRight
          items={[
            {
              text: 'Settings',
              icon: 'settings',
              href: 'settings',
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
