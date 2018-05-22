import React from 'react';
import { Platform } from 'react-native';
import { Box, Dropdown, KeycloakConsumer } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import HeaderItem from '../item';

const HeaderRight = () => (
  <KeycloakConsumer>
    {({ user, isAuthenticated }) => (
      <LayoutConsumer>
        {({ appColor, textColor }) => (
          <Box
            paddingX={5}
            alignItems="center"
          >
            <HeaderItem
              href="chat"
              icon="chat"
              textColor={textColor}
            />

            <HeaderItem
              href="alerts"
              icon="notifications"
              textColor={textColor}
            />

            <Dropdown
              paddingX={5}
              backgroundColor={appColor}
              textColor={textColor}
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
      </LayoutConsumer>
    )}
  </KeycloakConsumer>
);

export default HeaderRight;
