import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Button, Box, Heading } from '../../../components';
import { LayoutConsumer } from '../../../layout';

class HeaderLeft extends Component {
  static propTypes = {
    navigationReducer: object,
    navigation: object,
    baseEntities: object,
    aliases: object,
    dispatch: func,
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerOpen' );
  }

  handleBack = () => {
    const { dispatch } = this.props;

    dispatch(
      NavigationActions.back()
    );
  }

  render() {
    const { baseEntities, aliases, navigationReducer } = this.props;
    const projectAttributes = baseEntities.attributes[aliases.PROJECT];
    const { index, routes } = navigationReducer;
    const { routeName } = routes[index];

    return (
      <LayoutConsumer>
        {layout => (
          <Box
            alignItems="center"
          >
            {(
              index > 0 &&
              routeName !== 'home'
            )
              ? (
                <Button
                  onPress={this.handleBack}
                  size="lg"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="arrow-back"
                  paddingX={10}
                />
              ) : (
                <Button
                  onPress={this.handleToggleMenu}
                  size="lg"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="menu"
                  paddingX={10}
                />
              )
            }

            <Heading
              size="lg"
              marginY={0}
              color={layout.textColor}
            >
              {routeName !== 'home'
                ? layout.title
                : (
                  projectAttributes &&
                  projectAttributes.PRI_NAME &&
                  projectAttributes.PRI_NAME.valueString
                ) || (
                  'Loading...'
                )
              }
            </Heading>
          </Box>
        )}
      </LayoutConsumer>
    );
  }
}

export { HeaderLeft };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
  navigationReducer: state.navigation,
});

export default (
  connect( mapStateToProps )( withNavigation( HeaderLeft ))
);
