import React, { Component } from 'react';
import { object, func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { removeStartingAndEndingSlashes } from '../../../../utils';
import { Button, Box, Heading, Image, Touchable } from '../../index';
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
    logoAsMenuButton: bool,
    title: string,
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
      logoAsMenuButton,
    } = this.props;
    const { index, routes } = navigationReducer;
    const { params } = routes[index];
    const title = this.props.title || ( params && params.title );

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
  connect( mapStateToProps )( withNavigation( HeaderLeft ))
);
