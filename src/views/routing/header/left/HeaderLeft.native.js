import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { removeStartingAndEndingSlashes } from '../../../../utils';
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
    const { params } = routes[index];
    const title = params && params.title;
    const strippedLayoutName = (
      params != null &&
      removeStartingAndEndingSlashes( params.layout )
    );

    const showBack = (
      index > 0 &&
      strippedLayoutName &&
      strippedLayoutName !== 'home'
    );

    return (
      <LayoutConsumer>
        {layout => (
          <Box
            alignItems="center"
          >
            {showBack
              ? (
                <Button
                  onPress={this.handleBack}
                  size="md"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="arrow-back"
                  paddingX={15}
                />
              ) : (
                // <Button
                //   onPress={this.handleToggleMenu}
                //   size="md"
                //   color="transparent"
                //   textColor={layout.textColor}
                //   icon="menu"
                //   paddingX={15}
                // />
                null
              )
            }

            <Box marginLeft={5}>
              <Heading
                size="lg"
                color={layout.textColor}
              >
                {(
                  strippedLayoutName &&
                  strippedLayoutName !== 'home' &&
                  title
                )
                  ? title
                  : (
                    projectAttributes &&
                    projectAttributes.PRI_NAME &&
                    projectAttributes.PRI_NAME.valueString && 'Four Degrees'
                  ) || (
                    'Loading...'
                  )
                }
              </Heading>
            </Box>
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
