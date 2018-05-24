import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { Button, Box, Heading } from '../../../components';
import { LayoutConsumer } from '../../../layout';

class HeaderLeft extends Component {
  static propTypes = {
    navigation: object,
    baseEntities: object,
    aliases: object,
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerOpen' );
  }

  handlePopToTop = () => {
    const { navigation } = this.props;

    navigation.popToTop();
  }

  handleBack = () => {
    const { navigation } = this.props;

    navigation.pop();
  }

  render() {
    const { baseEntities, aliases } = this.props;
    const { index, routes } = this.props.navigation.state;
    const { routeName } = routes[index];
    const projectAttributes = baseEntities.attributes[aliases.PROJECT];

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
              {(
                index > 0 &&
                routeName !== 'home'
              )
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
});

export default (
  connect( mapStateToProps )( withNavigation( HeaderLeft ))
);
