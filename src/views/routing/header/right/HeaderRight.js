import React from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Dropdown } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import HeaderItem from '../item';

const HeaderRight = ({ aliases, baseEntities }) => {
  const firstName = dlv( baseEntities, `attributes.${aliases.USER}.PRI_FIRSTNAME.valueString` );

  return (
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
              firstName ? (
                Platform.select({
                  ios: firstName,
                  android: firstName,
                  web: `Hi, ${firstName}!`,
                })
              ) : (
                <ActivityIndicator size="small" />
              )
            )}
            disabled={!firstName}
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
  );
};

HeaderRight.propTypes = {
  baseEntities: object,
  aliases: object,
};

const mapStateToProps = state => ({
  aliases: state.vertx.aliases,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( HeaderRight );
