import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { removeStartingAndEndingSlashes } from '../../../../utils';
import { Button, Box, Heading, Image } from '../../index';
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
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerOpen' );
  }

  handleBack = () => {
    const { dispatch, keycloak, navigation } = this.props;

    if ( keycloak.isAuthenticated ) {
      dispatch(
        NavigationActions.back()
      );
    }
    else {
      navigation.goBack();
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
                marginRight={10}
              >
                <Image
                  height={50}
                  width={50}
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
  connect( mapStateToProps )(
    withKeycloak( HeaderLeft )
  )
);
