import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { removeStartingAndEndingSlashes } from '../../../../utils';
import { Button, Box, Heading, Image, Touchable } from '../../index';
import { withKeycloak } from '../../keycloak';
import { LayoutConsumer } from '../../../layout';

class HeaderLeft extends Component {
  static defaultProps = {
    backIcon: 'arrow-back',
    backIconSize: 'md',
  }

  static propTypes = {
    navigationReducer: object,
    navigation: object,
    stackNavigation: object,
    dispatch: func,
    logoSource: string,
    showBack: bool,
    showTitle: bool,
    showLogo: bool,
    showMenu: bool,
    forceShowBack: bool,
    logoAsMenuButton: bool,
    title: string,
    backIcon: string,
    backIconSize: string,
    backIconColor: string,
    keycloak: object,
    replaceLogoWithBack: bool,
    logoOpensMenu: bool,
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerOpen' );
  }

  handleBack = () => {
    const { dispatch, keycloak, stackNavigation } = this.props;

    if ( keycloak.isAuthenticated ) {
      dispatch(
        NavigationActions.back()
      );
    }
    else {
      stackNavigation.goBack();
    }
  }

  render() {
    const {
      navigationReducer,
      showBack,
      logoSource,
      showTitle,
      showLogo,
      showMenu,
      forceShowBack,
      backIcon,
      backIconColor,
      backIconSize,
      replaceLogoWithBack,
      logoOpensMenu,
      logoAsMenuButton,
    } = this.props;
    const { index, routes } = navigationReducer;
    const { params } = routes[index];
    const title = this.props.title || ( params && params.title );

    const strippedLayoutName = (
      params != null &&
      removeStartingAndEndingSlashes( params.layout )
    );

    const canShowBack = forceShowBack || (
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
                  size={backIconSize}
                  color="transparent"
                  textColor={backIconColor || layout.textColor}
                  icon={backIcon}
                  width={50}
                  marginLeft={5}
                  marginRight={5}
                />
              ) : showMenu ? (
                <Button
                  onPress={this.handleToggleMenu}
                  size="md"
                  color="transparent"
                  textColor={layout.textColor}
                  icon="menu"
                  width={50}
                  marginLeft={5}
                  marginRight={5}
                />
              ) : null
            }

            {(
              showLogo &&
              !(
                replaceLogoWithBack &&
                showBack &&
                canShowBack
              )
            ) ? (
              <Touchable
                {...logoOpensMenu && {
                  withFeedback: true,
                  onPress: this.handleToggleMenu,
                }}
              ) : showMenu &&
                !logoAsMenuButton ? (
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

            {logoAsMenuButton ? (
              <Touchable
                onPress={this.handleToggleMenu}
              >
                <Box
                  marginLeft={5}
                  marginRight={10}
                >
                  <Image
                    height={50}
                    width={50}
                    source={logoSource}
                  />
                </Box>
              </Touchable>
            ) : showLogo ? (
              <Box
                marginLeft={5}
                marginRight={10}
              >
                <Box paddingX={5}>
                  <Image
                    height={50}
                    width={50}
                    source={logoSource}
                  />
                </Box>
              </Touchable>
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
  connect( mapStateToProps )(
    withNavigation(
      withKeycloak( HeaderLeft )
    )
  )
);
