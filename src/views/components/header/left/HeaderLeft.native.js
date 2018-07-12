import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { removeStartingAndEndingSlashes } from '../../../../utils';
import { Button, Box, Heading, Image } from '../../index';
import { LayoutConsumer } from '../../../layout';

class HeaderLeft extends Component {
  static propTypes = {
    navigationReducer: object,
    navigation: object,
    dispatch: func,
    logoSource: string,
    showBack: bool,
    showTitle: bool,
    showLogo: bool,
    showMenu: bool,
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
    const {
      navigationReducer,
      showBack,
      logoSource,
      showTitle,
      showLogo,
      showMenu,
    } = this.props;
    const { index, routes } = navigationReducer;
    const { params } = routes[index];
    const title = params && params.title;

    const strippedLayoutName = (
      params != null &&
      removeStartingAndEndingSlashes( params.layout )
    );

    const canShowBack = (
      index > 0 &&
      strippedLayoutName &&
      strippedLayoutName !== 'home'
    );

    return (
      <LayoutConsumer>
        {layout => (
          <Box alignItems="center">
            {(
              showBack &&
              canShowBack
            )
              ? (
                <Button
                  onPress={this.handleBack}
                  size="md"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="arrow-back"
                  paddingX={15}
                />
              ) : showMenu ? (
                <Button
                  onPress={this.handleToggleMenu}
                  size="md"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="menu"
                  paddingX={15}
                />
              ) : null
            }

            {showLogo ? (
              <Box
                marginLeft={5}
                marginRight={20}
              >
                <Image
                  height="100%"
                  source={logoSource}
                />
              </Box>
            ) : null}

            {showTitle ? (
              <Box marginLeft={5}>
                <Heading
                  size="lg"
                  color={layout.textColor}
                >
                  {title}
                </Heading>
              </Box>
            ) : null}
          </Box>
        )}
      </LayoutConsumer>
    );
  }
}

export { HeaderLeft };

const mapStateToProps = state => ({
  navigationReducer: state.navigation,
});

export default (
  connect( mapStateToProps )( withNavigation( HeaderLeft ))
);
