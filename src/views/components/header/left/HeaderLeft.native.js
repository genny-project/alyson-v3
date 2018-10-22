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
    title: string,
    backIcon: string,
    backIconSize: string,
    backIconColor: string,
    keycloak: object,
    replaceLogoWithBack: bool,
    logoOpensMenu: bool,
    titleProps: object,
    logoProps: object,
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
      titleProps,
      logoProps,
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
          <Box
            alignItems="center"
            height="100%"
          >
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
                  height: '100%',
                }}
              >
                <Box
                  paddingX={15}
                  height="100%"
                  alignItems="center"
                >
                  <Image
                    height={50}
                    width={50}
                    {...logoProps}
                    source={logoSource}
                  />
                </Box>
              </Touchable>
              ) : (
                showBack &&
                canShowBack
              ) ? (
                <Button
                  onPress={this.handleBack}
                  size={backIconSize}
                  color="transparent"
                  textColor={backIconColor || layout.textColor}
                  icon={backIcon}
                  width={(
                    logoProps &&
                    logoProps.width
                  ) || 50}
                  height={(
                    logoProps &&
                    logoProps.height
                  ) || 50}
                  marginLeft={10}
                  marginRight={10}
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
                ) : null}

            {showTitle ? (
              <Box marginLeft={5}>
                <Heading
                  size="lg"
                  color={layout.textColor}
                  {...titleProps}
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
