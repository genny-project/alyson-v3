import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StatusBar, Platform } from 'react-native';
import { object } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './Header.style';
import HeaderItem from './item';

class Header extends Component {
  static propTypes = {
    navigation: object,
  }

  componentDidMount() {
    StatusBar.setBarStyle( 'light-content' );

    if ( Platform.OS === 'android' )
      StatusBar.setTranslucent( true );
  }

  handleToggleMenu = () => {
    const { navigation } = this.props;

    navigation.navigate( 'DrawerToggle' );
    console.log( 'toggle' ); // eslint-disable-line no-console
  }

  render() {
    const { navigation } = this.props; // eslint-disable-line no-unused-vars

    return (
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
            style={styles.menuWrapper}
          >
            <MaterialIcons
              name="menu"
              style={styles.menuIcon}
            />
          </TouchableWithoutFeedback>

          <Text style={styles.title}>Genny</Text>
        </View>

        <View style={styles.right}>
          <HeaderItem
            onPress={this.handleToggleMenu}
            icon="chat"
          />

          <HeaderItem
            onPress={this.handleToggleMenu}
            icon="notifications"
          />

          <HeaderItem
            onPress={this.handleToggleMenu}
            icon="person"
          />
        </View>
      </View>
    );
  }
}

export default Header;
