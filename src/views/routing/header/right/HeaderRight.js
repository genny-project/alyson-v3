import React from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Dropdown, Icon } from '../../../components';
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

          <Dropdown
            padding={0}
            paddingX={5}
            backgroundColor={appColor}
            textColor={textColor}
            text={(
              Platform.select({
                web: (
                  firstName ? (
                    `Hi, ${firstName}!`
                  ) : (
                    <ActivityIndicator
                      size="small"
                    />
                  )
                ),
                default: (
                  <Icon
                    name="account-circle"
                    color="white"
                  />
                ),
              })
            )}
            disabled={!firstName}
            facingRight
            items={[
              {
                text: 'Profile',
                icon: 'person',
                href: 'profile',
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
