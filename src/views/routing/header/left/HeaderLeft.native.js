import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { object } from 'prop-types';
import { Link, Button, Box, Heading } from '../../../components';

class HeaderLeft extends Component {
  static propTypes = {
    navigation: object,
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
    const { index, routes } = this.props.navigation.state;
    const { routeName } = routes[index];

    return (
      <Box
        alignItems="center"
      >
        {(
          index > 0 &&
          routeName !== 'home'
        ) ? (
          <Button
            onPress={this.handleBack}
            size="lg"
            color="transparent"
            textColor="white"
            icon="arrow-back"
            paddingX={10}
          />
        ) : (
          <Button
            onPress={this.handleToggleMenu}
            size="lg"
            color="transparent"
            textColor="white"
            icon="menu"
            paddingX={10}
          />
        )}

        <Link to="home">
          <Heading
            size="md"
            marginY={0}
            color="white"
            onPress={this.handlePopToTop}
          >
            Genny
          </Heading>
        </Link>
      </Box>
    );
  }
}

export default withNavigation( HeaderLeft );
